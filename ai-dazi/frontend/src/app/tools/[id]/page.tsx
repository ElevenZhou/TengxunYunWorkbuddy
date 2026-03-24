'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  ExternalLink, 
  Heart, 
  Share2, 
  MessageSquare,
  ChevronLeft,
  Check,
  X
} from 'lucide-react';
import { useState } from 'react';

const mockTool = {
  id: '1',
  name: 'ChatGPT',
  description: 'OpenAI开发的AI对话助手，支持多种语言，可进行自然对话、写作辅助、代码生成等多种任务。基于GPT-4架构，具有强大的理解和生成能力。',
  longDescription: `ChatGPT是由OpenAI开发的大型语言模型对话系统。它能够：

• 进行自然流畅的多轮对话
• 协助写作、编辑和润色文本
• 生成和解释代码
• 回答各类知识性问题
• 帮助分析和解决问题
• 进行创意写作和头脑风暴`,
  logoUrl: '',
  category: 'AI对话',
  rating: 4.8,
  reviewCount: 12500,
  websiteUrl: 'https://chat.openai.com',
  pricing: {
    hasFree: true,
    hasPaid: true,
    freePlan: 'GPT-3.5，有限使用额度',
    paidPlan: 'GPT-4，$20/月',
  },
  features: [
    '自然语言对话',
    '多语言支持',
    '代码生成与解释',
    '文本写作辅助',
    '知识问答',
    '创意头脑风暴',
  ],
  tags: ['免费', '付费', '对话', '写作', '代码'],
  screenshots: [],
};

const mockReviews = [
  {
    id: '1',
    user: { name: '张三', avatar: '' },
    rating: 5,
    content: '非常好用的AI助手，帮我解决了很多写作和编程问题。GPT-4的理解能力真的很强！',
    date: '2024-03-15',
    helpful: 128,
  },
  {
    id: '2',
    user: { name: '李四', avatar: '' },
    rating: 4,
    content: '功能很强大，但是免费版有时候会有使用限制。付费版体验更好。',
    date: '2024-03-10',
    helpful: 86,
  },
  {
    id: '3',
    user: { name: '王五', avatar: '' },
    rating: 5,
    content: '工作中必不可少的工具，大大提高了我的工作效率。强烈推荐！',
    date: '2024-03-05',
    helpful: 64,
  },
];

export default function ToolDetailPage() {
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/tools" 
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            返回工具库
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo & Basic Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                  {mockTool.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{mockTool.name}</h1>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {mockTool.category}
                    </span>
                  </div>
                  <p className="text-gray-600">{mockTool.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{mockTool.rating}</span>
                      <span className="text-gray-500">({mockTool.reviewCount} 评价)</span>
                    </div>
                    <div className="flex gap-2">
                      {mockTool.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 md:w-64">
              <a
                href={mockTool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
              >
                访问官网
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border transition ${
                    isFavorite
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? '已收藏' : '收藏'}
                </button>
                <button className="flex items-center justify-center px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 transition">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  概览
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  评价 ({mockTool.reviewCount})
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'overview' ? (
                  <div className="space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">详细介绍</h3>
                      <div className="prose prose-gray max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-600">
                          {mockTool.longDescription}
                        </pre>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">主要功能</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mockTool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium">
                              {review.user.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.user.name}</p>
                              <p className="text-xs text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.content}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                            <MessageSquare className="h-4 w-4" />
                            有用 ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">定价方案</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">免费版</p>
                    <p className="text-sm text-gray-500">{mockTool.pricing.freePlan}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Star className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">付费版</p>
                    <p className="text-sm text-gray-500">{mockTool.pricing.paidPlan}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Tools */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">相似工具</h3>
              <div className="space-y-3">
                {['Claude', '文心一言', '通义千问'].map((tool) => (
                  <Link
                    key={tool}
                    href={`/tools/${tool.toLowerCase()}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {tool[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tool}</p>
                      <p className="text-xs text-gray-500">AI对话</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
