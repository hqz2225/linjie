'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { getNovelById, getChapters, addToBookshelf } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default function NovelDetail() {
  const params = useParams();
  const novelId = params.id as string;
  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 监听用户认证状态
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // 初始获取用户状态
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getCurrentUser();

    return () => subscription.unsubscribe();
  }, []);

  // 获取小说和章节数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取小说信息
        const novelData = await getNovelById(novelId);
        if (novelData) {
          setNovel(novelData);
        }

        // 获取章节列表
        const chaptersData = await getChapters(novelId);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Error fetching novel data:', err);
        setError('获取小说数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [novelId]);

  // 初始化收藏状态
  useEffect(() => {
    if (!user) return;

    const checkBookshelf = async () => {
      try {
        const { data, error } = await supabase
          .from('bookshelf')
          .select('id')
          .eq('user_id', user.id)
          .eq('novel_id', novelId)
          .single();

        if (error) {
          console.error('Error checking bookshelf:', error);
          return;
        }

        setIsFavorite(!!data);
      } catch (err) {
        console.error('Error checking bookshelf:', err);
      }
    };

    checkBookshelf();
  }, [user, novelId]);

  if (loading) {
    return <div className="text-center py-16">加载中...</div>;
  }

  if (!novel) {
    return <div className="text-center py-16">小说不存在</div>;
  }

  const toggleFavorite = async () => {
    if (!user) {
      // 跳转到登录页面
      window.location.href = '/login';
      return;
    }

    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    // 调用 addToBookshelf 函数
    setLoading(true);
    setError('');
    
    try {
      const result = await addToBookshelf(novelId);
      if (!result.success) {
        setError(result.error || '操作失败');
        // 恢复原来的状态
        setIsFavorite(!newFavoriteStatus);
      }
    } catch (err) {
      setError('操作失败，请稍后重试');
      // 恢复原来的状态
      setIsFavorite(!newFavoriteStatus);
      console.error('添加到书架错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 小说信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 封面 */}
          <div className="md:w-1/4">
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">
              {novel.cover_url ? (
                <img 
                  src={novel.cover_url} 
                  alt={novel.title} 
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className="text-gray-400">封面占位</span>
              )}
            </div>
          </div>

          {/* 信息 */}
          <div className="md:w-3/4 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">{novel.title}</h1>
            <div className="flex flex-wrap gap-4">
              <p className="text-gray-600">作者：{novel.author}</p>
              <p className="text-gray-600">分类：{novel.category}</p>
            </div>
            <p className="text-gray-700 leading-relaxed">{novel.description}</p>
            <div className="pt-4 flex gap-4">
              <Link href={`/read/${novel.id}`} className="btn-primary">
                开始阅读
              </Link>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              {user ? (
                <button
                  onClick={toggleFavorite}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${isFavorite ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                  ) : isFavorite ? (
                    <Heart className="h-5 w-5" />
                  ) : (
                    <HeartOff className="h-5 w-5" />
                  )}
                  {isFavorite ? '已收藏' : '收藏'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                >
                  <HeartOff className="h-5 w-5" />
                  登录收藏
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">章节列表</h2>
        <div className="space-y-2">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/read/${novel.id}?chapter=${chapter.chapter_number}`}
                className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-gray-400 text-sm">阅读</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">暂无章节</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}