'use client';

import { useState } from 'react';
import WorkflowCard from '@/components/WorkflowCard';
import { Plus, Filter } from 'lucide-react';

const categories = [
  '全部',
  '内容创作',
  '数据分析',
  '产品设计',
  '营销推广',
  '开发编程',
  '办公效率',
];

const mockWorkflows = [
  {
    id: '1',
    title: 'AI辅助写作完整流程',
    description: '从选题、大纲、写作到润色的完整AI写作工作流，适合自媒体人和内容创作者',
    category: '内容创作',
    author: { name: '小明' },
    duration: '15分钟',
    stepCount: 8,
    viewCount: 12500,
    tools: ['ChatGPT', 'Notion AI', 'Grammarly'],
  },
  {
    id: '2',
    title: 'Midjourney商业设计工作流',
    description: '从需求分析、提示词编写到后期处理的专业AI设计流程',
    category: '产品设计',
    author: { name: '设计师阿杰' },
    duration: '30分钟',
    stepCount: 12,
    viewCount: 8900,
    tools: ['Midjourney', 'Photoshop', 'Figma'],
  },
  {
    id: '3',
    title: 'AI数据分析自动化',
    description: '使用AI工具进行数据清洗、分析和可视化的完整流程',
    category: '数据分析',
    author: { name: '数据达人' },
    duration: '45分钟',
    stepCount: 15,
    viewCount: 5600,
    tools: ['ChatGPT', 'Python', 'Tableau'],
  },
  {
    id: '4',
    title: '短视频AI制作流程',
    description: '从脚本生成、素材制作到后期剪辑的AI视频工作流',
    category: '内容创作',
    author: { name: '视频创作者' },
    duration: '20分钟',
    stepCount: 10,
    viewCount: 15200,
    tools: ['Runway', 'CapCut', 'ChatGPT'],
  },
  {
    id: '5',
    title: 'AI编程助手最佳实践',
    description: '如何高效使用GitHub Copilot等AI编程工具提升开发效率',
    category: '开发编程',
    author: { name: '全栈工程师' },
    duration: '25分钟',
    stepCount: 6,
    viewCount: 9800,
    tools: ['GitHub Copilot', 'Cursor', 'ChatGPT'],
  },
  {
    id: '6',
    title: 'AI辅助学术研究',
    description: '文献综述、论文写作、参考文献管理的AI辅助流程',
    category: '办公效率',
    author: { name: '博士生小李' },
    duration: '60分钟',
    stepCount: 20,
    viewCount: 7200,
    tools: ['Claude', 'Zotero', 'Elicit'],
  },
];

export default function WorkflowsPage() {
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredWorkflows = activeCategory === '全部'
    ? mockWorkflows
    : mockWorkflows.filter((w) => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">工作流</h1>
              <p className="mt-2 text-gray-600">学习100+精选AI工作流，掌握AI应用的最佳实践</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium">
              <Plus className="h-5 w-5" />
              创建工作流
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-gray-400 shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            共 <span className="font-medium text-gray-900">{filteredWorkflows.length}</span> 个工作流
          </p>
          <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm">
            <option>最新发布</option>
            <option>最多浏览</option>
            <option>最多收藏</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              id={workflow.id}
              title={workflow.title}
              description={workflow.description}
              author={workflow.author}
              duration={workflow.duration}
              stepCount={workflow.stepCount}
              viewCount={workflow.viewCount}
              tools={workflow.tools}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium">
            加载更多
          </button>
        </div>
      </div>
    </div>
  );
}
