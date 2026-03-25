# 部署说明 - AI搭子项目

## 服务器信息
- **服务器IP**: 159.75.54.16
- **操作系统**: Windows Server 2022
- **部署时间**: 2026-03

## 架构概览

```
互联网
  |
  ↓ 80端口
nginx (C:\deploy\nginx\)
  |-- /           → Next.js 前端 (:3100)
  |-- /api/       → Nest.js 后端 (:3001)
  |-- /monitor/   → 系统监控 (:3000)
  |-- /games/     → AI游戏 (:8080)

数据层:
  PostgreSQL (:5432) - 数据库
  Redis (:6379)      - 缓存
```

## 访问地址

| 服务 | 地址 |
|------|------|
| AI搭子主页 | http://159.75.54.16/ |
| API文档 | http://159.75.54.16/api/docs |
| 系统监控 | http://159.75.54.16/monitor/ |
| AI游戏 | http://159.75.54.16/games/ |

## Windows 服务列表

| 服务名 | 说明 | 端口 |
|--------|------|------|
| PostgreSQL | 数据库 | 5432 |
| Redis | 缓存服务 | 6379 |
| nginx | 反向代理 | 80 |
| AiDaziBackend | Nest.js API服务 | 3001 |
| AiDaziFrontend | Next.js 前端 | 3100 |
| SystemMonitor | 系统监控 | 3000 |
| AiGames | AI游戏服务 | 8080 |

## 部署文件结构

```
C:\deploy\
├── nginx\          - nginx反向代理
│   ├── conf\nginx.conf
│   └── logs\
├── pgsql\          - PostgreSQL 15
├── redis\          - Redis 5
├── nssm\           - NSSM服务管理器
├── scripts\        - 部署脚本
│   ├── install-all-services.bat
│   ├── start-all.bat
│   └── uninstall-all-services.bat
└── logs\           - 服务日志
    ├── frontend.log
    ├── backend.log
    └── monitor.log
```

## 服务管理命令

```powershell
# 查看所有服务状态
Get-Service PostgreSQL,Redis,nginx,AiDaziFrontend,AiDaziBackend,SystemMonitor,AiGames

# 重启某个服务
Restart-Service AiDaziBackend

# 查看服务日志
Get-Content C:\deploy\logs\backend.log -Tail 50

# 重启所有服务
& "C:\deploy\scripts\start-all.bat"
```

## 环境变量

**后端** (`C:\Users\Administrator\WorkBuddy\Claw\ai-dazi\backend\.env`):
```
DATABASE_URL=postgresql://aidazi:aidazi123@localhost:5432/ai_dazi
REDIS_URL=redis://localhost:6379
PORT=3001
FRONTEND_URL=http://159.75.54.16
```

## 技术栈

- **前端**: Next.js 16 + TypeScript + Tailwind CSS
- **后端**: Nest.js + Prisma + JWT
- **数据库**: PostgreSQL 15 + Redis 5
- **服务器**: nginx 1.25 + NSSM 2.24
- **Node.js**: 20.18.0
