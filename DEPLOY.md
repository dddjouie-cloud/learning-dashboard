# 🚀 小刘的监控面板 - 部署指南

## 📋 配置步骤

### 1. 飞书多维表格配置

**创建多维表格**（如果还没有）：
1. 打开飞书，创建新的多维表格
2. 添加以下字段：
   - `执行日期`（日期类型）
   - `任务类型`（文本/单选）
   - `学习内容`（文本）
   - `耗时`（数字，单位：分钟）
   - `状态`（单选：✅ 完成 / 🔄 进行中）
   - `输出文档链接`（超链接）
   - `备注`（文本）

**获取配置信息**：
1. 打开多维表格，从 URL 复制 `App Token`
   - URL 格式：`https://bytedance.feishu.cn/base/{AppToken}`
2. 点击第一个工作表，从 URL 复制 `Table ID`
   - URL 格式：`https://bytedance.feishu.cn/base/{AppToken}/{TableID}`

### 2. 飞书开放平台配置

**创建应用**：
1. 访问 https://open.feishu.cn/app
2. 创建企业应用
3. 复制 `App ID` 和 `App Secret`

**配置权限**：
在应用权限中添加：
- `bitable:app` - 访问多维表格
- `bitable:table` - 访问数据表

**发布应用**并等待审批（通常自动通过）

### 3. 环境变量配置

创建 `.env` 文件（或直接在终端设置）：

```bash
# 飞书 API 配置
FEISHU_APP_ID=cli_xxxxxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxx
FEISHU_APP_TOKEN=Z5rBbRpsTacs6GsU6FYc5WCBnTd
FEISHU_TABLE_ID=tbl7HpqG4YynzCdb

# 面板配置
DASHBOARD_PORT=3456
DASHBOARD_TOKEN=your_secure_token_here
```

### 4. 安装依赖

```bash
cd ~/.openclaw/workspace/learning-dashboard
npm install
```

### 5. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

访问：http://localhost:3456

---

## 🌐 部署选项

### 方案 1：本地运行（推荐用于测试）

直接用上面的命令在本地运行，适合个人使用。

### 方案 2：部署到 Vercel（免费，推荐）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd ~/.openclaw/workspace/learning-dashboard
vercel --prod
```

**配置环境变量**（在 Vercel 控制台）：
- FEISHU_APP_ID
- FEISHU_APP_SECRET
- FEISHU_APP_TOKEN
- FEISHU_TABLE_ID
- DASHBOARD_TOKEN

获得链接：`https://learning-dashboard-xxx.vercel.app`

### 方案 3：部署到服务器（VPS）

```bash
# 上传代码到服务器
scp -r ~/.openclaw/workspace/learning-dashboard user@your-server:/opt/

# 安装 PM2
npm install -g pm2

# 启动服务
cd /opt/learning-dashboard
npm install
pm2 start server.js --name learning-dashboard

# 开机自启
pm2 startup
pm2 save
```

**配置 Nginx 反向代理**：

```nginx
server {
    listen 80;
    server_name dashboard.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3456;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 前端配置

### 修改 API 端点

编辑 `public/index.html`，找到 `loadData()` 方法：

```javascript
async loadData() {
  try {
    // 替换为你的 API 端点
    const response = await fetch('https://your-api-url.com/api/stats', {
      headers: { 
        'Authorization': 'Bearer YOUR_TOKEN' 
      }
    });
    const data = await response.json();
    this.stats = data;
    // ...
  }
}
```

### 自定义配置

- **自动刷新间隔**：修改 `setInterval` 的毫秒数（默认 30000ms = 30 秒）
- **显示记录数**：修改 `recentRecords: records.slice(0, 10)` 中的数字
- **主题颜色**：修改 CSS 中的渐变色定义

---

## 🔧 故障排查

### 数据不更新

1. 检查飞书 App ID 和 Secret 是否正确
2. 检查多维表格 App Token 和 Table ID 是否正确
3. 查看服务器日志：`pm2 logs learning-dashboard`

### 认证失败

1. 确认 `DASHBOARD_TOKEN` 配置正确
2. 前端请求头中的 Token 要匹配

### 飞书 API 报错

常见错误码：
- `99991004` - 权限不足，检查应用权限
- `1002001` - 参数错误，检查 App Token 格式
- `1002006` - 数据表不存在，检查 Table ID

---

## 📱 移动端优化

面板已自动适配移动端：
- 卡片自动换行
- 表格横向滚动
- 触摸友好的按钮尺寸

---

## 🎨 自定义主题

编辑 `public/index.html` 中的 CSS 变量：

```css
.gradient-primary { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
}
```

可以改成你喜欢的颜色组合。

---

## 📈 后续优化建议

1. **增加导出功能** - 导出 Excel/CSV
2. **增加筛选** - 按日期、类型筛选
3. **增加图表** - 饼图、柱状图
4. **增加用户系统** - 多人使用
5. **增加推送** - 学习完成时通知

---

*小刘 🤖 | 2026-03-25 v2.0*
