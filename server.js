/**
 * 老贾的学习监控面板 - 后端服务
 * 
 * 功能：
 * 1. 从飞书多维表格同步学习记录
 * 2. 提供数据 API
 * 3. 简单 token 认证
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3456;
const ACCESS_TOKEN = process.env.DASHBOARD_TOKEN || 'laojia2026';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据缓存
let cachedData = {
  lastUpdate: null,
  records: [],
  stats: {}
};

// 飞书 API 配置（从环境变量读取）
const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN || 'Z5rBbRpsTacs6GsU6FYc5WCBnTd';
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || 'tbl7HpqG4YynzCdb';

// 飞书 API 集成
const feishuApi = require('./feishu-api');

/**
 * 获取学习记录（支持飞书 API）
 */
async function getLearningRecords() {
  const token = await feishuApi.getFeishuToken();
  return await feishuApi.getLearningRecords(FEISHU_APP_TOKEN, FEISHU_TABLE_ID, token);
}

/**
 * 计算统计数据
 */
function calculateStats(records) {
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = getWeekStart(new Date());
  
  const stats = {
    total: records.length,
    today: records.filter(r => r.date === today).length,
    thisWeek: records.filter(r => new Date(r.date) >= thisWeek).length,
    byType: {},
    byStatus: {},
    totalDuration: records.reduce((sum, r) => sum + (r.duration || 0), 0),
    recentRecords: records.slice(0, 10)
  };
  
  // 按类型统计
  records.forEach(r => {
    const type = r.type || '未分类';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });
  
  // 按状态统计
  records.forEach(r => {
    const status = r.status || '未知';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
  });
  
  return stats;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * API 路由
 */

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 获取学习数据（需要认证）
app.get('/api/data', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  try {
    const records = await getLearningRecords();
    const stats = calculateStats(records);
    
    cachedData = {
      lastUpdate: new Date().toISOString(),
      records,
      stats
    };
    
    res.json(cachedData);
  } catch (error) {
    console.error('获取数据失败:', error);
    res.status(500).json({ error: '获取数据失败：' + error.message });
  }
});

// 获取统计数据（需要认证）
app.get('/api/stats', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  try {
    const records = await getLearningRecords();
    const stats = calculateStats(records);
    res.json(stats);
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ error: '获取统计失败：' + error.message });
  }
});

// 添加学习记录（需要认证）
app.post('/api/records', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  const { type, content, duration, output, note } = req.body;
  
  // TODO: 实现写入飞书多维表格
  console.log('新增学习记录:', { type, content, duration, output, note });
  
  res.json({
    success: true,
    message: '记录已保存（演示模式）',
    data: { type, content, duration, output, note }
  });
});

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║          老贾的学习监控面板已启动                      ║
╠════════════════════════════════════════════════════════╣
║  本地访问：http://localhost:${PORT}                     ║
║  访问令牌：${ACCESS_TOKEN}                              ║
║  数据源：飞书多维表格 (${FEISHU_APP_TOKEN})             ║
╚════════════════════════════════════════════════════════╝
  `);
});
