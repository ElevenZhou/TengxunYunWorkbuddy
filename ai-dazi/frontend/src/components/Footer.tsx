import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">AI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                搭子
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              发现最佳AI工具，学习高效工作流，让AI成为你的得力助手。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">快速链接</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  AI工具库
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  工作流
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  分类浏览
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">资源</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  博客
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  使用指南
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  API文档
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">联系我们</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  联系方式
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  意见反馈
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {currentYear} AI搭子. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">
                隐私政策
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
