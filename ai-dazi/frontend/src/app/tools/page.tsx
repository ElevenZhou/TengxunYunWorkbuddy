'use client';

import { useState } from 'react';
import ToolCard from '@/components/ToolCard';
import { Filter, Grid3X3, List } from 'lucide-react';

const categories = [
  '全部',
  'AI对话',
  '图像生成',
  '视频剪辑',
  '代码助手',
  'AI写作',
  '数据分析',
  '语音识别',
];

const mockTools = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'OpenAI开发的AI对话助手，支持多种语言，可进行自然对话、写作辅助、代码生成等',
    category: 'AI对话',
    rating: 4.8,
    reviews: 12500,
    tags: ['免费', '对话', '写作'],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Midjourney',
    description: '强大的AI图像生成工具，通过文字描述生成高质量艺术图像',
    category: '图像生成',
    rating: 4.7,
    reviews: 8900,
    tags: ['付费', '图像', '艺术'],
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长长文本处理和复杂推理任务',
    category: 'AI对话',
    rating: 4.6,
    reviews: 5600,
    tags: ['免费', '对话', '长文本'],
  },
  {
    id: '4',
    name: 'Stable Diffusion',
    description: '开源的AI图像生成模型，可在本地部署，支持自定义训练',
    category: '图像生成',
    rating: 4.5,
    reviews: 7200,
    tags: ['开源', '图像', '本地部署'],
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    description: 'AI编程助手，实时提供代码建议和自动补全',
    category: '代码助手',
    rating: 4.9,
    reviews: 15000,
    tags: ['付费', '代码', 'IDE'],
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Notion AI',
    description: '集成在Notion中的AI助手，帮助写作、总结和头脑风暴',
    category: 'AI写作',
    rating: 4.4,
    reviews: 4300,
    tags: ['付费', '写作', '笔记'],
  },
  {
    id: '7',
    name: 'Runway',
    description: 'AI视频编辑和生成平台，支持视频抠图、风格迁移等功能',
    category: '视频剪辑',
    rating: 4.6,
    reviews: 3200,
    tags: ['付费', '视频', '创意'],
  },
  {
    id: '8',
    name: 'Jasper',
    description: 'AI写作助手，专注于营销文案和内容创作',
    category: 'AI写作',
    rating: 4.3,
    reviews: 2800,
    tags: ['付费', '营销', '文案'],
  },
];

export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTools = activeCategory === '全部'
    ? mockTools
    : mockTools.filter((tool) => tool.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">AI工具库</h1>
          <p className="mt-2 text-gray-600">发现2000+精选AI工具，提升你的工作效率</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">筛选</h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">分类</h4>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === category
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">价格</h4>
                <div className="space-y-2">
                  {['全部', '免费', '付费', '开源'].map((price) => (
                    <label key={price} className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300" />
                      {price}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                共 <span className="font-medium text-gray-900">{filteredTools.length}</span> 个工具
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tools Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  description={tool.description}
                  category={tool.category}
                  rating={tool.rating}
                  reviewCount={tool.reviews}
                  tags={tool.tags}
                  isFeatured={tool.isFeatured}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium">
                加载更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
