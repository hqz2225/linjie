import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">用户协议</h1>
          
          <div className="space-y-4 text-gray-700">
            <p className="mb-4">
              欢迎使用临界小说网站（以下简称"本网站"）。本协议是您与本网站之间的法律协议，规定了您使用本网站服务的权利和义务。请您仔细阅读本协议，确保您理解并同意本协议的全部内容。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">1. 适用范围</h2>
            <p>
              本协议适用于所有使用本网站服务的用户，包括注册用户和非注册用户。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">2. 用户资格</h2>
            <p>
              您必须年满18周岁才能注册和使用本网站。如果您未满18周岁，必须在父母或法定监护人的指导下使用本网站。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">3. 账号注册与管理</h2>
            <p>
              3.1 您需提供真实、准确、完整的个人信息，并在信息变更时及时更新。
            </p>
            <p>
              3.2 您应妥善保管账号和密码，对使用您账号的所有行为负责。
            </p>
            <p>
              3.3 如发现账号被他人非法使用，您应立即通知本网站。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">4. 用户行为规范</h2>
            <p>
              4.1 您不得使用本网站从事任何违法违规活动。
            </p>
            <p>
              4.2 您不得发布或传播任何有害、淫秽、暴力、歧视等内容。
            </p>
            <p>
              4.3 您不得侵犯他人的知识产权、隐私权等合法权益。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">5. 知识产权</h2>
            <p>
              本网站的所有内容，包括但不限于文字、图片、音频、视频等，均受知识产权法律保护。未经授权，您不得复制、修改、传播或用于商业目的。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">6. 服务变更与终止</h2>
            <p>
              6.1 本网站保留修改、暂停或终止部分或全部服务的权利。
            </p>
            <p>
              6.2 如您违反本协议，本网站有权暂停或终止您的账号。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">7. 免责声明</h2>
            <p>
              本网站对因使用本网站服务而产生的任何直接或间接损失不承担责任。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">8. 协议修改</h2>
            <p>
              本网站保留修改本协议的权利，修改后将通过网站公告通知您。您继续使用本网站服务即表示同意修改后的协议。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">9. 法律适用与争议解决</h2>
            <p>
              本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。如发生争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。
            </p>
            
            <h2 className="text-lg font-semibold mt-6 mb-3">10. 其他条款</h2>
            <p>
              本协议构成您与本网站之间的完整协议，取代之前的任何口头或书面协议。如本协议的任何条款被认定为无效或不可执行，不影响其他条款的效力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
