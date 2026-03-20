# 老贾的学习监控面板

> 实时学习进度监控面板 | Learning Dashboard for Lao Jia

---

## 🚀 快速启动

### 1. 安装依赖

```bash
cd ~/.openclaw/workspace/learning-dashboard
npm install
```

### 2. 启动服务

```bash
npm start
```

访问：**http://localhost:3456**

---

## 🔐 访问控制

### 默认配置
- **端口**: 3456
- **访问令牌**: laojia2026

### 自定义配置（环境变量）

```bash
# 自定义端口
export DASHBOARD_PORT=8080

# 自定义访问令牌
export DASHBOARD_TOKEN=your_secure_token

# 飞书多维表格配置
export FEISHU_APP_TOKEN=your_app_token
export FEISHU_TABLE_ID=your_table_id

npm start
```

---

## 📊 API 接口

### 健康检查
```bash
curl http://localhost:3456/api/health
```

### 获取学习数据（需要认证）
```bash
curl -H "Authorization: Bearer laojia2026" \
  http://localhost:3456/api/data
```

### 获取统计数据
```bash
curl -H "Authorization: Bearer laojia2026" \
  http://localhost:3456/api/stats
```

### 添加学习记录
```bash
curl -X POST \
  -H "Authorization: Bearer laojia2026" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "技术深度阅读",
    "content": "学习内容",
    "duration": 30,
    "output": "输出文档链接",
    "note": "备注"
  }' \
  http://localhost:3456/api/records
```

---

## 🌐 远程访问

### 方案 1：Tailscale（推荐）

```bash
# 安装 Tailscale
brew install tailscale

# 登录并启用
tailscale up

# 获取设备 IP
tailscale ip

# 访问：https://<your-device-ip>:3456
```

### 方案 2：内网穿透（ngrok）

```bash
# 安装 ngrok
brew install ngrok

# 启动穿透
ngrok http 3456

# 获取公网链接
```

### 方案 3：云服务器部署

```bash
# 部署到 VPS
scp -r ~/.openclaw/workspace/learning-dashboard user@server:~/

# 使用 PM2 管理
npm install -g pm2
pm2 start server.js --name learning-dashboard
pm2 save
```

---

## 📝 待开发功能

### Phase 1（已完成）
- ✅ 基础前端页面
- ✅ 数据统计展示
- ✅ 最近记录列表
- ✅ Token 认证

### Phase 2（进行中）
- [ ] 飞书 API 集成（自动同步多维表格）
- [ ] 自动记录学习完成情况
- [ ] 实时数据更新（WebSocket）

### Phase 3（计划）
- [ ] 学习趋势图表（Chart.js）
- [ ] 周报/月报自动生成
- [ ] 学习目标追踪
- [ ] 移动端适配优化

---

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **前端**: Vue 3 (CDN) + Tailwind CSS
- **数据源**: 飞书多维表格
- **部署**: 本地运行 / VPS / Docker（计划）

---

## 📸 预览

访问面板后可以看到：
- 📊 总学习次数、今日学习、本周学习、总耗时
- 📈 按类型统计、按状态统计
- 📝 最近学习记录表格

---

## 🔒 安全建议

1. **修改默认令牌** - 生产环境务必修改 `DASHBOARD_TOKEN`
2. **使用 HTTPS** - 远程访问时配置 SSL 证书
3. **限制访问 IP** - 通过防火墙限制访问来源
4. **定期更新** - 保持依赖包最新版本

---

*老贾 🤖 | 2026-03-20*
