'use client';

import { useState, useEffect } from 'react';
import NovelCard from './NovelCard';
import { getNovels } from '@/lib/db';

interface SearchResultsProps {
  searchTerm: string;
}

const SearchResults = ({ searchTerm = '' }: SearchResultsProps) => {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await getNovels();
        // 随机排序小说
        const shuffledNovels = shuffleArray(data);
        setNovels(shuffledNovels);
      } catch (error) {
        console.error('Error fetching novels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  // 随机排序数组
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 过滤小说
  const filteredNovels = searchTerm
    ? novels.filter((novel) =>
        novel.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : novels;

  return (
    <div className="py-8">
      {/* 搜索结果提示 */}
      {searchTerm && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            {filteredNovels.length > 0 ? (
              <h2 className="text-xl font-bold">
                搜索结果: "{searchTerm}"
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-red-500">
                找不到包含 "{searchTerm}" 的书籍
              </h2>
            )}
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition-colors duration-200"
          >
            返回首页
          </button>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNovels.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} searchTerm={searchTerm} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">
            {searchTerm ? '没有找到匹配的小说' : '暂无小说数据'}
          </h3>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
