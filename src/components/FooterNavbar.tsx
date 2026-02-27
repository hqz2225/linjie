'use client';

import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

const FooterNavbar = () => {
  const pathname = usePathname();

  // 隐藏登录页面的底部导航栏
  if (pathname === '/login') {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          <Link 
            href="/" 
            className={`flex flex-col items-center justify-center px-4 py-2 ${pathname === '/' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <Home className={`h-6 w-6 mb-1 ${pathname === '/' ? 'text-primary-600' : 'text-gray-600'}`} />
            <span className="text-sm font-medium">主页</span>
          </Link>
          <Link 
            href="/bookshelf" 
            className={`flex flex-col items-center justify-center px-4 py-2 ${pathname === '/bookshelf' ? 'text-primary-600' : 'text-gray-600'}`}
          >
            <BookOpen className={`h-6 w-6 mb-1 ${pathname === '/bookshelf' ? 'text-primary-600' : 'text-gray-600'}`} />
            <span className="text-sm font-medium">书架</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterNavbar;