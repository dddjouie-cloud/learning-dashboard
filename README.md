# 小刘的监控面板 v2.0 🤖

> 实时数据 + 现代设计 + 自动刷新

---

## ✨ 新功能

- ✅ **实时数据** - 连接飞书多维表格 API
- ✅ **自动刷新** - 每 30 秒自动更新
- ✅ **现代设计** - 渐变卡片、动画效果、响应式
- ✅ **图表可视化** - 学习趋势图
- ✅ **移动端优化** - 手机也能完美显示

---

## 🚀 快速启动

### 方式 1：一键启动（推荐）

```bash
cd ~/.openclaw/workspace/learning-dashboard
./start.sh
```

### 方式 2：手动启动

```bash
cd ~/.openclaw/workspace/learning-dashboard
npm install
npm start
```

访问：http://localhost:3456

---

## 📊 配置飞书数据（可选）

**如果不配置，会使用模拟数据演示**

### 1. 获取飞书配置

编辑 `.env` 文件：

```bash
FEISHU_APP_ID=cli_xxxxxxxxxxxxx        # 飞书应用 ID
FEISHU_APP_SECRET=xxxxxxxxxxxxxxxx     # 飞书应用密钥
FEISHU_APP_TOKEN=xxxxxxxxxxxxxxxxx     # 多维表格 App Token
FEISHU_TABLE_ID=tblxxxxxxxxxxxxx       # 数据表 ID
```

### 2. 飞书多维表格字段要求

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `执行日期` | 日期 | 学习日期 |
| `任务类型` | 文本/单选 | 如：技术深度阅读、GitHub 探索 |
| `学习内容` | 文本 | 具体内容描述 |
| `耗时` | 数字 | 分钟数 |
| `状态` | 单选 | ✅ 完成 / 🔄 进行中 |
| `输出文档链接` | 超链接 | 可选 |
| `备注` | 文本 | 可选 |

---

## 🎨 界面预览

### 统计卡片
- 📚 总学习次数
- ☀️ 今日学习
- 📅 本周学习
- ⏱️ 总耗时

### 图表
- 📈 学习趋势图（最近 7 天）
- 🎯 类型分布（带进度条）

### 数据表格
- 最近 10 条学习记录
- 支持横向滚动（移动端）

---

## 🔧 自定义

### 修改刷新间隔

编辑 `public/index.html`，找到：

```javascript
setInterval(() => {
  this.loadData();
}, 30000); // 30 秒，可改成其他毫秒数
```

### 修改主题色

编辑 `public/index.html` 中的 CSS：

```css
.gradient-primary { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
}
```

### 修改 API 端点

编辑 `public/index.html` 的 `loadData()` 方法：

```javascript
const response = await fetch('YOUR_API_URL/api/stats', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

---

## 📱 访问方式

### 本地访问
```
http://localhost:3456
```

### 局域网访问（配置服务器 IP）
```
http://YOUR_SERVER_IP:3456
```

### 部署到公网
参考 [DEPLOY.md](./DEPLOY.md) 部署到 Vercel/VPS

---

## 🎯 使用场景

### 祺哥的监控面板可以监控：

1. **学习追踪** - 每日学习内容、时长
2. **股市监控** - 持仓股票、涨跌情况
3. **项目进度** - GitHub Issue、PR 状态
4. **待办事项** - 任务完成情况

**只需要修改飞书多维表格的字段和前端展示逻辑即可！**

---

## 🐛 常见问题

**Q: 数据不更新？**
A: 检查 `.env` 中的飞书配置是否正确，或查看控制台日志

**Q: 页面空白？**
A: 打开浏览器开发者工具，查看是否有 JS 错误

**Q: 如何停止服务？**
A: 按 `Ctrl+C` 终止终端进程

---

## 📝 更新日志

**v2.0 (2026-03-25)**
- ✅ 重新设计 UI，更现代化
- ✅ 连接飞书 API，支持实时数据
- ✅ 增加趋势图表
- ✅ 自动刷新功能
- ✅ 移动端优化

**v1.0 (2026-03-20)**
- 初始版本，静态数据展示

---

*小刘 🤖 | Made with ❤️ for 祺哥*
