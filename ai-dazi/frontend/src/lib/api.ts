// API客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 获取本地存储的JWT token（仅在浏览器环境执行）
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// 通用请求函数（自动携带Authorization头）
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // token过期时清除本地存储
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new Error('登录已过期，请重新登录');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `请求失败: ${response.status}`);
  }

  // 204 No Content 不解析 body
  if (response.status === 204) return undefined as T;

  return response.json();
}

// 工具相关API
export const toolsApi = {
  // 获取工具列表
  getTools: (params?: { 
    category?: string; 
    search?: string; 
    skip?: number; 
    take?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.skip !== undefined) queryParams.append('skip', String(params.skip));
    if (params?.take !== undefined) queryParams.append('take', String(params.take));
    
    return request<{
      tools: Tool[];
      total: number;
      skip: number;
      take: number;
    }>(`/tools?${queryParams.toString()}`);
  },

  // 获取热门工具
  getHotTools: () => request<Tool[]>('/tools/hot'),

  // 获取单个工具
  getTool: (id: string) => request<Tool & { 
    reviews: Review[]; 
    _count: { reviews: number; favorites: number };
  }>(`/tools/${id}`),

  // 创建工具
  createTool: (data: CreateToolData) => request<Tool>('/tools', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 更新工具
  updateTool: (id: string, data: Partial<CreateToolData>) => request<Tool>(`/tools/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // 删除工具
  deleteTool: (id: string) => request<void>(`/tools/${id}`, {
    method: 'DELETE',
  }),
};

// 工作流相关API
export const workflowsApi = {
  // 获取工作流列表
  getWorkflows: (params?: {
    category?: string;
    skip?: number;
    take?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.skip !== undefined) queryParams.append('skip', String(params.skip));
    if (params?.take !== undefined) queryParams.append('take', String(params.take));
    
    return request<{
      workflows: Workflow[];
      total: number;
      skip: number;
      take: number;
    }>(`/workflows?${queryParams.toString()}`);
  },

  // 获取单个工作流
  getWorkflow: (id: string) => request<Workflow & {
    steps: WorkflowStep[];
    _count: { favorites: number };
  }>(`/workflows/${id}`),

  // 创建工作流
  createWorkflow: (data: CreateWorkflowData) => request<Workflow>('/workflows', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 更新工作流
  updateWorkflow: (id: string, data: Partial<CreateWorkflowData>) => request<Workflow>(`/workflows/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // 删除工作流
  deleteWorkflow: (id: string) => request<void>(`/workflows/${id}`, {
    method: 'DELETE',
  }),

  // 复制工作流
  copyWorkflow: (id: string) => request<Workflow>(`/workflows/${id}/copy`, {
    method: 'POST',
  }),
};

// 分类相关API
export const categoriesApi = {
  // 获取所有分类
  getCategories: () => request<Category[]>('/categories'),
  
  // 获取单个分类
  getCategory: (slug: string) => request<Category>(`/categories/${slug}`),
};

// 评价相关API
export const reviewsApi = {
  // 创建评价
  createReview: (data: CreateReviewData) => request<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 获取工具的评价
  getToolReviews: (toolId: string, params?: { skip?: number; take?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.skip !== undefined) queryParams.append('skip', String(params.skip));
    if (params?.take !== undefined) queryParams.append('take', String(params.take));
    
    return request<{ reviews: Review[]; total: number }>(`/reviews/tool/${toolId}?${queryParams.toString()}`);
  },
};

// 收藏相关API
export const favoritesApi = {
  // 添加收藏
  addFavorite: (type: 'tool' | 'workflow', id: string) => request<Favorite>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ type, id }),
  }),

  // 取消收藏
  removeFavorite: (id: string) => request<void>(`/favorites/${id}`, {
    method: 'DELETE',
  }),

  // 获取用户收藏
  getMyFavorites: () => request<{ tools: Tool[]; workflows: Workflow[] }>('/favorites/my'),
};

// 类型定义
export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  logoUrl?: string;
  websiteUrl: string;
  categoryId: string;
  category: Category;
  tags: Tag[];
  rating: number;
  viewCount: number;
  status: 'pending' | 'approved' | 'rejected';
  pricingType: 'free' | 'paid' | 'freemium';
  createdAt: string;
  updatedAt: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  categoryId: string;
  category: Category;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: Tag[];
  useCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  order: number;
  title: string;
  description?: string;
  toolId?: string;
  tool?: Tool;
  promptTemplate?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  toolId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  content: string;
  helpful: number;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  toolId?: string;
  workflowId?: string;
  createdAt: string;
}

export interface CreateToolData {
  name: string;
  description: string;
  websiteUrl: string;
  categoryId: string;
  tagIds?: string[];
  pricingType: 'free' | 'paid' | 'freemium';
}

export interface CreateWorkflowData {
  title: string;
  description: string;
  categoryId: string;
  tagIds?: string[];
  steps?: {
    order: number;
    title: string;
    description?: string;
    toolId?: string;
    promptTemplate?: string;
  }[];
}

export interface CreateReviewData {
  toolId: string;
  rating: number;
  content: string;
}

// 用户相关API
export const usersApi = {
  // 获取当前用户信息
  getMe: () => request<UserProfile>('/users/me'),

  // 更新用户信息
  updateMe: (data: Partial<{ name: string; avatar: string; bio: string }>) =>
    request<UserProfile>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  _count?: {
    workflows: number;
    favorites: number;
  };
}
