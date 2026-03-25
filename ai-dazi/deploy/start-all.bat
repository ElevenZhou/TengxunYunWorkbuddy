@echo off
chcp 65001 > nul
echo ====================================
echo 启动所有服务
echo ====================================

echo [1] 启动 PostgreSQL...
net start PostgreSQL
timeout /t 3 /nobreak > nul

echo [2] 启动 Redis...
net start Redis
timeout /t 2 /nobreak > nul

echo [3] 启动 AiDaziBackend...
net start AiDaziBackend
timeout /t 5 /nobreak > nul

echo [4] 启动 AiDaziFrontend...
net start AiDaziFrontend
timeout /t 5 /nobreak > nul

echo [5] 启动 SystemMonitor...
net start SystemMonitor
timeout /t 2 /nobreak > nul

echo [6] 启动 AiGames...
net start AiGames
timeout /t 2 /nobreak > nul

echo [7] 启动 nginx...
net start nginx
timeout /t 2 /nobreak > nul

echo ====================================
echo 服务状态:
echo ====================================
sc query PostgreSQL | findstr "STATE"
sc query Redis | findstr "STATE"
sc query AiDaziBackend | findstr "STATE"
sc query AiDaziFrontend | findstr "STATE"
sc query SystemMonitor | findstr "STATE"
sc query AiGames | findstr "STATE"
sc query nginx | findstr "STATE"
echo ====================================
echo 访问: http://159.75.54.16/
echo ====================================
pause
