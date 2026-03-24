'use client';

import { useState } from 'react';
import ToolCard from './ToolCard';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
}

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'OpenAI开发的AI对话助手，支持多种语言，可进行自然对话、写作辅助、代码生成等',
    category: 'AI对话',
    rating: 4.8,
    reviews: 12500,
    tags: ['免费', '对话', '写作'],
    isHot: true,
  },
  {
    id: '2',
    name: 'Midjourney',
    description: '强大的AI图像生成工具，通过文字描述生成高质量艺术图像',
    category: '图像生成',
    rating: 4.7,
    reviews: 8900,
    tags: ['付费', '图像', '艺术'],
    isHot: true,
  },
  {
    id: '3',
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长长文本处理和复杂推理任务',
    category: 'AI对话',
    rating: 4.6,
    reviews: 5600,
    tags: ['免费', '对话', '长文本'],
    isNew: true,
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
    isHot: true,
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
];

export default function ToolGrid() {
  const [sortBy, setSortBy] = useState('综合排序');

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">热门AI工具</h2>
          <div className="flex gap-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>综合排序</option>
              <option>热度最高</option>
              <option>最新发布</option>
              <option>评分最高</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description}
              category={tool.category}
              rating={tool.rating}
              reviewCount={tool.reviews}
              tags={tool.tags}
              isFeatured={tool.isHot}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium">
            加载更多工具
          </button>
        </div>
      </div>
    </section>
  );
}
