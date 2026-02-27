'use client';

export const runtime = 'edge';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Reader from '@/components/Reader';
import { getNovelById, getChapters, getChapter, updateReadingProgress } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default function ReadPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const novelId = params.id as string;
  const chapterNumber = parseInt(searchParams.get('chapter') || '1');

  const [novel, setNovel] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapter, setCurrentChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

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

        // 获取当前章节
        const chapterData = await getChapter(novelId, chapterNumber);
        if (chapterData) {
          setCurrentChapter(chapterData);

          // 如果用户已登录，更新阅读进度
          if (user) {
            await updateReadingProgress(novelId, chapterNumber);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [novelId, chapterNumber, user]);

  if (loading) {
    return <div className="text-center py-16">加载中...</div>;
  }

  if (!novel) {
    return <div className="text-center py-16">小说不存在</div>;
  }

  if (!currentChapter) {
    return <div className="text-center py-16">章节不存在</div>;
  }

  const handleChapterChange = (newChapterNumber: number) => {
    // 跳转到新章节
    window.location.href = `/read/${novelId}?chapter=${newChapterNumber}`;
  };

  return (
    <div className="min-h-screen">
      <Reader
        novelTitle={novel.title}
        chapterTitle={currentChapter.title}
        content={currentChapter.content}
        chapters={chapters}
        currentChapterNumber={chapterNumber}
        onChapterChange={handleChapterChange}
      />
    </div>
  );
}