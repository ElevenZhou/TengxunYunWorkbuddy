#!/usr/bin/env python3
"""
AI Games - 猜数字游戏
"""

import random
import json

class NumberGuessingGame:
    def __init__(self):
        self.target = random.randint(1, 100)
        self.attempts = 0
        self.min_num = 1
        self.max_num = 100
        self.max_attempts = 7
        self.game_over = False
        self.won = False
    
    def guess(self, num):
        """处理猜测"""
        self.attempts += 1
        num = int(num)
        
        if num < self.min_num or num > self.max_num:
            return f"请输入 {self.min_num}-{self.max_num} 之间的数字！"
        
        if num == self.target:
            self.won = True
            self.game_over = True
            return f"🎉 恭喜你猜对了！答案就是 {self.target}！\n你用了 {self.attempts} 次猜测。"
        elif self.attempts >= self.max_attempts:
            self.game_over = True
            return f"😢 游戏结束！你用了太多次猜测。\n正确答案是 {self.target}。"
        elif num < self.target:
            return f"📈 猜小了！还有 {self.max_attempts - self.attempts} 次机会。\n范围：{self.min_num}-{self.max_num}"
        else:
            return f"📉 猜大了！还有 {self.max_attempts - self.attempts} 次机会。\n范围：{self.min_num}-{self.max_num}"
    
    def get_hint(self):
        """给提示"""
        return f"提示：答案在 {self.min_num} 到 {self.max_num} 之间。"
    
    def get_status(self):
        """获取游戏状态"""
        return {
            "attempts": self.attempts,
            "max_attempts": self.max_attempts,
            "game_over": self.game_over,
            "won": self.won
        }

# 测试
if __name__ == "__main__":
    game = NumberGuessingGame()
    print(f"我想了一个 {game.min_num}-{game.max_num} 的数字，来猜吧！")
    print(f"目标数字（测试用）: {game.target}")
    
    while not game.game_over:
        try:
            guess = int(input("请输入数字: "))
            result = game.guess(guess)
            print(result)
        except ValueError:
            print("请输入有效的数字！")
    
    print(f"\n游戏状态: {game.get_status()}")
