@echo off
title AI搭子 - 开发服务器

echo =========================================
echo   AI搭子 开发环境启动脚本
echo =========================================
echo.

:: 检查Node.js
set NODE_PATH=C:\Users\Administrator\.workbuddy\binaries\node\versions\20.18.0
if exist "%NODE_PATH%\node.exe" (
    set PATH=%NODE_PATH%;%PATH%
    echo [OK] 使用 WorkBuddy 管理的 Node.js v20.18.0
) else (
    where node >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] 未找到 Node.js，请先安装 Node.js 18+
        pause
        exit /b 1
    )
    echo [OK] 使用系统 Node.js
)

:: 检查依赖
if not exist "frontend\node_modules" (
    echo [INFO] 安装前端依赖...
    cd frontend
    npm install
    cd ..
)

if not exist "backend\node_modules" (
    echo [INFO] 安装后端依赖...
    cd backend
    npm install
    cd ..
)

echo.
echo [INFO] 启动前端开发服务器 (端口 3100)...
start "AI搭子-前端" cmd /k "set PATH=%NODE_PATH%;%PATH% && cd /d %~dp0frontend && node node_modules\next\dist\bin\next dev --port 3100"

echo [INFO] 等待 3 秒后启动后端...
timeout /t 3 /nobreak >nul

echo [INFO] 启动后端服务器 (端口 3001)...
start "AI搭子-后端" cmd /k "set PATH=%NODE_PATH%;%PATH% && cd /d %~dp0backend && npm run start:dev"

echo.
echo =========================================
echo   服务已启动！
echo   前端: http://localhost:3100
echo   后端: http://localhost:3001
echo   API文档: http://localhost:3001/api/docs
echo =========================================
echo.
pause
