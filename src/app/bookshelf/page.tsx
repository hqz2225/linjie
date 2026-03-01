'use client';

import { useState, useEffect } from 'react';
import NovelCard from '@/components/NovelCard';
import { getBookshelf } from '@/lib/db';
import supabase from '@/lib/supabase';

export default function Bookshelf() {
  const [bookshelfNovels, setBookshelfNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  // 监听用户认证状态
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

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

  // 获取书架数据
  useEffect(() => {
    const fetchBookshelf = async () => {
      if (!user) {
        setBookshelfNovels([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await getBookshelf();
        if (result.success) {
          setBookshelfNovels(result.data || []);
        } else {
          setError(result.error || '获取书架失败');
          setBookshelfNovels([]);
        }
      } catch (err) {
        setError('获取书架失败，请稍后重试');
        setBookshelfNovels([]);
        console.error('获取书架错误:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelf();
  }, [user]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6">我的书架</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : !user ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">请先登录</p>
          <p className="text-gray-400 mt-2">登录后查看您的书架</p>
        </div>
      ) : bookshelfNovels.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {bookshelfNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">您的书架还没有书籍</p>
          <p className="text-gray-400 mt-2">浏览首页添加书籍到书架</p>
        </div>
      )}
    </div>
  );
}