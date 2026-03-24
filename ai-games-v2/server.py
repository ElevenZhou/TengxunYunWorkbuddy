#!/usr/bin/env python3
"""
AI Games V2 - HTTP Server
"""

import http.server
import socketserver
import json
import random
from urllib.parse import urlparse, parse_qs
from games import CodeBreaker, MazeGame, TwentyQuestions, CLIAventure

PORT = 8081
games = {}

class GameHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(self.get_html().encode("utf-8"))
        
        elif self.path == "/api/games":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            games_list = [
                {"id": "codebreaker", "name": "🔐 密码破译", "desc": "推理能力 - 破解4位数字密码", "category": "推理"},
                {"id": "maze", "name": "🧩 迷宫逃脱", "desc": "规划能力 - 找到出口", "category": "规划"},
                {"id": "questions", "name": "❓ 二十问", "desc": "提问策略 - 猜物品", "category": "对话"},
                {"id": "cli", "name": "💻 命令行冒险", "desc": "工具使用 - 探索文件系统", "category": "工具"},
            ]
            self.wfile.write(json.dumps(games_list).encode("utf-8"))
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST:
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length).decode("utf-8")
        data = json.loads(body) if body else {}
        
        action = data.get("action")
        
        if action == "new":
            game_type = data.get("type")
            session = str(random.randint(10000, 99999))
            
            if game_type == "codebreaker":
                games[session] = {"type": "codebreaker", "game": CodeBreaker()}
                msg = "🔐 密码破译开始！\n\n我心里想了一个 4 位不重复的数字，请猜猜是什么？\n\n提示：每次猜测会告诉你位置正确的数量和数字正确但位置错误的数量。"
            
            elif game_type == "maze":
                games[session] = {"type": "maze", "game": MazeGame(size=8)}
                msg = "🧩 迷宫逃脱开始！\n\n找到出口 🚪 就能获胜！\n\n" + games[session]["game"].get_map()
            
            elif game_type == "questions":
                games[session] = {"type": "questions", "game": TwentyQuestions()}
                msg = "❓ 二十问开始！\n\n我心里想了一个" + games[session]["game"].category + "，请用 Yes/No 问题来问我！\n\n例如：它是动物吗？它会飞吗？"
            
            elif game_type == "cli":
                games[session] = {"type": "cli", "game": CLIAventure()}
                g = games[session]["game"]
                msg = "💻 命令行冒险开始！\n\n目标：找到隐藏的密钥文件\n\n可用命令：ls, cd, cat, pwd\n\n" + g._ls([])
            
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"session": session, "message": msg}).encode("utf-8"))
            return
        
        # 游戏操作
        session = data.get("session")
        if session not in games:
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "无效会话"}).encode("utf-8"))
            return
        
        g = games[session]
        result = {"session": session}
        
        if g["type"] == "codebreaker":
            guess = data.get("guess", "").strip()
            r = g["game"].guess(guess)
            result["message"] = r.get("message", str(r))
            result["game_over"] = g["game"].game_over
            result["win"] = r.get("win")
        
        elif g["type"] == "maze":
            direction = data.get("direction", "").strip()
            r = g["game"].move(direction)
            result["message"] = r.get("message", str(r))
            if "map" in r:
                result["map"] = r["map"]
            result["game_over"] = g["game"].game_over
            result["win"] = r.get("win")
        
        elif g["type"] == "questions":
            if data.get("guess_answer"):
                r = g["game"].guess(data.get("guess_answer"))
                result["message"] = r.get("message")
                result["game_over"] = g["game"].game_over
                result["win"] = r.get("win")
            else:
                q = data.get("question", "").strip()
                r = g["game"].ask(q)
                result["answer"] = r.get("answer")
                result["questions_left"] = r.get("questions_left")
                result["message"] = f"{r.get('answer', '')}\n\n还能问 {r.get('questions_left', 20)} 个问题"
        
        elif g["type"] == "cli":
            cmd = data.get("command", "").strip()
            r = g["game"].execute(cmd)
            result["output"] = r.get("output") or r.get("error", "")
            result["current_dir"] = g["game"].current_dir
            if r.get("found"):
                result["found"] = True
                result["message"] = r.get("message")
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode("utf-8"))
    
    def get_html(self):
        return '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Agent Games V2</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh; color: #fff; padding: 20px;
        }
        .container { max-width: 900px; margin: 0 auto; }
        h1 {
            text-align: center; font-size: 2.5rem; margin-bottom: 10px;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { text-align: center; color: #888; margin-bottom: 30px; }
        .games {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px; margin-bottom: 30px;
        }
        .game-card {
            background: rgba(255,255,255,0.08); border-radius: 12px; padding: 20px;
            cursor: pointer; transition: all 0.3s; border: 2px solid transparent;
        }
        .game-card:hover { background: rgba(255,255,255,0.12); border-color: #00d9ff; }
        .game-card h3 { color: #00d9ff; margin-bottom: 8px; }
        .game-card .tag {
            display: inline-block; background: rgba(0,255,136,0.2); color: #00ff88;
            padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; margin-bottom: 8px;
        }
        .game-card p { color: #aaa; font-size: 0.9rem; }
        .game-area { display: none; background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; }
        .game-area.active { display: block; }
        .output {
            background: #0a0a0a; padding: 15px; border-radius: 8px;
            font-family: 'Consolas', monospace; white-space: pre-wrap;
            min-height: 150px; max-height: 300px; overflow-y: auto; margin-bottom: 15px;
        }
        .input-area { display: flex; gap: 10px; }
        input {
            flex: 1; padding: 12px; border: none; border-radius: 8px;
            background: rgba(255,255,255,0.1); color: #fff; font-size: 1rem;
        }
        input:focus { outline: 2px solid #00d9ff; }
        button {
            padding: 12px 24px; border: none; border-radius: 8px;
            background: linear-gradient(90deg, #00d9ff, #00ff88); color: #000;
            font-weight: bold; cursor: pointer;
        }
        button:hover { opacity: 0.9; }
        .close-btn { float: right; background: #ff6b6b; color: #fff; }
        .win { color: #00ff88; font-size: 1.2rem; }
        .lose { color: #ff6b6b; font-size: 1.2rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🤖 AI Agent Games V2</h1>
        <p class="subtitle">评估 AI Agent 核心能力 | 推理 · 规划 · 工具使用 · 对话</p>
        
        <div class="games">
            <div class="game-card" onclick="startGame('codebreaker')">
                <span class="tag">推理</span>
                <h3>🔐 密码破译</h3>
                <p>破解 4 位不重复数字</p>
            </div>
            <div class="game-card" onclick="startGame('maze')">
                <span class="tag">规划</span>
                <h3>🧩 迷宫逃脱</h3>
                <p>找到迷宫出口</p>
            </div>
            <div class="game-card" onclick="startGame('questions')">
                <span class="tag">对话</span>
                <h3>❓ 二十问</h3>
                <p>Yes/No 问题猜物品</p>
            </div>
            <div class="game-card" onclick="startGame('cli')">
                <span class="tag">工具</span>
                <h3>💻 命令行冒险</h3>
                <p>用命令探索文件系统</p>
            </div>
        </div>
        
        <div class="game-area" id="gameArea">
            <button class="close-btn" onclick="closeGame()">关闭</button>
            <h2 id="gameTitle" style="margin-bottom: 15px;"></h2>
            <div class="output" id="output"></div>
            <div class="input-area">
                <input type="text" id="gameInput" placeholder="输入..." onkeypress="handleKey(event)">
                <button onclick="sendInput()">发送</button>
            </div>
        </div>
    </div>
    <script>
        let session = null;
        let gameType = null;
        
        async function startGame(type) {
            gameType = type;
            document.getElementById('gameArea').classList.add('active');
            const res = await fetch('/api', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'new', type: type})
            });
            const data = await res.json();
            session = data.session;
            document.getElementById('output').textContent = data.message;
            document.getElementById('gameInput').focus();
        }
        
        async function sendInput() {
            const input = document.getElementById('gameInput');
            const value = input.value.trim();
            if (!value || !session) return;
            
            const output = document.getElementById('output');
            output.textContent += '\n\n> ' + value + '\n';
            
            let body = {session, action: 'play'};
            if (gameType === 'codebreaker') body.guess = value;
            else if (gameType === 'maze') body.direction = value;
            else if (gameType === 'questions') body.question = value;
            else if (gameType === 'cli') body.command = value;
            
            const res = await fetch('/api', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            const data = await res.json();
            
            let msg = data.message || data.output || '';
            if (data.game_over) {
                msg = data.win ? '🎉 ' + msg : '😢 ' + msg;
            }
            output.textContent += msg;
            output.scrollTop = output.scrollHeight;
            input.value = '';
        }
        
        function handleKey(e) { if (e.key === 'Enter') sendInput(); }
        function closeGame() { document.getElementById('gameArea').classList.remove('active'); session = null; }
    </script>
</body>
</html>'''

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), GameHandler) as httpd:
        print(f"🤖 AI Games V2 运行中: http://localhost:{PORT}")
        httpd.serve_forever()
