#!/usr/bin/env python3
"""
AI Games - 游戏主入口
支持多种经典游戏，AI 可以通过命令行或 HTTP API 来玩
"""

import http.server
import socketserver
import json
import random
from urllib.parse import urlparse, parse_qs

# 游戏模块
from guess_number import NumberGuessingGame
from tictactoe import TicTacToe
from adventure import TextAdventure

# 全局游戏状态
games = {}

class GameHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == "/" or path == "/index.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(self.get_html().encode("utf-8"))
        
        elif path == "/api/games":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            games_list = [
                {"id": "guess", "name": "猜数字", "description": "猜一个 1-100 的数字"},
                {"id": "tictactoe", "name": "井字棋", "description": "经典的三子棋游戏"},
                {"id": "adventure", "name": "文字冒险", "description": "探索神秘城堡"},
                {"id": "dice", "name": "骰子比大小", "description": "简单运气游戏"}
            ]
            self.wfile.write(json.dumps(games_list).encode("utf-8"))
        
        elif path == "/api/new":
            query = parse_qs(parsed.query)
            game_type = query.get("type", ["guess"])[0]
            session_id = str(random.randint(1000, 9999))
            
            if game_type == "guess":
                games[session_id] = {"type": "guess", "game": NumberGuessingGame()}
                message = "🎮 游戏开始！我想了一个 1-100 的数字，请猜吧！"
            elif game_type == "tictactoe":
                games[session_id] = {"type": "tictactoe", "game": TicTacToe()}
                message = "🎮 井字棋游戏！\n你是 X，AI 是 O\n" + games[session_id]["game"].print_board()
            elif game_type == "adventure":
                games[session_id] = {"type": "adventure", "game": TextAdventure()}
                message = "🎮 文字冒险开始！\n" + games[session_id]["game"].get_room()
            elif game_type == "dice":
                games[session_id] = {"type": "dice", "game": None, "player_score": 0, "ai_score": 0}
                message = "🎮 骰子比大小！\n我来掷三个骰子，你也掷三个，比较点数总和。"
            
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"session": session_id, "message": message}).encode("utf-8"))
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(length).decode("utf-8")
        data = json.loads(body) if body else {}
        
        session_id = data.get("session")
        action = data.get("action")
        
        if session_id not in games:
            self.send_response(400)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "无效的会话"}).encode("utf-8"))
            return
        
        game_data = games[session_id]
        game_type = game_data["type"]
        result = {"session": session_id}
        
        if game_type == "guess":
            if action == "guess":
                guess_num = int(data.get("guess", 0))
                result["message"] = game_data["game"].guess(guess_num)
                result["status"] = game_data["game"].get_status()
        
        elif game_type == "tictactoe":
            if action == "move":
                pos = int(data.get("position", -1))
                valid, msg = game_data["game"].make_move(pos)
                result["message"] = msg
                result["board"] = game_data["game"].board
                
                if not game_data["game"].game_over and game_data["game"].current_player == "O":
                    ai_pos = game_data["game"].ai_move()
                    game_data["game"].make_move(ai_pos)
                    result["message"] += "\n\nAI 落子后:\n" + game_data["game"].print_board()
                
                result["game_over"] = game_data["game"].game_over
                result["winner"] = game_data["game"].winner
        
        elif game_type == "adventure":
            cmd = data.get("command", "").lower().split()
            if not cmd:
                result["message"] = "请输入命令！"
            else:
                verb = cmd[0]
                arg = " ".join(cmd[1:]) if len(cmd) > 1 else ""
                
                if verb in ["n", "north"]:
                    result["message"] = game_data["game"].move("north")
                elif verb in ["s", "south"]:
                    result["message"] = game_data["game"].move("south")
                elif verb in ["e", "east"]:
                    result["message"] = game_data["game"].move("east")
                elif verb in ["w", "west"]:
                    result["message"] = game_data["game"].move("west")
                elif verb in ["移动", "走"]:
                    result["message"] = game_data["game"].move(arg)
                elif verb in ["捡", "take", "捡起"]:
                    result["message"] = game_data["game"].take(arg)
                elif verb in ["背包", "inventory"]:
                    result["message"] = game_data["game"].inventory_show()
                elif verb in ["使用", "use"]:
                    result["message"] = game_data["game"].use(arg)
                elif verb in ["查看", "look"]:
                    result["message"] = game_data["game"].get_room()
                elif verb in ["帮助", "help"]:
                    result["message"] = game_data["game"].help()
                else:
                    result["message"] = "未知命令！输入 '帮助' 查看命令列表。"
                
                result["game_over"] = game_data["game"].game_over
        
        elif game_type == "dice":
            player_dice = [random.randint(1, 6) for _ in range(3)]
            ai_dice = [random.randint(1, 6) for _ in range(3)]
            player_sum = sum(player_dice)
            ai_sum = sum(ai_dice)
            
            if player_sum > ai_sum:
                outcome = "你赢了！🎉"
            elif player_sum < ai_sum:
                outcome = "AI 赢了！🤖"
            else:
                outcome = "平局！🤝"
            
            result["message"] = f"🎲 你的骰子: {player_dice} = {player_sum}\n🎲 AI 骰子: {ai_dice} = {ai_sum}\n\n{outcome}"
        
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
    <title>AI Games - 游戏中心</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh; color: #fff;
            padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        h1 {
            text-align: center;
            font-size: 2.5rem;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 30px;
        }
        .games {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .game-card {
            background: rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid transparent;
        }
        .game-card:hover {
            background: rgba(255,255,255,0.15);
            border-color: #00d9ff;
            transform: translateY(-5px);
        }
        .game-card h3 { color: #00d9ff; margin-bottom: 10px; }
        .game-card p { color: #aaa; font-size: 0.9rem; }
        .game-area {
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 20px;
            display: none;
        }
        .game-area.active { display: block; }
        .game-area h2 { color: #00ff88; margin-bottom: 15px; }
        #game-output {
            background: #000;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            white-space: pre-wrap;
            min-height: 200px;
            margin-bottom: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        .input-area { display: flex; gap: 10px; }
        input {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            color: #fff;
            font-size: 1rem;
        }
        input:focus { outline: 2px solid #00d9ff; }
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            color: #000;
            font-weight: bold;
            cursor: pointer;
        }
        button:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎮 AI Games</h1>
        <div class="games">
            <div class="game-card" onclick="startGame("guess")">
                <h3>🎯 猜数字</h3>
                <p>猜一个 1-100 的数字</p>
            </div>
            <div class="game-card" onclick="startGame("tictactoe")">
                <h3>⭕ 井字棋</h3>
                <p>经典三子棋游戏</p>
            </div>
            <div class="game-card" onclick="startGame("adventure")">
                <h3>🏰 文字冒险</h3>
                <p>探索神秘城堡</p>
            </div>
            <div class="game-card" onclick="startGame("dice")">
                <h3>🎲 骰子比大小</h3>
                <p>简单运气游戏</p>
            </div>
        </div>
        <div class="game-area" id="gameArea">
            <h2 id="gameTitle"></h2>
            <div id="gameOutput"></div>
            <div class="input-area">
                <input type="text" id="gameInput" placeholder="输入你的选择..." onkeypress="handleKey(event)">
                <button onclick="sendAction()">发送</button>
            </div>
        </div>
    </div>
    <script>
        let currentSession = null;
        
        async function startGame(type) {
            document.getElementById("gameArea").classList.add("active");
            const res = await fetch("/api/new?type=" + type);
            const data = await res.json();
            currentSession = data.session;
            document.getElementById("gameOutput").textContent = data.message;
            document.getElementById("gameInput").focus();
        }
        
        async function sendAction() {
            const input = document.getElementById("gameInput");
            const action = input.value.trim();
            if (!action || !currentSession) return;
            
            const gameType = currentSession.startsWith("guess") ? "guess" : 
                           currentSession.startsWith("tictactoe") ? "tictactoe" :
                           currentSession.startsWith("adventure") ? "adventure" : "dice";
            
            let body = { session: currentSession, action: "guess" };
            
            if (gameType === "guess") {
                body.guess = parseInt(action);
            } else if (gameType === "tictactoe") {
                body.action = "move";
                body.position = parseInt(action);
            } else {
                body.action = "process";
                body.command = action;
            }
            
            const res = await fetch("/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            
            document.getElementById("gameOutput").textContent += "\n\n> " + action + "\n\n" + data.message;
            document.getElementById("gameOutput").scrollTop = document.getElementById("gameOutput").scrollHeight;
            input.value = "";
        }
        
        function handleKey(e) {
            if (e.key === "Enter") sendAction();
        }
    </script>
</body>
</html>'''

def run_server(port=8080):
    with socketserver.TCPServer(("", port), GameHandler) as httpd:
        print(f"🎮 AI Games 服务器运行在 http://localhost:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server(8080)
