#!/bin/bash

# 小刘的监控面板 - 快速启动脚本

echo "╔════════════════════════════════════════════════════════╗"
echo "║          小刘的监控面板 v2.0                           ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
  echo "📦 首次运行，安装依赖中..."
  npm install
  echo ""
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
  echo "⚠️  未找到 .env 文件，创建示例配置..."
  cat > .env << 'EOF'
# 飞书 API 配置（如果没有，会使用模拟数据）
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_APP_TOKEN=Z5rBbRpsTacs6GsU6FYc5WCBnTd
FEISHU_TABLE_ID=tbl7HpqG4YynzCdb

# 面板配置
DASHBOARD_PORT=3456
DASHBOARD_TOKEN=laojia2026
EOF
  echo "✅ 已创建 .env 文件，请编辑它填入你的飞书配置"
  echo ""
fi

# 启动服务
echo "🚀 启动服务..."
echo ""

npm start
