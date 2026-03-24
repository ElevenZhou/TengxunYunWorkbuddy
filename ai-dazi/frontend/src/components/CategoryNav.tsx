'use client';

import { 
  Wand2, 
  Image, 
  Video, 
  Code, 
  BarChart3, 
  Music, 
  FileText,
  MessageSquare,
  Globe,
  MoreHorizontal
} from 'lucide-react';

const categories = [
  { id: 'writing', name: 'AI写作', icon: FileText, count: 320 },
  { id: 'image', name: '图像生成', icon: Image, count: 280 },
  { id: 'video', name: '视频剪辑', icon: Video, count: 150 },
  { id: 'code', name: '代码助手', icon: Code, count: 200 },
  { id: 'data', name: '数据分析', icon: BarChart3, count: 180 },
  { id: 'audio', name: '音频处理', icon: Music, count: 120 },
  { id: 'chat', name: 'AI对话', icon: MessageSquare, count: 90 },
  { id: 'web', name: '网站构建', icon: Globe, count: 140 },
  { id: 'other', name: '更多', icon: MoreHorizontal, count: 520 },
];

export default function CategoryNav() {
  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">工具分类</h2>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary-100 transition">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                <span className="text-xs text-gray-400">{category.count}+</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
