'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // 监听用户认证状态
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // 初始获取用户状态
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getCurrentUser();

    return () => subscription.unsubscribe();
  }, []);

  const categories = [
    { name: '首页', href: '/' },
    { name: '科幻', href: '/category/sci-fi' },
    { name: '现实主义', href: '/category/realism' },
    { name: '古典文学', href: '/category/classical' },
    { name: '悬疑', href: '/category/mystery' },
    { name: '历史', href: '/category/history' },
    { name: '武侠', href: '/category/martial-arts' },
  ];

  // 搜索功能
  const [searchTerm, setSearchTerm] = useState('');
  
  // 用户菜单状态
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  
  // 点击其他地方关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = mobileMenuRef.current;
      const desktopMenu = desktopMenuRef.current;
      
      if (
        (mobileMenu && !mobileMenu.contains(event.target as Node)) &&
        (desktopMenu && !desktopMenu.contains(event.target as Node))
      ) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 隐藏登录和注册页面的导航栏
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchTerm.trim())}`;
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Mobile Header */}
        <div className="md:hidden">
          {/* Logo, Navigation, and User at the top */}
          <div className="py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">临界小说</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
                主页
              </Link>
              <Link href="/bookshelf" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">
                书架
              </Link>
            </div>
            
            {/* User */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-2" ref={mobileMenuRef}>
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 ${menuOpen ? 'block' : 'hidden'}`}>
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {user.email || '用户'}
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>登出</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  登录
                </Link>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="py-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索小说..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">临界小说</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex space-x-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                主页
              </Link>
              <Link
                href="/bookshelf"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                书架
              </Link>
              {categories.filter(category => category.name !== '首页').map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Search and User */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索小说..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
              <div className="flex items-center">
                {user ? (
                  <div className="relative" ref={desktopMenuRef}>
                    <div 
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <span className="text-gray-600 font-medium">{user.email}</span>
                    </div>
                    <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 ${menuOpen ? 'block' : 'hidden'}`}>
                      <div className="px-4 py-2 text-sm text-gray-700">
                        {user.email || '用户'}
                      </div>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>登出</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    登录
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;