#!/usr/bin/env python3
"""
AI Games - 文字冒险游戏
"""

class TextAdventure:
    def __init__(self):
        self.current_room = "entrance"
        self.inventory = []
        self.game_over = False
        self.message = ""
        
        self.rooms = {
            "entrance": {
                "name": "城堡入口",
                "description": "你站在一座古老城堡的入口。大门敞开着，里面黑漆漆的。",
                "exits": {"north": "hall"},
                "items": ["torch"]
            },
            "hall": {
                "name": "大厅",
                "description": "这是一个宏伟的大厅，墙壁上挂满了古老的画像。",
                "exits": {"south": "entrance", "east": "kitchen", "west": "library", "north": "tower"},
                "items": ["key"]
            },
            "kitchen": {
                "name": "厨房",
                "description": "厨房里弥漫着奇怪的味道，炉火还在燃烧。",
                "exits": {"west": "hall"},
                "items": ["potion"]
            },
            "library": {
                "name": "图书馆",
                "description": "书架上堆满了古老的书籍，空气中弥漫着灰尘的味道。",
                "exits": {"east": "hall"},
                "items": ["scroll"]
            },
            "tower": {
                "name": "塔楼",
                "description": "你来到了塔顶，可以看到远处的风景。",
                "exits": {"south": "hall"},
                "items": [],
                "locked": True,
                "required_item": "key"
            }
        }
        
        self.item_descriptions = {
            "torch": "一个燃烧的火把，可以照亮黑暗的地方。",
            "key": "一把古老的金钥匙，看起来很重要。",
            "potion": "一瓶发光的药水，不知道有什么效果。",
            "scroll": "一份神秘的卷轴，上面写着古老的文字。"
        }
    
    def get_room(self):
        """获取当前房间信息"""
        room = self.rooms[self.current_room]
        info = f"📍 **{room['name']}**\n\n{room['description']}\n"
        
        # 显示出口
        exits = ", ".join(room['exits'].keys())
        info += f"\n🚪 出口: {exits}"
        
        # 显示物品
        if room.get('items'):
            items = ", ".join(room['items'])
            info += f"\n\n🎁 物品: {items}"
        
        return info
    
    def move(self, direction):
        """移动到其他房间"""
        room = self.rooms[self.current_room]
        
        if direction not in room['exits']:
            return "你无法往那个方向走。"
        
        next_room = room['exits'][direction]
        next_room_data = self.rooms[next_room]
        
        # 检查是否需要钥匙
        if next_room_data.get('locked'):
            if 'key' not in self.inventory:
                return "🔒 这扇门被锁住了！你需要一把钥匙。"
            else:
                next_room_data['locked'] = False
                self.message = "你用钥匙打开了门！"
        
        self.current_room = next_room
        return self.get_room()
    
    def take(self, item):
        """捡起物品"""
        room = self.rooms[self.current_room]
        
        if item in room.get('items', []):
            room['items'].remove(item)
            self.inventory.append(item)
            return f"你捡起了 {item}！\n\n{self.item_descriptions.get(item, '')}"
        else:
            return "这里没有这个物品。"
    
    def inventory_show(self):
        """显示背包"""
        if not self.inventory:
            return "你的背包是空的。"
        
        info = "🎒 背包:\n"
        for item in self.inventory:
            info += f"  - {item}: {self.item_descriptions.get(item, '')}\n"
        return info
    
    def use(self, item):
        """使用物品"""
        if item not in self.inventory:
            return "你背包里没有这个物品。"
        
        if item == "potion":
            self.game_over = True
            return "💫 你喝下了药水，感觉全身充满了力量！\n\n🎉 恭喜你！你发现了城堡的宝藏，成为了新的城堡主人！\n游戏结束！"
        
        if item == "scroll":
            return f"卷轴上写着：「城堡的宝藏藏在塔楼顶部的宝箱里，用钥匙打开它。」"
        
        return "这个物品现在无法使用。"
    
    def help(self):
        """帮助信息"""
        return """
📖 **命令列表:**

- `移动 [方向]` - 往某个方向走 (north/south/east/west)
- `捡起 [物品]` - 捡起地上的物品
- `背包` - 查看背包
- `使用 [物品]` - 使用背包里的物品
- `查看` - 查看当前房间
- `帮助` - 显示帮助
        """

# 测试
if __name__ == "__main__":
    game = TextAdventure()
    print(game.get_room())
    print(game.help())
