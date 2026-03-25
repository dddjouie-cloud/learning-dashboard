/**
 * 小刘的监控面板 - 后端服务 v2
 * 
 * 功能：
 * 1. 从飞书多维表格同步学习记录
 * 2. 提供实时数据 API
 * 3. Token 认证
 * 4. 数据缓存
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3456;
const ACCESS_TOKEN = process.env.DASHBOARD_TOKEN || 'laojia2026';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 飞书 API 配置
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_APP_TOKEN = process.env.FEISHU_APP_TOKEN || 'Z5rBbRpsTacs6GsU6FYc5WCBnTd';
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || 'tbl7HpqG4YynzCdb';

// 数据缓存
let cachedData = {
  lastUpdate: null,
  records: [],
  stats: {}
};

/**
 * 获取飞书访问令牌
 */
async function getFeishuToken() {
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    console.warn('⚠️ 未配置 FEISHU_APP_ID 或 FEISHU_APP_SECRET');
    return null;
  }
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        app_id: FEISHU_APP_ID, 
        app_secret: FEISHU_APP_SECRET 
      })
    });
    
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    return data.tenant_access_token;
  } catch (error) {
    console.error('获取飞书令牌失败:', error.message);
    return null;
  }
}

/**
 * 从飞书多维表格获取记录
 */
async function getLearningRecords(token) {
  if (!token) {
    return getMockRecords();
  }
  
  try {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    
    return data.data.items.map(item => ({
      id: item.record_id,
      date: formatTimestamp(item.fields['执行日期']),
      type: item.fields['任务类型'] || '未分类',
      content: item.fields['学习内容'] || '',
      duration: parseInt(item.fields['耗时'] || 0),
      status: item.fields['状态'] || '未知',
      output: item.fields['输出文档链接'] || '',
      note: item.fields['备注'] || ''
    }));
  } catch (error) {
    console.error('获取飞书数据失败:', error.message);
    return getMockRecords();
  }
}

/**
 * 计算统计数据
 */
function calculateStats(records) {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart(new Date());
  
  const stats = {
    total: records.length,
    today: records.filter(r => r.date === today).length,
    thisWeek: records.filter(r => new Date(r.date) >= weekStart).length,
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

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

function getMockRecords() {
  return [
    {
      id: '1',
      date: '2026-03-25',
      type: '技术深度阅读',
      content: 'OpenClaw 能力分析报告',
      duration: 45,
      status: '✅ 完成'
    },
    {
      id: '2',
      date: '2026-03-25',
      type: '投资知识',
      content: 'A 股市场分析与 LPR 政策解读',
      duration: 30,
      status: '✅ 完成'
    },
    {
      id: '3',
      date: '2026-03-24',
      type: 'GitHub 探索',
      content: 'AI Agent 框架调研',
      duration: 60,
      status: '✅ 完成'
    }
  ];
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

// 获取统计数据
app.get('/api/stats', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  try {
    const feishuToken = await getFeishuToken();
    const records = await getLearningRecords(feishuToken);
    const stats = calculateStats(records);
    
    cachedData = {
      lastUpdate: new Date().toISOString(),
      records,
      stats
    };
    
    res.json(stats);
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({ error: '获取数据失败：' + error.message });
  }
});

// 获取完整数据
app.get('/api/data', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  try {
    const feishuToken = await getFeishuToken();
    const records = await getLearningRecords(feishuToken);
    const stats = calculateStats(records);
    
    res.json({
      lastUpdate: new Date().toISOString(),
      records,
      stats
    });
  } catch (error) {
    console.error('获取数据失败:', error);
    res.status(500).json({ error: '获取数据失败：' + error.message });
  }
});

// 添加学习记录
app.post('/api/records', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: '认证失败' });
  }
  
  const { type, content, duration, output, note } = req.body;
  
  try {
    const feishuToken = await getFeishuToken();
    
    if (!feishuToken) {
      return res.json({
        success: true,
        message: '记录已保存（演示模式）',
        data: { type, content, duration, output, note }
      });
    }
    
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_APP_TOKEN}/tables/${FEISHU_TABLE_ID}/records`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${feishuToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          '执行日期': Date.now(),
          '任务类型': type,
          '学习内容': content,
          '耗时': duration,
          '状态': '✅ 完成',
          '输出文档链接': output || '',
          '备注': note || ''
        }
      })
    });
    
    const data = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    
    res.json({
      success: true,
      message: '记录已保存',
      data: { id: data.data.record_id, ...req.body }
    });
  } catch (error) {
    console.error('添加记录失败:', error);
    res.status(500).json({ error: '保存失败：' + error.message });
  }
});

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务（监听所有网卡，支持远程访问）
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║          小刘的监控面板 v2.0 已启动                    ║
╠════════════════════════════════════════════════════════╣
║  🌐 本地访问：http://localhost:${PORT}                   ║
║  🌍 远程访问：http://YOUR_IP:${PORT}                     ║
║  🔑 访问令牌：${ACCESS_TOKEN}                            ║
║  📊 数据源：飞书多维表格                                 ║
║     AppToken: ${FEISHU_APP_TOKEN}                       ║
╚════════════════════════════════════════════════════════╝

提示：
- API 调用需要 Authorization 头：Bearer ${ACCESS_TOKEN}
- 远程访问需要在防火墙开放 ${PORT} 端口
  `);
});
