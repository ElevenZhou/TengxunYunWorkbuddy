# AI搭子 (AI Workflow Companion)

> 不止是导航，更是你的AI工作流设计师

## 项目介绍

AI搭子是一个AI工具导航网站，同时也是一个AI工作流分享平台。用户可以发现2000+ AI工具，探索100+工作流，让AI成为工作的最佳搭档。

## 核心功能

- 🔍 **AI工具导航** - 发现和搜索2000+ AI工具
- 🔄 **工作流市场** - 发现和使用100+ AI工作流
- 🤖 **智能匹配** - 根据需求智能推荐工具组合
- 📊 **热度榜单** - 实时追踪AI工具热度趋势
- ⭐ **用户评价** - 真实用户评价和评分
- ⚖️ **工具对比** - 多工具横向对比

## 技术栈

### 前端
- **Next.js 15** - React框架 (App Router)
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式解决方案
- **Zustand** - 状态管理
- **React Query** - 数据同步

### 后端
- **Nest.js** - Node.js企业级框架
- **Prisma** - ORM
- **PostgreSQL** - 主数据库
- **Redis** - 缓存
- **JWT** - 认证

### 部署
- **Vercel** - 前端托管
- **Railway** - 后端托管

## 快速开始

### 前置要求
- Node.js 18+
- Docker Desktop
- PostgreSQL 15+
- Redis 7+

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/ai-dazi/ai-dazi.git
cd ai-dazi
```

2. **启动数据库**
```bash
cd database
docker-compose up -d
```

3. **启动后端**
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

4. **启动前端**
```bash
cd frontend
npm install
npm run dev
```

5. **访问**
- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- API文档: http://localhost:3001/api/docs

## 项目结构

```
ai-dazi/
├── frontend/                 # Next.js前端
│   ├── src/
│   │   ├── app/            # App Router页面
│   │   ├── components/     # React组件
│   │   ├── lib/           # 工具函数
│   │   ├── store/         # Zustand状态
│   │   ├── hooks/         # 自定义Hook
│   │   └── types/         # TypeScript类型
│   ├── public/             # 静态资源
│   └── package.json
│
├── backend/                 # Nest.js后端
│   ├── src/
│   │   ├── modules/       # 业务模块
│   │   │   ├── auth/     # 认证模块
│   │   │   ├── users/    # 用户模块
│   │   │   ├── tools/    # 工具模块
│   │   │   └── workflows/# 工作流模块
│   │   ├── common/        # 公共组件
│   │   ├── config/        # 配置
│   │   └── database/     # 数据库
│   ├── prisma/            # 数据库Schema
│   └── package.json
│
├── database/               # 数据库配置
│   └── docker-compose.yml
│
└── docs/                  # 项目文档
```

## API文档

后端API文档使用Swagger构建，访问 http://localhost:3001/api/docs

### 主要API端点

| 模块 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 认证 | POST | /api/auth/register | 用户注册 |
| 认证 | POST | /api/auth/login | 用户登录 |
| 工具 | GET | /api/tools | 获取工具列表 |
| 工具 | GET | /api/tools/hot | 获取热门工具 |
| 工具 | GET | /api/tools/:id | 获取工具详情 |
| 工作流 | GET | /api/workflows | 获取工作流列表 |
| 工作流 | POST | /api/workflows/:id/copy | 复制工作流 |

## 开发规范

### 代码风格
- 使用ESLint + Prettier
- 遵循Conventional Commits提交规范

### 分支管理
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- bugfix/*: 修复分支

### 提交规范
```
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## MVP目标

| 指标 | 目标 |
|------|------|
| 工具数量 | 2000+ |
| 工作流数量 | 100+ |
| 月活用户 | 10,000 |
| 首屏加载 | < 2s |
| 搜索响应 | < 500ms |

## 团队

- 全栈工程师 x1
- 前端工程师 x1
- 产品+运营 x1

## 许可证

MIT License

## 联系方式

- 官网: https://aidazi.com
- 邮箱: hello@aidazi.com
