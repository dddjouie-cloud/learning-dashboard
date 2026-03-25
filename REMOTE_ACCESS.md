# 🌐 远程访问指南

## ✅ 当前状态

- ✅ **服务已启动** - 运行在 3456 端口
- ✅ **监听所有网卡** - 支持远程访问
- ✅ **飞书 API 已配置** - 使用你的飞书应用凭证
- ✅ **访问令牌** - `laojia2026`

---

## 📱 远程访问方式

### 方式 1：同一 WiFi 网络（推荐）

**在你的 Mac 上查看本机 IP**：
```bash
# 在 Mac 终端运行
ipconfig getifaddr en0
```

**在手机上访问**：
```
http://<你的 Mac IP>:3456
```

例如：`http://192.168.1.100:3456`

### 方式 2：公司网络内

如果 Mac 在公司网络，手机也在同一网络：
```
http://<Mac 内网 IP>:3456
```

### 方式 3：公网访问（需要配置）

**如果 Mac 有公网 IP**：
1. 在路由器配置端口转发：3456 → Mac 内网 IP
2. 访问：`http://<公网 IP>:3456`

**如果没有公网 IP**（推荐用这个）：
```bash
# 安装 ngrok
brew install ngrok

# 启动内网穿透
ngrok http 3456
```

会获得一个公网链接，如：`https://xxx.ngrok.io`

---

## 🔐 访问认证

API 调用需要在请求头添加：
```
Authorization: Bearer laojia2026
```

前端页面已经自动配置，直接用浏览器访问即可。

---

## 📊 飞书多维表格配置

**当前配置**：
- App ID: `cli_a9314e2099391cc9`
- App Secret: `D41Y2P22RLBV3wSNeVBdkcAW3XTxLA5a`
- App Token: `Z5rBbRpsTacs6GsU6FYc5WCBnTd`（示例）
- Table ID: `tbl7HpqG4YynzCdb`（示例）

**如果要连接真实的多维表格**：
1. 在飞书创建多维表格
2. 添加字段（执行日期、任务类型、学习内容、耗时、状态）
3. 从 URL 复制 App Token 和 Table ID
4. 编辑 `.env` 文件更新配置

---

## 🔧 防火墙配置

**如果远程访问不了**，可能需要开放防火墙：

```bash
# macOS 系统偏好设置 → 安全性与隐私 → 防火墙
# 添加 Node.js 或允许 3456 端口
```

或者临时关闭防火墙测试。

---

## 📝 快速测试

**在浏览器访问**：
```
http://localhost:3456
```

**检查 API**：
```bash
curl -H "Authorization: Bearer laojia2026" http://localhost:3456/api/stats
```

---

## 🎯 祺哥，你现在可以：

1. **在公司用手机访问** - 确保手机和 Mac 同一网络
2. **回家继续访问** - 只要 Mac 开机运行
3. **配置真实数据** - 创建飞书多维表格

**需要我帮你做什么**：
- 创建飞书多维表格？
- 配置 ngrok 公网访问？
- 改成股市监控面板？

随时吩咐！🤖
