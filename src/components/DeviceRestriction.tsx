'use client';

import { useState, useEffect } from 'react';

interface DeviceRestrictionProps {
  children: React.ReactNode;
}

export default function DeviceRestriction({ children }: DeviceRestrictionProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);
  
  // 显示空白页面，直到设备类型判断完成
  if (isMobile === null) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }
  
  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">暫未適配電腦端</h1>
          <p className="text-gray-600">请使用移动设备访问本网站</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
