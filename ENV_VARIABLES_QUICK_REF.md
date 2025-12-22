# 环境变量快速参考 🚀

## Vercel 前端部署 - 环境变量设置

### 在哪里设置？
Vercel 项目 → Settings → Environment Variables

### 需要设置的 3 个变量

```env
# 1. Supabase 项目 URL
VITE_SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co

# 2. Supabase Anon Key（从 Supabase Dashboard > Settings > API 获取）
VITE_SUPABASE_ANON_KEY=你的anon/public_key（很长的JWT token，以eyJ开头）

# 3. WebSocket 服务器地址（部署后端后填写）
VITE_WS_URL=wss://你的后端服务器地址
```

### 重要提示 ⚠️

- ✅ 所有变量必须以 `VITE_` 开头
- ✅ Environment 选择：**Production + Preview + Development**（三个都选）
- ✅ 生产环境 WebSocket 必须用 `wss://`（不是 `ws://`）
- ✅ Anon Key 是一个很长的字符串（约 200+ 字符），以 `eyJ` 开头

## 后端部署 - 环境变量设置

### Railway/Render - 环境变量

```env
# 1. Supabase 项目 URL（和前端一样）
SUPABASE_URL=https://wejxhbotghxqyprdckjp.supabase.co

# 2. Supabase Service Role Key（从 Supabase Dashboard > Settings > API 获取）
SUPABASE_SERVICE_KEY=你的service_role_key（很长的JWT token，以eyJ开头）

# 3. 端口（可选，平台会自动提供）
PORT=8080
```

### 重要提示 ⚠️

- ⚠️ `SUPABASE_SERVICE_KEY` 是敏感密钥，**永远不要暴露给前端**
- ✅ Service Role Key 和 Anon Key 是不同的！
- ✅ 后端部署成功后，复制服务器URL更新前端的 `VITE_WS_URL`

## 如何获取 Supabase Keys？

### 步骤：
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧 **Settings**（齿轮图标）
4. 点击 **API**
5. 找到 **Project API keys** 部分

### 你会看到两个 Key：

```
┌─────────────────────────────────────────┐
│ anon / public                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │ ← 用于前端（VITE_SUPABASE_ANON_KEY）
│ This key is safe to use in a browser   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role                            │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...        │ ← 用于后端（SUPABASE_SERVICE_KEY）
│ This key has admin privileges           │
└─────────────────────────────────────────┘
```

## 部署流程

### 1️⃣ 部署后端（先）
- 在 Railway/Render 设置后端环境变量
- 部署后获得 WebSocket 服务器 URL
- 例如：`https://fly-production.up.railway.app`

### 2️⃣ 部署前端（后）
- 在 Vercel 设置前端环境变量
- `VITE_WS_URL` 填写：`wss://fly-production.up.railway.app`
- 注意：使用 `wss://`（安全WebSocket）

### 3️⃣ 验证
- 访问 Vercel URL
- 输入昵称开始游戏
- 检查是否能连接到服务器

## 常见错误

### ❌ "Supabase credentials not found"
**原因**：环境变量没有正确设置
**解决**：
- 检查变量名是否以 `VITE_` 开头
- 确认值已正确复制（没有多余空格）
- 重新部署项目

### ❌ "Failed to connect to game server"
**原因**：WebSocket 连接失败
**解决**：
- 确认后端已成功部署
- 检查 `VITE_WS_URL` 使用 `wss://`（不是 `ws://`）
- 确认后端服务器正在运行

### ❌ "Mixed Content" 错误
**原因**：HTTPS 页面尝试连接 WS（非安全）
**解决**：
- 将 `ws://` 改为 `wss://`
- 确保后端支持 HTTPS/WSS

## 完整示例

### Vercel 环境变量（截图示例）

```
Variable Name                    Value                                      Environments
─────────────────────────────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL                https://wejxhbotghxqyprdckjp.supabase.co  ✓ Production
                                                                            ✓ Preview
                                                                            ✓ Development

VITE_SUPABASE_ANON_KEY          eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...      ✓ Production
                                                                            ✓ Preview
                                                                            ✓ Development

VITE_WS_URL                      wss://fly-production.up.railway.app       ✓ Production
                                                                            ✓ Preview
                                                                            ✓ Development
```

## 检查清单 ✅

部署前检查：

- [ ] 已在 Supabase 运行了 `schema.sql`
- [ ] 已获取 Supabase anon key 和 service role key
- [ ] 已部署后端服务器并获得URL
- [ ] 后端环境变量已设置
- [ ] 前端环境变量已设置（包括 WebSocket URL）
- [ ] 环境变量选择了所有环境（Production, Preview, Development）
- [ ] WebSocket URL 使用 `wss://`

部署后检查：

- [ ] 前端页面能正常打开
- [ ] 能看到登录界面
- [ ] 输入昵称后能进入游戏
- [ ] 能控制飞机飞行
- [ ] 打开第二个窗口能看到其他玩家
- [ ] 击杀后排行榜更新
- [ ] Supabase 数据库有数据写入

---

完整部署指南请查看：[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
