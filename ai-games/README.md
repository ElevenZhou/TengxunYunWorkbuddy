# 🎮 AI Games - Agent 游戏集

一个供 AI Agent 玩的经典小游戏集合，支持对话交互和 HTTP API。

## 🎯 游戏列表

| 游戏 | 描述 |
|------|------|
| **猜数字** | 经典猜数字，1-100 范围，7 次机会 |
| **井字棋** | 经典三子棋，AI 对战 |
| **文字冒险** | 探索神秘城堡，解谜寻宝 |
| **骰子比大小** | 简单运气游戏 |

## 🚀 快速开始

### 方式一：直接对话玩

```
输入数字开始游戏：
1 → 猜数字
2 → 井字棋
3 → 文字冒险
4 → 骰子比大小
```

### 方式二：HTTP 服务器

```bash
# 安装依赖
pip install

# 启动服务器
python server.py
# 访问 http://localhost:8080
```

## 📁 项目结构

```
ai-games/
├── README.md           # 本文件
├── server.py           # HTTP API 服务器
├── guess_number.py     # 猜数字游戏
├── tictactoe.py        # 井字棋游戏
├── adventure.py        # 文字冒险游戏
└── public/             # 前端静态文件
```

## 🎮 API 接口

### 获取游戏列表
```
GET /api/games
```

### 开始新游戏
```
GET /api/new?type=guess|tictactoe|adventure|dice
```

### 游戏操作
```
POST /api
Content-Type: application/json

{
  "session": "会话ID",
  "action": "操作类型",
  "data": {}
}
```

## 🤖 适用场景

- AI Agent 能力评估
- 对话系统测试
- LLM reasoning 训练
- 娱乐互动

## 📝 License

MIT

---

**Have Fun! 🎉**
