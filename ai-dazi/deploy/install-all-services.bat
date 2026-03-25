@echo off
chcp 65001 > nul
echo ====================================
echo 安装所有 AI 搭子服务
echo ====================================

set NSSM=C:\deploy\nssm\nssm.exe
set NODE=C:\Users\Administrator\.workbuddy\binaries\node\versions\20.18.0\node.exe
set FRONTEND_DIR=C:\Users\Administrator\WorkBuddy\Claw\ai-dazi\frontend
set BACKEND_DIR=C:\Users\Administrator\WorkBuddy\Claw\ai-dazi\backend
set MONITOR_DIR=C:\Users\Administrator\WorkBuddy\Claw\system-monitor
set GAMES_DIR=C:\Users\Administrator\WorkBuddy\Claw\ai-games

echo [1/7] 注册 PostgreSQL 服务...
C:\deploy\pgsql\bin\pg_ctl.exe register -N "PostgreSQL" -D "C:\pgdata" -S auto -U LocalSystem
echo PostgreSQL 服务注册完成

echo [2/7] 安装 Redis 服务...
%NSSM% install Redis C:\deploy\redis\redis-server.exe
%NSSM% set Redis AppParameters C:\deploy\redis\redis.windows-service.conf
%NSSM% set Redis AppDirectory C:\deploy\redis
%NSSM% set Redis Start SERVICE_AUTO_START
%NSSM% set Redis DisplayName "Redis Cache Server"

echo [3/7] 安装 nginx 服务...
%NSSM% install nginx C:\deploy\nginx\nginx.exe
%NSSM% set nginx AppDirectory C:\deploy\nginx
%NSSM% set nginx Start SERVICE_AUTO_START
%NSSM% set nginx DisplayName "nginx Reverse Proxy"

echo [4/7] 安装 AiDaziBackend 服务...
%NSSM% install AiDaziBackend %NODE%
%NSSM% set AiDaziBackend AppParameters dist/main.js
%NSSM% set AiDaziBackend AppDirectory %BACKEND_DIR%
%NSSM% set AiDaziBackend AppEnvironmentExtra "NODE_ENV=production"
%NSSM% set AiDaziBackend Start SERVICE_AUTO_START
%NSSM% set AiDaziBackend AppStdout C:\deploy\logs\backend.log
%NSSM% set AiDaziBackend AppStderr C:\deploy\logs\backend-error.log
%NSSM% set AiDaziBackend DisplayName "AI Dazi Backend"

echo [5/7] 安装 AiDaziFrontend 服务...
%NSSM% install AiDaziFrontend %NODE%
%NSSM% set AiDaziFrontend AppParameters node_modules\next\dist\bin\next start -p 3100
%NSSM% set AiDaziFrontend AppDirectory %FRONTEND_DIR%
%NSSM% set AiDaziFrontend AppEnvironmentExtra "NODE_ENV=production"
%NSSM% set AiDaziFrontend Start SERVICE_AUTO_START
%NSSM% set AiDaziFrontend AppStdout C:\deploy\logs\frontend.log
%NSSM% set AiDaziFrontend AppStderr C:\deploy\logs\frontend-error.log
%NSSM% set AiDaziFrontend DisplayName "AI Dazi Frontend"

echo [6/7] 安装 SystemMonitor 服务...
%NSSM% install SystemMonitor %NODE%
%NSSM% set SystemMonitor AppParameters server.js
%NSSM% set SystemMonitor AppDirectory %MONITOR_DIR%
%NSSM% set SystemMonitor Start SERVICE_AUTO_START
%NSSM% set SystemMonitor AppStdout C:\deploy\logs\monitor.log
%NSSM% set SystemMonitor AppStderr C:\deploy\logs\monitor-error.log
%NSSM% set SystemMonitor DisplayName "System Monitor"

echo [7/7] 安装 AiGames 服务...
%NSSM% install AiGames C:\Users\Administrator\.workbuddy\binaries\python\versions\3.13.12\python.exe
%NSSM% set AiGames AppParameters server.py
%NSSM% set AiGames AppDirectory %GAMES_DIR%
%NSSM% set AiGames Start SERVICE_AUTO_START
%NSSM% set AiGames DisplayName "AI Games Server"

echo ====================================
echo 所有服务安装完成！
echo 运行 start-all.bat 启动所有服务
echo ====================================
pause
