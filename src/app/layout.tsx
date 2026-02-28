import './globals.css';
import Navbar from '@/components/Navbar';
import DeviceRestriction from '@/components/DeviceRestriction';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '臨界小説',
  description: '一个现代化的小说阅读网站',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gray-50`}>
        <DeviceRestriction>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <SpeedInsights />
        </DeviceRestriction>
      </body>
    </html>
  );
}