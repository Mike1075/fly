# Vercel 部署指南

## 部署前准备

### 1. 确保你有以下信息

从Supabase获取（Settings > API）：
- ✅ Project URL: `https://wejxhbotghxqyprdckjp.supabase.co`
- ✅ Anon/Public Key（一个很长的JWT token）
- ✅ Service Role Key（后端用，暂时不用于前端部署）

从后端服务器获取：
- ⚠️ WebSocket服务器URL（稍后配置）

## 步骤 1: 部署到 Vercel

### 方法 A: 通过 GitHub（推荐）

1. **访问 Vercel**
   - 打开 [https://vercel.com](https://vercel.com)
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "Add New..." > "Project"
   - 选择 GitHub 仓库：`Mike1075/fly`
   - 点击 "Import"

3. **项目配置**
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **暂时不要点击 Deploy**，先配置环境变量（见步骤2）

### 方法 B: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目目录下运行
vercel

# 按照提示操作
```

## 步骤 2: 配置环境变量 ⚠️ 重要

在 Vercel 项目设置页面：

### 位置
1. 进入你的项目
2. 点击顶部菜单 "Settings"
3. 左侧菜单选择 "Environment Variables"

### 需要添加的环境变量

#### 必需的环境变量（Production）

**变量 1: VITE_SUPABASE_URL**
```
Key:   VITE_SUPABASE_URL
Value: https://wejxhbotghxqyprdckjp.supabase.co
Environment: Production, Preview, Development (全选)
```

**变量 2: VITE_SUPABASE_ANON_KEY**
```
Key:   VITE_SUPABASE_ANON_KEY
Value: eyJhbGci... (你的 anon/public key，很长的JWT token)
Environment: Production, Preview, Development (全选)
```

**变量 3: VITE_WS_URL**
```
Key:   VITE_WS_URL
Value: wss://your-backend-url.com (见下方后端部署说明)
Environment: Production, Preview, Development (全选)
```

⚠️ **注意**：
- 环境变量名必须以 `VITE_` 开头（Vite要求）
- 所有环境变量都要在三个环境（Production, Preview, Development）中设置
- WebSocket URL 在生产环境必须使用 `wss://`（安全WebSocket）

### 如何获取 VITE_SUPABASE_ANON_KEY

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧 Settings（齿轮图标）
4. 点击 API
5. 找到 "Project API keys" 部分
6. 复制 **anon / public** 下面的长字符串（以 `eyJ` 开头）

### 截图示例

Vercel环境变量配置应该看起来像这样：

```
┌────────────────────────┬──────────────────────────────────┬─────────────────────────┐
│ Key                    │ Value                            │ Environments            │
├────────────────────────┼──────────────────────────────────┼─────────────────────────┤
│ VITE_SUPABASE_URL      │ https://wejxhbotgh...supabase.co │ Production, Preview, Dev│
│ VITE_SUPABASE_ANON_KEY │ eyJhbGciOiJIUzI1NiIsI...        │ Production, Preview, Dev│
│ VITE_WS_URL            │ wss://your-backend.railway.app   │ Production, Preview, Dev│
└────────────────────────┴──────────────────────────────────┴─────────────────────────┘
```

## 步骤 3: 部署前端

1. 确保所有环境变量都已添加
2. 点击 "Deploy" 按钮
3. 等待构建完成（约1-2分钟）
4. 部署成功后，你会得到一个URL，例如：`https://fly-xxxx.vercel.app`

## 步骤 4: 部署后端 WebSocket 服务器

### 选项 A: Railway（推荐）

1. **访问 Railway**
   - 打开 [https://railway.app](https://railway.app)
   - 使用GitHub登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择 `Mike1075/fly` 仓库

3. **配置服务**
   - 点击创建的服务
   - 点击 "Settings"
   - 在 "Root Directory" 设置为：`server`
   - 在 "Start Command" 设置为：`npm start`

4. **添加环境变量**

   在 "Variables" 标签页添加：

   ```
   SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co
   SUPABASE_SERVICE_KEY=你的service_role_key（从Supabase获取）
   PORT=8080
   ```

5. **获取部署URL**
   - 部署完成后，Railway会提供一个URL
   - 例如：`https://fly-production.up.railway.app`
   - 这就是你的WebSocket服务器地址

6. **更新前端环境变量**
   - 回到Vercel
   - 更新 `VITE_WS_URL` 为：`wss://fly-production.up.railway.app`
   - ⚠️ 注意：使用 `wss://`（不是 `ws://`）
   - 点击右上角的三个点 > "Redeploy"

### 选项 B: Render

1. **访问 Render**
   - 打开 [https://render.com](https://render.com)
   - 使用GitHub登录

2. **创建 Web Service**
   - 点击 "New +" > "Web Service"
   - 连接 GitHub 仓库
   - 选择 `Mike1075/fly`

3. **配置**
   ```
   Name: fly-websocket-server
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **添加环境变量**
   ```
   SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co
   SUPABASE_SERVICE_KEY=你的service_role_key
   ```
   （PORT会由Render自动提供）

5. **部署并获取URL**
   - 部署完成后获取URL（例如：`https://fly-websocket.onrender.com`）
   - 更新Vercel的 `VITE_WS_URL` 为：`wss://fly-websocket.onrender.com`

## 步骤 5: 验证部署

### 检查清单

1. **前端部署成功**
   - ✅ 访问 Vercel URL，看到登录界面
   - ✅ 浏览器控制台没有错误

2. **后端部署成功**
   - ✅ Railway/Render 显示服务运行中
   - ✅ 日志显示 "Game server started!"

3. **连接测试**
   - ✅ 输入昵称并点击 "Start Flying"
   - ✅ 成功进入游戏
   - ✅ 可以控制飞机飞行
   - ✅ 打开第二个窗口能看到其他玩家

4. **数据库连接**
   - ✅ 击杀玩家后，Supabase leaderboard表有数据更新

## 常见问题

### Q1: 部署后看到 "Failed to connect to game server"

**解决方案：**
1. 检查后端是否正常运行（Railway/Render控制台）
2. 确认 `VITE_WS_URL` 使用的是 `wss://`（不是 `ws://`）
3. 检查后端日志是否有错误
4. 确保后端的8080端口暴露（Railway/Render会自动处理）

### Q2: 前端部署成功但是白屏

**解决方案：**
1. 打开浏览器控制台（F12）查看错误
2. 检查环境变量是否正确设置
3. 确保所有环境变量都以 `VITE_` 开头
4. 重新部署项目

### Q3: Supabase 连接失败

**解决方案：**
1. 确认 `VITE_SUPABASE_ANON_KEY` 是正确的（很长的JWT token）
2. 检查 Supabase 项目是否已暂停（免费版可能会暂停）
3. 确认数据库 schema 已经执行（运行了 `schema.sql`）

### Q4: WebSocket 连接在本地可以但部署后不行

**解决方案：**
1. 生产环境必须使用 `wss://`（不是 `ws://`）
2. 确保后端支持 WebSocket 升级（Railway/Render 默认支持）
3. 检查防火墙和安全组设置

## 环境变量完整列表

### 前端（Vercel）

| 变量名 | 示例值 | 必需 | 说明 |
|--------|--------|------|------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ | Supabase项目URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | ✅ | Supabase公钥（长JWT） |
| `VITE_WS_URL` | `wss://your-backend.com` | ✅ | WebSocket服务器地址 |

### 后端（Railway/Render）

| 变量名 | 示例值 | 必需 | 说明 |
|--------|--------|------|------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | ✅ | Supabase项目URL |
| `SUPABASE_SERVICE_KEY` | `eyJhbGci...` | ✅ | Supabase服务端密钥 |
| `PORT` | `8080` | ❌ | 端口（平台自动提供） |

## 部署后优化

### 1. 自定义域名

在 Vercel：
1. Settings > Domains
2. 添加你的域名
3. 按照提示配置DNS

### 2. 设置CORS（如果需要）

如果前端和后端在不同域名，需要在后端添加CORS配置。

在 `server/src/server.js` 中添加（已包含在代码中）。

### 3. 启用 HTTPS

- Vercel 自动提供 HTTPS
- Railway/Render 也自动提供 HTTPS
- 确保 WebSocket 使用 `wss://`

## 成本估算

### 免费部署方案

- **Vercel**: 免费层（100GB带宽/月）
- **Railway**: 免费层（$5额度/月，约500小时运行时间）
- **Supabase**: 免费层（500MB数据库，无限API请求）

**总成本：$0/月**（在免费额度内）

### 升级方案

如果流量增大：
- **Vercel Pro**: $20/月（无限带宽）
- **Railway**: 按使用量计费（约$5-20/月）
- **Supabase Pro**: $25/月（8GB数据库）

## 监控和日志

### Vercel 日志
1. 进入项目
2. 点击 "Deployments"
3. 点击具体部署查看日志

### Railway 日志
1. 进入服务
2. 点击 "Logs" 标签
3. 实时查看服务器日志

### Supabase 日志
1. 进入项目
2. 点击 "Logs"
3. 查看数据库查询和错误

## 下一步

部署成功后：

1. ✅ 测试所有功能
2. ✅ 邀请朋友一起玩
3. ✅ 监控性能和错误
4. ✅ 根据需要调整服务器配置
5. ✅ 考虑添加更多功能（参考 README.md 的 Roadmap）

---

**部署愉快！** 🚀

如有问题，请检查：
- Vercel 部署日志
- Railway/Render 服务器日志
- 浏览器控制台错误
- Supabase 数据库日志
