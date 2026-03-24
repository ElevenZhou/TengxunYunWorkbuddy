'use client';

import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <span className="text-yellow-300 text-sm font-medium">AI搭子</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          不止是导航
          <br />
          <span className="text-blue-200">更是你的AI工作流设计师</span>
        </h1>
        
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          发现2000+ AI工具，探索100+工作流，让AI成为你工作的最佳搭档
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="搜索AI工具、工作流或输入你的需求..."
            className="w-full px-6 py-4 pl-14 rounded-full text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
            搜索
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {['AI写作', '图像生成', '视频剪辑', '代码助手', '数据分析'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 cursor-pointer transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
