# 🚀 部署到 GitHub Pages（推荐）

## 方案 1：GitHub Pages（最简单）

### 步骤

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 上创建新仓库：learning-dashboard
   # 然后执行：
   cd ~/.openclaw/workspace/learning-dashboard
   git remote add origin https://github.com/YOUR_USERNAME/learning-dashboard.git
   git branch -M main
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `main` 分支 → `/root` 文件夹
   - Save

3. **访问链接**
   ```
   https://YOUR_USERNAME.github.io/learning-dashboard/static.html
   ```

---

## 方案 2：Netlify Drop（无需配置）

### 步骤

1. 访问 https://app.netlify.com/drop
2. 拖拽 `public` 文件夹到上传区域
3. 获得永久链接（如：https://laojia-learning.netlify.app）

---

## 方案 3：Vercel（推荐用于生产）

### 步骤

```bash
cd ~/.openclaw/workspace/learning-dashboard
npm install -g vercel
vercel login
vercel --prod
```

获得链接：https://learning-dashboard-xxx.vercel.app

---

## 📊 静态页面特点

- ✅ **无需服务器** — 纯静态 HTML
- ✅ **永久链接** — 不会过期
- ✅ **免费托管** — GitHub/Netlify/Vercel 都免费
- ✅ **自动刷新** — 页面每 5 分钟自动刷新
- ⚠️ **数据固定** — 需要重新部署更新数据

---

## 🔧 数据更新

### 手动更新
```bash
# 修改 static.html 中的 stats 数据
git add -A
git commit -m "Update learning stats"
git push
```

### 自动更新（后续开发）
- GitHub Actions 定时同步飞书数据
- Webhook 触发自动部署

---

*老贾 🤖 | 2026-03-20*
