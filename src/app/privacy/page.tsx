import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">隐私政策</h1>
          
          <div className="space-y-4 text-gray-700">
            <p className="mb-4">
              临界小说网站（以下简称"本网站"）尊重并保护用户的隐私。本政策旨在向您说明本网站如何收集、使用、存储和保护您的个人信息。请您仔细阅读本政策，了解我们的隐私保护措施。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">1. 信息收集</h2>
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
            
            <h2 className="text-lg font-semibold mt-6 mb-3">2. 信息使用</h2>
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
            
            <h2 className="text-lg font-semibold mt-6 mb-3">3. 信息共享</h2>
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
            
            <h2 className="text-lg font-semibold mt-6 mb-3">4. 信息保护</h2>
            <p>
              4.1 我们采取安全措施保护您的个人信息，防止未经授权的访问和使用。
            </p>
            <p>
              4.2 我们使用加密技术、访问控制、安全审计等措施保护您的信息。
            </p>
            <p>
              4.3 我们定期审查和更新我们的安全措施，以适应新的安全威胁。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">5. 信息访问与控制</h2>
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
            
            <h2 className="text-lg font-semibold mt-6 mb-3">6.  cookies 和类似技术</h2>
            <p>
              6.1 我们使用cookies和类似技术来改善您的用户体验。
            </p>
            <p>
              6.2 您可以在浏览器设置中管理或禁用cookies，但这可能会影响某些功能的使用。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">7. 政策修改</h2>
            <p>
              7.1 我们保留根据法律法规修改本政策的权利。
            </p>
            <p>
              7.2 修改后，我们将通过网站公告通知您。您继续使用本网站服务即表示同意修改后的政策。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">8. 联系我们</h2>
            <p>
              如您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
            </p>
            <p>
              邮箱：contact@linjiexiaoshuo.com
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">9. 生效日期</h2>
            <p>
              本隐私政策自发布之日起生效。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
