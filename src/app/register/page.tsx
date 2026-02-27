'use client';

import { useState } from 'react';
import { signUp, resendVerificationCode, verifyEmail } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      setError('请先输入邮箱');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setSendingCode(true);
    setError('');

    try {
      console.log('开始发送验证码到:', email);
      
      // 直接使用 Supabase 的 resend 方法发送验证码
      // 这样可以在用户未注册的情况下发送验证码
      const { error } = await supabase.auth.resend({
        email: email,
        type: 'signup'
      });

      if (error) {
        console.error('Error sending verification code:', error);
        setError(`发送验证码失败: ${error.message}`);
        return;
      }

      console.log('验证码发送成功');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setError('验证码已发送到您的邮箱，请查收');
    } catch (err) {
      console.error('发送验证码异常:', err);
      setError('发送验证码失败，请稍后重试');
    } finally {
      setSendingCode(false);
    }
  };

  // 处理注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证输入
    if (!email || !password || !confirmPassword || !verificationCode) {
      setError('请填写所有必填字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setLoading(true);

    try {
      console.log('开始注册用户:', email);
      
      // 1. 注册用户，Supabase 会自动发送验证码
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        console.error('Error signing up:', error);
        setError(`注册失败: ${error.message}`);
        return;
      }

      console.log('注册成功，用户数据:', data);
      
      // 2. 验证验证码
      console.log('开始验证验证码');
      const verifyResult = await verifyEmail(email, verificationCode);
      if (!verifyResult.success) {
        console.error('验证码验证失败:', verifyResult.error);
        setError(verifyResult.error || '验证码错误');
        return;
      }

      console.log('验证码验证成功');
      
      // 3. 注册成功，跳转到首页
      router.push('/');
    } catch (err) {
      console.error('注册异常:', err);
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
            注册账户
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            或{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              登录已有账户
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="rounded-md -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                确认密码
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="verification-code" className="sr-only">
                验证码
              </label>
              <div className="flex space-x-2">
                <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="验证码"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                  className={`px-4 py-2 rounded-b-md font-medium transition-colors duration-200 whitespace-nowrap ${
                    sendingCode || countdown > 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {sendingCode ? (
                    '发送中...'
                  ) : countdown > 0 ? (
                    `${countdown}s后重发`
                  ) : (
                    '获取验证码'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              ) : null}
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
