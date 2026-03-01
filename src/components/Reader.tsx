'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, Sun, Moon, Type } from 'lucide-react';

// 处理内容，将换行符转换为HTML段落
function processContent(content: string) {
  // 检查是否已经是HTML格式
  if (content.includes('<p>') || content.includes('<br>')) {
    return content;
  }
  
  // 将连续的换行符转换为段落
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim() !== '');
  
  if (paragraphs.length === 0) {
    return '<p>&ensp;&ensp;' + content + '</p>';
  }
  
  return paragraphs.map(p => '<p>&ensp;&ensp;' + p.replace(/\n/g, '<br>') + '</p>').join('');
}

interface ReaderProps {
  novelTitle: string;
  chapterTitle: string;
  content: string;
  chapters: { id: number; chapter_number: number; title: string }[];
  currentChapterNumber: number;
  onChapterChange: (chapterNumber: number) => void;
}

const Reader = ({ novelTitle, chapterTitle, content, chapters, currentChapterNumber, onChapterChange }: ReaderProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      {/* 顶部导航 */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex items-center justify-between`}>
        <button
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          onClick={() => setShowMenu(!showMenu)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">{novelTitle}</h1>
        <div className="w-8"></div> {/* 占位，保持标题居中 */}
      </header>

      {/* 侧边菜单 */}
      {showMenu && (
        <div className={`fixed inset-0 z-20 ${darkMode ? 'bg-gray-900/80' : 'bg-black/50'}`} onClick={() => setShowMenu(false)}>
          <div className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">目录</h2>
              <button onClick={() => setShowMenu(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  className={`w-full text-left p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${chapter.chapter_number === currentChapterNumber ? 'font-bold' : ''}`}
                  onClick={() => {
                    onChapterChange(chapter.chapter_number);
                    setShowMenu(false);
                  }}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <main className="container mx-auto px-4 py-8 pb-24 max-w-2xl" style={{ fontSize: `${fontSize}px` }}>
        <h2 className="text-2xl font-bold mb-6">{chapterTitle}</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: processContent(content) }} />
      </main>

      {/* 底部控制栏 */}
      <footer className={`fixed bottom-0 left-0 right-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm p-4 flex items-center justify-between w-full`}>
        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={decreaseFontSize}
          >
            <Type className="h-4 w-4" />
          </button>
          <span className="text-sm">{fontSize}px</span>
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={increaseFontSize}
          >
            <Type className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={() => {
              const currentIndex = chapters.findIndex(ch => ch.chapter_number === currentChapterNumber);
              if (currentIndex > 0) {
                onChapterChange(chapters[currentIndex - 1].chapter_number);
              }
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            onClick={() => {
              const currentIndex = chapters.findIndex(ch => ch.chapter_number === currentChapterNumber);
              if (currentIndex < chapters.length - 1) {
                onChapterChange(chapters[currentIndex + 1].chapter_number);
              }
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Reader;