'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  BookOpen,
  Heart,
  Wrench,
  Settings,
  Edit2,
  Star,
  Clock,
  Eye,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// mock数据
const mockStats = {
  favoritedTools: 12,
  favoritedWorkflows: 8,
  createdWorkflows: 3,
  totalViews: 4280,
};

const mockFavoritedTools = [
  { id: '1', name: 'ChatGPT', category: 'AI对话', rating: 4.8 },
  { id: '2', name: 'Midjourney', category: 'AI绘图', rating: 4.9 },
  { id: '3', name: 'Cursor', category: 'AI编程', rating: 4.7 },
];

const mockFavoritedWorkflows = [
  { id: '1', title: 'AI辅助写作完整流程', category: '内容创作', stepCount: 8 },
  { id: '4', title: '短视频AI制作流程', category: '内容创作', stepCount: 10 },
];

const mockMyWorkflows = [
  { id: 'w1', title: '我的电商运营工作流', category: '营销推广', stepCount: 6, viewCount: 342, status: 'published' },
  { id: 'w2', title: '个人学习管理系统', category: '办公效率', stepCount: 9, viewCount: 189, status: 'draft' },
];

type TabKey = 'overview' | 'tools' | 'workflows' | 'created';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: '概览', icon: <User className="h-4 w-4" /> },
  { key: 'tools', label: '收藏工具', icon: <Heart className="h-4 w-4" /> },
  { key: 'workflows', label: '收藏工作流', icon: <BookOpen className="h-4 w-4" /> },
  { key: 'created', label: '我的工作流', icon: <Wrench className="h-4 w-4" /> },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // 未登录，跳转到登录页
        router.replace('/auth/login');
        return;
      }
    } catch {
      router.replace('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">加载中...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name[0]}
              </div>
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition">
                <Edit2 className="h-3.5 w-3.5 text-gray-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  普通用户
                </span>
              </div>
              <p className="text-gray-500 text-sm">{user.email}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.favoritedTools}</p>
                  <p className="text-xs text-gray-500">收藏工具</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.favoritedWorkflows}</p>
                  <p className="text-xs text-gray-500">收藏工作流</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.createdWorkflows}</p>
                  <p className="text-xs text-gray-500">创建工作流</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">获得浏览</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/profile/settings"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Settings className="h-4 w-4" />
                设置
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats Cards */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">活跃统计</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="h-4 w-4 text-red-400" />
                    收藏工具
                  </div>
                  <span className="font-semibold text-gray-900">{mockStats.favoritedTools}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-blue-400" />
                    收藏工作流
                  </div>
                  <span className="font-semibold text-gray-900">{mockStats.favoritedWorkflows}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wrench className="h-4 w-4 text-purple-400" />
                    发布工作流
                  </div>
                  <span className="font-semibold text-gray-900">{mockStats.createdWorkflows}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4 text-green-400" />
                    获得浏览
                  </div>
                  <span className="font-semibold text-gray-900">{mockStats.totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Favorites */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">最近收藏</h3>
                <button
                  onClick={() => setActiveTab('tools')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                >
                  查看全部
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {mockFavoritedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {tool.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{tool.name}</p>
                      <p className="text-xs text-gray-400">{tool.category}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {tool.rating}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* My Workflows Overview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">我的工作流</h3>
                <Link
                  href="/workflows/create"
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition"
                >
                  + 创建新工作流
                </Link>
              </div>
              {mockMyWorkflows.length > 0 ? (
                <div className="space-y-3">
                  {mockMyWorkflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{workflow.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400">{workflow.category}</span>
                          <span className="text-xs text-gray-400">{workflow.stepCount}步</span>
                          <span className="flex items-center gap-0.5 text-xs text-gray-400">
                            <Eye className="h-3 w-3" />
                            {workflow.viewCount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          workflow.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {workflow.status === 'published' ? '已发布' : '草稿'}
                        </span>
                        <Link href={`/workflows/${workflow.id}`} className="text-xs text-blue-600 hover:text-blue-700">
                          查看
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">还没有创建工作流</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Favorited Tools Tab */}
        {activeTab === 'tools' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">收藏的工具</h2>
              <p className="text-sm text-gray-500">共 {mockStats.favoritedTools} 个</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFavoritedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {tool.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</p>
                      <p className="text-xs text-gray-500">{tool.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{tool.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Favorited Workflows Tab */}
        {activeTab === 'workflows' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">收藏的工作流</h2>
              <p className="text-sm text-gray-500">共 {mockStats.favoritedWorkflows} 个</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockFavoritedWorkflows.map((workflow) => (
                <Link
                  key={workflow.id}
                  href={`/workflows/${workflow.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shrink-0">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{workflow.title}</p>
                      <p className="text-xs text-gray-500">{workflow.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{workflow.stepCount} 个步骤</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* My Created Workflows Tab */}
        {activeTab === 'created' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">我创建的工作流</h2>
              <Link
                href="/workflows/create"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                + 创建工作流
              </Link>
            </div>
            <div className="space-y-4">
              {mockMyWorkflows.map((workflow) => (
                <div key={workflow.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white shrink-0">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{workflow.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{workflow.category}</span>
                          <span className="text-xs text-gray-500">{workflow.stepCount}步</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        {workflow.viewCount}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        workflow.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {workflow.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                    <Link href={`/workflows/${workflow.id}`} className="text-sm text-blue-600 hover:text-blue-700">
                      查看详情
                    </Link>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      编辑
                    </button>
                    <button className="text-sm text-red-500 hover:text-red-600 ml-auto">
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
