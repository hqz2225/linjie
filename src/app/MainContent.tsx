'use client';

import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const isReadPage = pathname?.startsWith('/read/') || false;
  
  if (isReadPage) {
    return <>{children}</>;
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  );
}
