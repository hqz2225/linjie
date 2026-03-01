'use client';

export const runtime = 'edge';

import Link from 'next/link';
import { Lock } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
            账户设置
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <Link
            href="/settings/password"
            className="block w-full px-4 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-4"
          >
            <div className="p-2 bg-blue-100 rounded-md">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">修改密码</h3>
              <p className="text-sm text-gray-500">更新您的账户密码</p>
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;