import Link from 'next/link';

interface NovelCardProps {
  novel: {
    id: string;
    title: string;
    author: string;
    description: string;
    category: string;
    cover_url?: string;
  };
  searchTerm?: string;
}

const NovelCard = ({ novel, searchTerm = '' }: NovelCardProps) => {
  // 高亮搜索词
  const highlightTitle = () => {
    if (!searchTerm) return novel.title;
    
    const parts = novel.title.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className="text-red-500 font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Link href={`/novel/${novel.id}`} className="novel-card">
      <div className="novel-card-cover">
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
      <div className="novel-card-content">
        <h3 className="novel-card-title">{highlightTitle()}</h3>
        <p className="novel-card-author">作者：{novel.author}</p>
      </div>
    </Link>
  );
};

export default NovelCard;