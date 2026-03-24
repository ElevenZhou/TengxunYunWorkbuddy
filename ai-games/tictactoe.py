#!/usr/bin/env python3
"""
AI Games - 井字棋游戏
"""

class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_player = 'X'  # AI 是 O，玩家是 X
        self.game_over = False
        self.winner = None
        self.winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # 行
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # 列
            [0, 4, 8], [2, 4, 6]               # 对角线
        ]
    
    def print_board(self):
        """打印棋盘"""
        board_display = ""
        for i in range(3):
            row = ""
            for j in range(3):
                cell = self.board[i * 3 + j]
                row += f" {cell} "
                if j < 2:
                    row += "|"
            board_display += row + "\n"
            if i < 2:
                board_display += "---+---+---\n"
        return board_display
    
    def is_valid_move(self, pos):
        """检查是否有效"""
        return 0 <= pos <= 8 and self.board[pos] == ' '
    
    def make_move(self, pos):
        """执行一步"""
        if not self.is_valid_move(pos):
            return False, "无效的位置！请选择 0-8 之间的空位。"
        
        self.board[pos] = self.current_player
        
        # 检查胜利
        if self.check_winner():
            self.game_over = True
            self.winner = self.current_player
            return True, f"🎉 {self.current_player} 获胜！"
        
        # 检查平局
        if ' ' not in self.board:
            self.game_over = True
            self.winner = 'Draw'
            return True, "🤝 平局！"
        
        # 切换玩家
        self.current_player = 'O' if self.current_player == 'X' else 'X'
        return True, f"轮到 {self.current_player} 了！"
    
    def check_winner(self):
        """检查是否有玩家获胜"""
        for combo in self.winning_combinations:
            if self.board[combo[0]] == self.board[combo[1]] == self.board[combo[2]] != ' ':
                return True
        return False
    
    def get_available_moves(self):
        """获取可用位置"""
        return [i for i in range(9) if self.board[i] == ' ']
    
    def ai_move(self):
        """AI 简单的策略"""
        available = self.get_available_moves()
        if not available:
            return None
        
        # 简单的策略：先尝试获胜，然后阻止对方获胜，最后随机
        # 检查是否能直接获胜
        for pos in available:
            self.board[pos] = 'O'
            if self.check_winner():
                self.board[pos] = ' '
                return pos
            self.board[pos] = ' '
        
        # 检查是否需要阻止对方获胜
        for pos in available:
            self.board[pos] = 'X'
            if self.check_winner():
                self.board[pos] = ' '
                return pos
            self.board[pos] = ' '
        
        # 优先选择中心
        if 4 in available:
            return 4
        
        # 随机选择角落
        corners = [0, 2, 6, 8]
        available_corners = [c for c in corners if c in available]
        if available_corners:
            return random.choice(available_corners)
        
        return random.choice(available)

import random

# 测试
if __name__ == "__main__":
    game = TicTacToe()
    print("井字棋游戏！")
    print("你是 X，AI 是 O")
    print("位置对应：")
    print(" 0 | 1 | 2 ")
    print("---+---+---")
    print(" 3 | 4 | 5 ")
    print("---+---+---")
    print(" 6 | 7 | 8 ")
    print()
    print(game.print_board())
    
    while not game.game_over:
        if game.current_player == 'X':
            try:
                pos = int(input("请输入位置 (0-8): "))
                valid, msg = game.make_move(pos)
                print(msg)
                if not valid:
                    continue
            except ValueError:
                print("请输入有效数字！")
                continue
        else:
            print("AI 思考中...")
            pos = game.ai_move()
            game.make_move(pos)
        
        print(game.print_board())
    
    print(f"游戏结束，获胜者: {game.winner}")
