'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import {
  ChevronLeft,
  Clock,
  Users,
  Heart,
  Share2,
  Play,
  CheckCircle2,
  Wrench,
  BookOpen,
  Copy,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

// mock数据 — 后续接真实API时替换
const mockWorkflowDetail = {
  id: '1',
  title: 'AI辅助写作完整流程',
  description: '从选题、大纲、写作到润色的完整AI写作工作流，适合自媒体人和内容创作者使用。通过合理编排多个AI工具，让内容创作效率提升10倍以上。',
  category: '内容创作',
  coverImage: '',
  author: {
    id: 'u1',
    name: '小明',
    avatar: '',
    bio: '专注AI内容创作，分享高效工作流',
    workflowCount: 12,
    followerCount: 3400,
  },
  duration: '15分钟',
  stepCount: 8,
  viewCount: 12500,
  useCount: 4200,
  rating: 4.7,
  reviewCount: 328,
  tools: ['ChatGPT', 'Notion AI', 'Grammarly'],
  tags: ['写作', '内容创作', '效率', 'AI'],
  createdAt: '2024-02-20',
  steps: [
    {
      id: 's1',
      order: 1,
      title: '选题与方向确定',
      description: '使用ChatGPT头脑风暴选题，结合热点趋势和目标受众分析，确定文章方向和角度。',
      tool: 'ChatGPT',
      toolColor: 'from-green-400 to-teal-500',
      promptTemplate: '我想写一篇关于[主题]的文章，目标读者是[受众]，请帮我列出10个有吸引力的选题角度，每个角度附上一句话的卖点说明。',
      duration: '2分钟',
      tips: '尽量描述清楚目标读者画像，选题质量会大幅提升',
    },
    {
      id: 's2',
      order: 2,
      title: '竞品内容分析',
      description: '搜索同类文章，了解已有内容的覆盖范围，找到差异化切入点，避免重复。',
      tool: 'ChatGPT',
      toolColor: 'from-green-400 to-teal-500',
      promptTemplate: '请分析以下关于[主题]的文章摘要，指出内容缺口和可以做得更好的地方：\n[粘贴竞品摘要]',
      duration: '3分钟',
      tips: '找到别人没写到的点，是高质量内容的关键',
    },
    {
      id: 's3',
      order: 3,
      title: '结构大纲生成',
      description: '基于选题确定文章结构，使用AI生成层次清晰的大纲框架。',
      tool: 'Notion AI',
      toolColor: 'from-gray-700 to-gray-900',
      promptTemplate: '请为标题为《[标题]》的文章生成一个详细大纲，包含引言、3-5个主要章节、每章的2-3个子要点，以及结论部分。',
      duration: '2分钟',
      tips: '大纲是整篇文章的骨架，多花一点时间在这里值得',
    },
    {
      id: 's4',
      order: 4,
      title: '分章节内容撰写',
      description: '根据大纲逐章节展开写作，利用AI补充细节、案例和数据支撑。',
      tool: 'ChatGPT',
      toolColor: 'from-green-400 to-teal-500',
      promptTemplate: '请根据以下大纲要点，展开写作第[X]章节，要求：语气[风格]，字数约[字数]字，包含具体案例。\n大纲要点：[要点内容]',
      duration: '3分钟',
      tips: '每次只让AI写一个章节，质量比一次性写完要高很多',
    },
    {
      id: 's5',
      order: 5,
      title: '案例与数据补充',
      description: '为文章核心观点找到真实案例支撑，增加可信度和说服力。',
      tool: 'ChatGPT',
      toolColor: 'from-green-400 to-teal-500',
      promptTemplate: '请为"[核心观点]"提供3个真实的企业或个人案例，要求案例来自不同行业，并说明每个案例如何支持这个观点。',
      duration: '2分钟',
      tips: '注意验证AI提供的数据和案例的真实性',
    },
    {
      id: 's6',
      order: 6,
      title: '内容润色与优化',
      description: '对初稿进行语言优化，提升可读性和吸引力，调整句式和节奏感。',
      tool: 'Grammarly',
      toolColor: 'from-green-500 to-green-700',
      promptTemplate: '请对以下文段进行润色，要求：1)保留原意；2)语言更生动有力；3)适当使用短句增加节奏感；4)添加过渡语句使逻辑更流畅。\n[原文段]',
      duration: '1分钟',
      tips: 'Grammarly的Style建议非常实用，能快速提升文章质感',
    },
    {
      id: 's7',
      order: 7,
      title: '标题与摘要优化',
      description: '生成多个标题备选方案，优化SEO摘要和社交媒体分享文案。',
      tool: 'ChatGPT',
      toolColor: 'from-green-400 to-teal-500',
      promptTemplate: '请为这篇关于[主题]的文章生成5个标题，要求：有数字、有悬念或有利益点，适合[平台]平台发布。同时写一段150字以内的文章摘要。',
      duration: '1分钟',
      tips: '好标题能带来3-5倍的点击率提升，多测试几个',
    },
    {
      id: 's8',
      order: 8,
      title: '最终校对与发布',
      description: '全文通读校对，检查事实准确性，格式排版优化，选择最佳发布时机。',
      tool: 'Notion AI',
      toolColor: 'from-gray-700 to-gray-900',
      promptTemplate: '请对以下文章做最终校对，重点检查：1)事实和数据是否准确；2)逻辑是否连贯；3)有无语病或错别字；4)文章结构是否完整。\n[完整文章]',
      duration: '1分钟',
      tips: '发布前睡一觉再看，往往能发现之前忽视的问题',
    },
  ],
  reviews: [
    {
      id: 'r1',
      user: { name: '内容创作者小王', avatar: '' },
      rating: 5,
      content: '这个工作流太实用了！按照这个流程写了三篇文章，每篇都超过平时的质量，而且速度快了很多。特别是"分章节写作"这个技巧，改变了我以往让AI一次性写完导致质量差的问题。',
      date: '2024-03-18',
      helpful: 89,
    },
    {
      id: 'r2',
      user: { name: '自媒体运营张姐', avatar: '' },
      rating: 5,
      content: '公众号运营必备！我现在每篇文章都用这个流程，产出稳定，质量有保障。建议步骤5的案例验证要认真做，AI有时会编造数据。',
      date: '2024-03-12',
      helpful: 67,
    },
    {
      id: 'r3',
      user: { name: '学术写作小李', avatar: '' },
      rating: 4,
      content: '整体流程很清晰，我稍微做了调整用于论文写作也很好用。唯一建议是可以增加参考文献整理的步骤。',
      date: '2024-03-08',
      helpful: 42,
    },
  ],
  relatedWorkflows: [
    { id: '2', title: 'Midjourney商业设计工作流', category: '产品设计', stepCount: 12 },
    { id: '6', title: 'AI辅助学术研究', category: '办公效率', stepCount: 20 },
    { id: '4', title: '短视频AI制作流程', category: '内容创作', stepCount: 10 },
  ],
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>('s1');
  const [activeTab, setActiveTab] = useState<'steps' | 'reviews'>('steps');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const workflow = mockWorkflowDetail;

  const handleCopyPrompt = (stepId: string, prompt: string) => {
    navigator.clipboard.writeText(prompt).catch(() => {
      // 降级处理：不支持clipboard API时静默失败
    });
    setCopiedPrompt(stepId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/workflows"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            返回工作流列表
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Info */}
            <div className="flex-1">
              {/* Category Badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-3">
                {workflow.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">{workflow.title}</h1>
              <p className="text-gray-600 mb-5 leading-relaxed">{workflow.description}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{workflow.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span>{workflow.stepCount} 个步骤</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>{(workflow.useCount / 1000).toFixed(1)}k 次使用</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700">{workflow.rating}</span>
                  <span>({workflow.reviewCount} 评价)</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {workflow.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col gap-3 lg:w-64">
              <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium">
                <Play className="h-4 w-4" />
                开始使用此工作流
              </button>
              <button className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-700 font-medium">
                <Copy className="h-4 w-4" />
                复制工作流
              </button>
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
          {/* Left: Steps & Reviews */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-6 pt-4">
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-4 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === 'steps'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  步骤详解
                </span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`ml-6 px-4 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  使用评价 ({workflow.reviewCount})
                </span>
              </button>
            </div>

            {activeTab === 'steps' ? (
              <div className="space-y-3">
                {workflow.steps.map((step) => (
                  <div
                    key={step.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors"
                  >
                    {/* Step Header */}
                    <button
                      className="w-full flex items-center gap-4 p-5 text-left"
                      onClick={() => toggleStep(step.id)}
                    >
                      {/* Step Number */}
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${step.toolColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {step.order}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{step.title}</h3>
                          <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            <Wrench className="h-3 w-3" />
                            {step.tool}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{step.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400 hidden sm:block">{step.duration}</span>
                        {expandedStep === step.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Step Detail */}
                    {expandedStep === step.id && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="pt-4 space-y-4">
                          {/* Description */}
                          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

                          {/* Prompt Template */}
                          {step.promptTemplate && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">提示词模板</span>
                                <button
                                  onClick={() => handleCopyPrompt(step.id, step.promptTemplate)}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                                >
                                  {copiedPrompt === step.id ? (
                                    <>
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      已复制
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" />
                                      复制
                                    </>
                                  )}
                                </button>
                              </div>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {step.promptTemplate}
                              </div>
                            </div>
                          )}

                          {/* Tips */}
                          {step.tips && (
                            <div className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                              <span className="text-amber-500 text-base shrink-0">💡</span>
                              <p className="text-xs text-amber-700">{step.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {workflow.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium">
                          {review.user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{review.user.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" />
                        有用 ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-72 space-y-5">
            {/* Author Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">作者信息</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {workflow.author.name[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{workflow.author.name}</p>
                  <p className="text-xs text-gray-500">{workflow.author.bio}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{workflow.author.workflowCount}</p>
                  <p className="text-xs">工作流</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{(workflow.author.followerCount / 1000).toFixed(1)}k</p>
                  <p className="text-xs">关注者</p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-full border border-blue-200 text-blue-600 text-sm hover:bg-blue-50 transition font-medium">
                关注作者
              </button>
            </div>

            {/* Tools Used */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">涉及工具</h3>
              <div className="space-y-2">
                {workflow.tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {tool[0]}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{tool}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Workflows */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">相关工作流</h3>
              <div className="space-y-3">
                {workflow.relatedWorkflows.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/workflows/${rel.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shrink-0">
                      <Play className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                        {rel.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{rel.category} · {rel.stepCount}步</p>
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
