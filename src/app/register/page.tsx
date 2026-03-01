'use client';

import { useState } from 'react';
import { signUp } from '@/lib/db';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const router = useRouter();

  // 处理注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证输入
    if (!email || !password || !confirmPassword) {
      setError('请填写所有必填字段');
      return;
    }

    if (!agreeTerms) {
      setError('请阅读并同意用户协议和隐私政策');
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
      
      if (!supabase) {
        setError('系统未初始化');
        return;
      }
      
      // 注册用户，Supabase 会自动发送确认邮箱
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
      
      // 注册成功，显示成功提示框
      setShowSuccessModal(true);
      // 开始检查邮箱验证状态
      checkEmailVerification();
    } catch (err) {
      console.error('注册异常:', err);
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 检查邮箱验证状态
  const checkEmailVerification = async () => {
    setCheckingVerification(true);
    
    // 轮询检查邮箱验证状态
    const interval = setInterval(async () => {
      try {
        if (!supabase) return;
        
        // 尝试登录，检查用户是否已经验证邮箱
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          // 如果登录失败，说明用户还没有验证邮箱
          console.log('用户还未验证邮箱:', error.message);
        } else {
          // 如果登录成功，说明用户已经验证邮箱
          console.log('用户已验证邮箱，登录成功:', data);
          clearInterval(interval);
          setCheckingVerification(false);
          setShowSuccessModal(false);
          // 跳转到主页
          router.push('/');
        }
      } catch (err) {
        console.error('检查邮箱验证状态异常:', err);
      }
    }, 3000); // 每3秒检查一次

    // 清理函数
    return () => clearInterval(interval);
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="确认密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  我已阅读并同意
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-purple-600 hover:text-purple-700 ml-1 underline"
                  >
                    《用户协议》
                  </button>
                  和
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-purple-600 hover:text-purple-700 ml-1 underline"
                  >
                    《隐私政策》
                  </button>
                </label>
              </div>
            </div>


          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              ) : null}
              注册
            </button>
          </div>

          {/* 用户协议模态框 */}
          {showTermsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowTermsModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">用户协议</h2>
                    <button
                      onClick={() => setShowTermsModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <p className="mb-4">
                      欢迎使用临界小说网站（以下简称"本网站"）。本协议是您与本网站之间的法律协议，规定了您使用本网站服务的权利和义务。请您仔细阅读本协议，确保您理解并同意本协议的全部内容。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">1. 适用范围</h3>
                    <p>
                      本协议适用于所有使用本网站服务的用户，包括注册用户和非注册用户。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">2. 用户资格</h3>
                    <p>
                      您必须年满18周岁才能注册和使用本网站。如果您未满18周岁，必须在父母或法定监护人的指导下使用本网站。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">3. 账号注册与管理</h3>
                    <p>
                      3.1 您需提供真实、准确、完整的个人信息，并在信息变更时及时更新。
                    </p>
                    <p>
                      3.2 您应妥善保管账号和密码，对使用您账号的所有行为负责。
                    </p>
                    <p>
                      3.3 如发现账号被他人非法使用，您应立即通知本网站。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">4. 用户行为规范</h3>
                    <p>
                      4.1 您不得使用本网站从事任何违法违规活动。
                    </p>
                    <p>
                      4.2 您不得发布或传播任何有害、淫秽、暴力、歧视等内容。
                    </p>
                    <p>
                      4.3 您不得侵犯他人的知识产权、隐私权等合法权益。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">5. 知识产权</h3>
                    <p>
                      本网站的所有内容，包括但不限于文字、图片、音频、视频等，均受知识产权法律保护。未经授权，您不得复制、修改、传播或用于商业目的。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">6. 服务变更与终止</h3>
                    <p>
                      6.1 本网站保留修改、暂停或终止部分或全部服务的权利。
                    </p>
                    <p>
                      6.2 如您违反本协议，本网站有权暂停或终止您的账号。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">7. 免责声明</h3>
                    <p>
                      本网站对因使用本网站服务而产生的任何直接或间接损失不承担责任。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">8. 协议修改</h3>
                    <p>
                      本网站保留修改本协议的权利，修改后将通过网站公告通知您。您继续使用本网站服务即表示同意修改后的协议。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">9. 法律适用与争议解决</h3>
                    <p>
                      本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。如发生争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">10. 其他条款</h3>
                    <p>
                      本协议构成您与本网站之间的完整协议，取代之前的任何口头或书面协议。如本协议的任何条款被认定为无效或不可执行，不影响其他条款的效力。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 隐私政策模态框 */}
          {showPrivacyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPrivacyModal(false)}></div>
              <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">隐私政策</h2>
                    <button
                      onClick={() => setShowPrivacyModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <p className="mb-4">
                      临界小说网站（以下简称"本网站"）尊重并保护用户的隐私。本政策旨在向您说明本网站如何收集、使用、存储和保护您的个人信息。请您仔细阅读本政策，了解我们的隐私保护措施。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">1. 信息收集</h3>
                    <p>
                      1.1 我们收集您的个人信息仅用于提供服务和改善用户体验。
                    </p>
                    <p>
                      1.2 我们可能收集的信息包括但不限于：
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>您的姓名、邮箱地址、联系方式等注册信息</li>
                      <li>您的阅读历史、偏好设置等使用信息</li>
                      <li>您的设备信息、IP地址等技术信息</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-6 mb-3">2. 信息使用</h3>
                    <p>
                      2.1 我们使用您的个人信息用于以下目的：
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>提供和维护本网站服务</li>
                      <li>处理您的注册、登录和其他请求</li>
                      <li>个性化您的用户体验</li>
                      <li>发送重要通知和更新</li>
                      <li>改进我们的服务和内容</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-6 mb-3">3. 信息共享</h3>
                    <p>
                      3.1 我们不会向第三方分享您的个人信息，除非获得您的授权或法律要求。
                    </p>
                    <p>
                      3.2 在以下情况下，我们可能会共享您的信息：
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>获得您的明确同意</li>
                      <li>遵守法律法规或响应法律程序</li>
                      <li>保护本网站或他人的权利、财产或安全</li>
                      <li>与我们的关联公司、服务提供商共享（这些第三方必须遵守本隐私政策）</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-6 mb-3">4. 信息保护</h3>
                    <p>
                      4.1 我们采取安全措施保护您的个人信息，防止未经授权的访问和使用。
                    </p>
                    <p>
                      4.2 我们使用加密技术、访问控制、安全审计等措施保护您的信息。
                    </p>
                    <p>
                      4.3 我们定期审查和更新我们的安全措施，以适应新的安全威胁。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">5. 信息访问与控制</h3>
                    <p>
                      5.1 您有权访问、修改或删除您的个人信息。
                    </p>
                    <p>
                      5.2 您可以通过以下方式管理您的信息：
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>登录您的账号修改个人信息</li>
                      <li>联系我们请求访问或删除您的信息</li>
                      <li>取消订阅我们的邮件通知</li>
                    </ul>
                    <h3 className="text-lg font-semibold mt-6 mb-3">6. cookies 和类似技术</h3>
                    <p>
                      6.1 我们使用cookies和类似技术来改善您的用户体验。
                    </p>
                    <p>
                      6.2 您可以在浏览器设置中管理或禁用cookies，但这可能会影响某些功能的使用。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">7. 政策修改</h3>
                    <p>
                      7.1 我们保留根据法律法规修改本政策的权利。
                    </p>
                    <p>
                      7.2 修改后，我们将通过网站公告通知您。您继续使用本网站服务即表示同意修改后的政策。
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">8. 联系我们</h3>
                    <p>
                      如您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
                    </p>
                    <p>
                      邮箱：contact@linjiexiaoshuo.com
                    </p>
                    <h3 className="text-lg font-semibold mt-6 mb-3">9. 生效日期</h3>
                    <p>
                      本隐私政策自发布之日起生效。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 邮箱确认提示模态框 */}
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">请确认邮箱</h2>
                  <p className="text-gray-600">
                    我们已经向您的邮箱发送了确认链接，请查收并点击链接完成注册。
                  </p>
                  <div className="pt-4">
                    <div className="flex flex-col items-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">正在等待您确认邮箱...</p>
                      <p className="text-sm text-gray-500 mt-2">确认后将自动跳转到主页</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
