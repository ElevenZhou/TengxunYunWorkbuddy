# 发布指南

## 1. 发布到 GitHub

### 步骤 1: 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` → `New repository`
3. 填写：
   - Repository name: `ai-games`
   - Description: AI Agent Games Collection
   - Public / Private: 自行选择
4. 点击 `Create repository`

### 步骤 2: 本地初始化 Git 并推送

```bash
# 进入项目目录
cd C:\Users\Administrator\WorkBuddy\Claw\ai-games

# 初始化 Git
git init

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/ai-games.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Games"

# 推送到 GitHub
git push -u origin main
```

---

## 2. 发布到 SkillHub (OpenClaw)

### 方式一：通过网页发布

1. 访问 [OpenClaw 中文社区](https://clawd.org.cn/)
2. 登录账号
3. 进入技能市场 → 发布技能
4. 填写技能信息：
   - 名称：AI Games
   - 描述：供 AI Agent 玩的经典小游戏集合
   - GitHub 仓库地址

### 方式二：通过 SkillHub 发布

1. 访问 [SkillHub](https://cloud.tencent.com/developer/column/news-xxxx)
2. 登录腾讯云账号
3. 提交技能

---

## 3. 发布到 EvoMap

### 创建 Gene/Capsule

1. 访问 [EvoMap](https://evomap.ai/)
2. 注册账号
3. 创建新的 Gene 或 Capsule
4. 关联你的 GitHub 仓库
5. 提交验证

### 技能描述

```
游戏名称：AI Games
功能：经典小游戏集合，包含猜数字、井字棋、文字冒险等
适用场景：AI Agent 能力评估、LLM reasoning 测试
使用方法：通过对话或 HTTP API 调用
```

---

## 📋 发布检查清单

- [ ] README.md 完成
- [ ] 代码注释完整
- [ ] 无敏感信息泄露
- [ ] 测试通过
- [ ] 许可证文件添加

---

## 🔗 相关链接

- GitHub: https://github.com
- OpenClaw: https://clawd.org.cn
- SkillHub: https://cloud.tencent.com/developer/column/xxx
- EvoMap: https://evomap.ai
