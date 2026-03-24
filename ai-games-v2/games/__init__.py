#!/usr/bin/env python3
"""
AI Agent Games V2 - 游戏引擎核心
"""

import random
import string
from typing import List, Dict, Tuple, Optional

class CodeBreaker:
    """密码破译游戏 - 评估推理能力"""
    
    def __init__(self, digits: int = 4, max_attempts: int = 10):
        self.digits = digits
        self.max_attempts = max_attempts
        self.secret = self._generate_code()
        self.attempts = 0
        self.game_over = False
        self.history = []
    
    def _generate_code(self) -> str:
        """生成不重复的数字密码"""
        digits = list(string.digits)
        random.shuffle(digits)
        return ''.join(digits[:self.digits])
    
    def guess(self, code: str) -> Dict:
        """处理猜测"""
        self.attempts += 1
        
        # 验证输入
        if len(code) != self.digits or not code.isdigit():
            return {"error": f"请输入 {self.digits} 位数字"}
        
        if len(set(code)) != self.digits:
            return {"error": "数字不能重复"}
        
        # 计算匹配
        exact = sum(1 for i in range(self.digits) if code[i] == self.secret[i])
        wrong_pos = sum(1 for d in code if d in self.secret) - exact
        
        result = {
            "guess": code,
            "exact": exact,           # 位置和数字都正确
            "wrong_position": wrong_pos,  # 数字正确但位置错误
            "attempts_left": self.max_attempts - self.attempts
        }
        
        self.history.append(result)
        
        if exact == self.digits:
            self.game_over = True
            result["win"] = True
            result["message"] = f"🎉 破解成功！密码是 {self.secret}"
        elif self.attempts >= self.max_attempts:
            self.game_over = True
            result["win"] = False
            result["message"] = f"😢 失败！正确密码是 {self.secret}"
        else:
            result["win"] = None
            result["message"] = f"位置正确: {exact}, 数字对但位置错: {wrong_pos}"
        
        return result
    
    def hint(self) -> str:
        """给一个提示"""
        return f"密码是 {self.digits} 位不重复的数字"
    
    def get_status(self) -> Dict:
        return {
            "attempts": self.attempts,
            "max_attempts": self.max_attempts,
            "game_over": self.game_over,
            "history": self.history
        }


class MazeGame:
    """迷宫逃脱游戏 - 评估规划能力"""
    
    WALL = '🧱'
    PATH = '⬜'
    PLAYER = '🤖'
    EXIT = '🚪'
    VISITED = '✅'
    
    def __init__(self, size: int = 10):
        self.size = size
        self.maze = self._generate_maze()
        self.player_pos = (1, 1)
        self.exit_pos = (size - 2, size - 2)
        self.steps = 0
        self.max_steps = size * size * 2
        self.history = []
        self.game_over = False
    
    def _generate_maze(self) -> List[List[str]]:
        """生成迷宫"""
        # 简单迷宫生成：随机墙壁
        maze = [[self.PATH for _ in range(self.size)] for _ in range(self.size)]
        
        # 围墙
        for i in range(self.size):
            maze[0][i] = self.WALL
            maze[self.size-1][i] = self.WALL
            maze[i][0] = self.WALL
            maze[i][self.size-1] = self.WALL
        
        # 随机墙壁（不阻塞路径）
        for _ in range(self.size * 3):
            x, y = random.randint(1, self.size-2), random.randint(1, self.size-2)
            if (x, y) not in [(1, 1), (self.size-2, self.size-2)]:
                maze[y][x] = self.WALL
        
        # 确保起点和终点连通（简化处理：清空一些墙）
        maze[1][1] = self.PATH
        maze[self.size-2][self.size-2] = self.PATH
        
        maze[self.exit_pos[1]][self.exit_pos[0]] = self.EXIT
        
        return maze
    
    def get_map(self, reveal_all: bool = False) -> str:
        """获取迷宫地图"""
        visible = [[' ' for _ in range(self.size)] for _ in range(self.size)]
        
        for y in range(self.size):
            for x in range(self.size):
                if reveal_all:
                    visible[y][x] = self.maze[y][x]
                else:
                    # 只显示玩家周围 3x3
                    if abs(x - self.player_pos[0]) <= 1 and abs(y - self.player_pos[1]) <= 1:
                        visible[y][x] = self.maze[y][x]
                    else:
                        visible[y][x] = '⬛'
        
        visible[self.player_pos[1]][self.player_pos[0]] = self.PLAYER
        
        return '\n'.join([' '.join(row) for row in visible])
    
    def move(self, direction: str) -> Dict:
        """移动玩家"""
        self.steps += 1
        
        moves = {
            'north': (0, -1), 'n': (0, -1),
            'south': (0, 1), 's': (0, 1),
            'west': (-1, 0), 'w': (-1, 0),
            'east': (1, 0), 'e': (1, 0)
        }
        
        if direction.lower() not in moves:
            return {"error": "无效方向，可用: north/south/east/west 或 n/s/e/w"}
        
        dx, dy = moves[direction.lower()]
        new_x = self.player_pos[0] + dx
        new_y = self.player_pos[1] + dy
        
        # 检查边界
        if self.maze[new_y][new_x] == self.WALL:
            return {
                "message": "撞墙了！",
                "position": self.player_pos,
                "steps": self.steps
            }
        
        self.player_pos = (new_x, new_y)
        
        # 检查是否到达出口
        if self.player_pos == self.exit_pos:
            self.game_over = True
            return {
                "win": True,
                "message": f"🎉 逃脱成功！用了 {self.steps} 步",
                "position": self.player_pos,
                "steps": self.steps
            }
        
        # 检查步数
        if self.steps >= self.max_steps:
            self.game_over = True
            return {
                "win": False,
                "message": "步数用尽，没找到出口",
                "position": self.player_pos,
                "steps": self.steps
            }
        
        return {
            "win": None,
            "message": f"移动到 {direction}",
            "position": self.player_pos,
            "steps": self.steps,
            "map": self.get_map()
        }
    
    def get_status(self) -> Dict:
        return {
            "position": self.player_pos,
            "exit": self.exit_pos,
            "steps": self.steps,
            "game_over": self.game_over
        }


class TwentyQuestions:
    """二十问游戏 - 评估提问策略"""
    
    def __init__(self, categories: List[str] = None):
        self.categories = categories or [
            "动物", "植物", "物品", "职业", "地点", "食物", "科技", "自然"
        ]
        self.items = {
            "动物": ["猫", "狗", "大象", "长颈鹿", "企鹅", "老虎", "熊猫", "鲸鱼"],
            "植物": ["玫瑰", "樱花", "松树", "仙人掌", "竹子", "莲花", "银杏"],
            "物品": ["手机", "电脑", "汽车", "飞机", "书本", "椅子", "灯", "手机"],
            "职业": ["医生", "老师", "工程师", "警察", "厨师", "司机", "作家"],
            "地点": ["北京", "东京", "巴黎", "纽约", "上海", "伦敦", "悉尼"],
            "食物": ["火锅", "烧烤", "寿司", "披萨", "面条", "饺子", "牛排"],
            "科技": ["手机", "电脑", "互联网", "AI", "机器人", "无人机", "区块链"],
            "自然": ["山", "海", "河", "湖", "森林", "沙漠", "草原"]
        }
        self.reset()
    
    def reset(self):
        """重新开始"""
        category = random.choice(self.categories)
        self.target = random.choice(self.items[category])
        self.questions = 0
        self.max_questions = 20
        self.hints = []
        self.game_over = False
        self.category = category
    
    def ask(self, question: str) -> Dict:
        """回答问题"""
        self.questions += 1
        
        q = question.lower()
        
        # 简单问答逻辑
        if "是" in q or "吗" in q or "有" in q or "会" in q:
            # 这是一个 yes/no 问题
            answer = self._evaluate_question(question)
            return {
                "answer": answer,
                "questions_left": self.max_questions - self.questions
            }
        elif self.questions >= self.max_questions:
            self.game_over = True
            return {
                "game_over": True,
                "message": f"问题用尽！答案是 {self.target}",
                "target": self.target
            }
        else:
            return {
                "answer": "请用是/否 问题提问",
                "questions_left": self.max_questions - self.questions
            }
    
    def _evaluate_question(self, question: str) -> str:
        """评估问题并返回答案"""
        q = question.lower()
        
        # 物品相关问题
        if "动物" in self.category:
            if any(w in q for w in ["会飞", "天上", "翅膀", "鸟"]):
                return "否" if self.target not in ["鸟", "企鹅", "蝴蝶"] else "是"
            if any(w in q for w in ["会跑", "地上", "四条腿", "哺乳"]):
                return "是" if self.target in ["狗", "猫", "大象", "老虎"] else "否"
        
        # 默认随机回答（简化版）
        responses = ["是", "否", "不确定"]
        return random.choice(responses)
    
    def guess(self, answer: str) -> Dict:
        """猜测答案"""
        if answer == self.target:
            self.game_over = True
            return {
                "win": True,
                "message": f"🎉 猜对了！用了 {self.questions} 个问题"
            }
        else:
            return {
                "win": False,
                "message": f"不对，再试试",
                "questions_left": self.max_questions - self.questions
            }
    
    def get_hint(self) -> str:
        """给提示"""
        return f"这是 {self.category} 相关的"


class CLIAventure:
    """命令行冒险 - 评估工具使用能力"""
    
    def __init__(self):
        self.file_system = self._create_filesystem()
        self.current_dir = "/home/user"
        self.history = []
        self.target_file = self._select_target()
        self.found = False
    
    def _create_filesystem(self) -> Dict:
        """创建虚拟文件系统"""
        return {
            "/": {"type": "dir", "contents": ["home", "var", "etc", "tmp"]},
            "/home": {"type": "dir", "contents": ["user", "admin", "guest"]},
            "/home/user": {"type": "dir", "contents": ["documents", "downloads", "pictures", ".secret"]},
            "/home/user/documents": {"type": "dir", "contents": ["readme.txt", "notes.txt", "project"]},
            "/home/user/documents/project": {"type": "dir", "contents": ["main.py", "config.json"]},
            "/home/user/downloads": {"type": "dir", "contents": ["file1.zip", "image.png"]},
            "/home/user/pictures": {"type": "dir", "contents": ["photo.jpg", "wallpaper.png"]},
            "/home/user/.secret": {"type": "dir", "contents": ["password.txt", "key.txt"]},
            "/home/user/.secret/password.txt": {"type": "file", "content": "secret123"},
            "/home/user/.secret/key.txt": {"type": "file", "content": "API_KEY=abc123xyz"},
            "/home/admin": {"type": "dir", "contents": ["notes"]},
            "/home/admin/notes": {"type": "file", "content": "Remember: the key is in /home/user/.secret"},
            "/var": {"type": "dir", "contents": ["log", "www"]},
            "/var/log": {"type": "dir", "contents": ["system.log", "error.log"]},
            "/etc": {"type": "dir", "contents": ["config", "passwd"]},
            "/etc/config": {"type": "file", "content": "settings here"},
            "/etc/passwd": {"type": "file", "content": "root:x:0:0:root:/root:/bin/bash"},
            "/tmp": {"type": "dir", "contents": []}
        }
    
    def _select_target(self) -> str:
        """选择目标文件"""
        targets = [
            ("/home/user/.secret/key.txt", "找到密钥文件！"),
            ("/home/user/.secret/password.txt", "找到密码文件！"),
            ("/home/admin/notes", "找到提示文件！")
        ]
        return random.choice(targets)
    
    def execute(self, command: str) -> Dict:
        """执行命令"""
        self.history.append(command)
        
        parts = command.strip().split()
        if not parts:
            return {"error": "请输入命令"}
        
        cmd = parts[0]
        args = parts[1:] if len(parts) > 1 else []
        
        if cmd == "ls" or cmd == "dir":
            return self._ls(args)
        elif cmd == "cd":
            return self._cd(args[0] if args else "/")
        elif cmd == "cat" or cmd == "type":
            return self._cat(args[0] if args else "")
        elif cmd == "pwd":
            return {"output": self.current_dir}
        elif cmd == "help":
            return {"output": "可用命令: ls, cd, cat, pwd"}
        else:
            return {"error": f"未知命令: {cmd}"}
    
    def _ls(self, args: List[str]) -> Dict:
        """列出目录内容"""
        path = self.current_dir if not args else self._resolve_path(args[0])
        
        if path not in self.file_system:
            return {"error": f"目录不存在: {path}"}
        
        item = self.file_system[path]
        if item["type"] != "dir":
            return {"error": f"不是目录: {path}"}
        
        contents = item["contents"]
        
        # 隐藏文件
        show_all = "-a" in args or "-la" in args or "-al" in args
        if not show_all:
            contents = [c for c in contents if not c.startswith('.')]
        
        return {"output": '  '.join(contents) if contents else "(空)"}
    
    def _cd(self, path: str) -> Dict:
        """切换目录"""
        new_path = self._resolve_path(path)
        
        if new_path not in self.file_system:
            return {"error": f"目录不存在: {new_path}"}
        
        if self.file_system[new_path]["type"] != "dir":
            return {"error": f"不是目录: {new_path}"}
        
        self.current_dir = new_path
        return {"output": f"切换到 {new_path}"}
    
    def _cat(self, filename: str) -> Dict:
        """查看文件内容"""
        if not filename:
            return {"error": "请指定文件名"}
        
        path = self._resolve_path(filename)
        
        if path not in self.file_system:
            return {"error": f"文件不存在: {path}"}
        
        item = self.file_system[path]
        if item["type"] != "file":
            return {"error": f"不是文件: {path}"}
        
        # 检查是否找到目标
        if path == self.target_file[0]:
            self.found = True
            return {
                "output": item["content"],
                "found": True,
                "message": f"🎉 {self.target_file[1]}"
            }
        
        return {"output": item["content"]}
    
    def _resolve_path(self, path: str) -> str:
        """解析路径"""
        if path.startswith("/"):
            return path
        
        if path == "..":
            parts = self.current_dir.split("/")
            return "/".join(parts[:-1]) or "/"
        
        if path == ".":
            return self.current_dir
        
        return f"{self.current_dir}/{path}"
    
    def get_status(self) -> Dict:
        return {
            "current_dir": self.current_dir,
            "history": self.history[-5:],
            "found": self.found,
            "target": self.target_file[0]
        }


# 导出所有游戏
__all__ = ['CodeBreaker', 'MazeGame', 'TwentyQuestions', 'CLIAventure']
