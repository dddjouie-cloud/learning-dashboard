/**
 * 飞书 API 集成模块
 * 用于从多维表格同步学习记录
 */

const fetch = require('node-fetch');

// 飞书 API 配置
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis/bitable/v1';

/**
 * 获取飞书访问令牌
 * 需要通过飞书开放平台创建应用获取 App ID 和 App Secret
 */
async function getFeishuToken() {
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  
  if (!appId || !appSecret) {
    console.warn('⚠️  未配置 FEISHU_APP_ID 或 FEISHU_APP_SECRET，使用模拟数据');
    return null;
  }
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret })
    });
    
    const data = await response.json();
    return data.tenant_access_token;
  } catch (error) {
    console.error('获取飞书令牌失败:', error.message);
    return null;
  }
}

/**
 * 从飞书多维表格获取记录
 */
async function getLearningRecords(appToken, tableId, token) {
  if (!token) {
    // 返回模拟数据
    return getMockRecords();
  }
  
  try {
    const url = `${FEISHU_API_BASE}/apps/${appToken}/tables/${tableId}/records`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    
    return data.data.items.map(item => ({
      id: item.record_id,
      date: formatDate(item.fields['执行日期']),
      type: item.fields['任务类型'] || '未分类',
      content: item.fields['学习内容'] || '',
      duration: item.fields['耗时'] || 0,
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
 * 向飞书多维表格添加记录
 */
async function addLearningRecord(appToken, tableId, token, record) {
  if (!token) {
    console.log('📝 新增记录（模拟）:', record);
    return { success: true, id: 'mock_' + Date.now() };
  }
  
  try {
    const url = `${FEISHU_API_BASE}/apps/${appToken}/tables/${tableId}/records`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          '执行日期': Date.now(),
          '任务类型': record.type,
          '学习内容': record.content,
          '耗时': record.duration,
          '状态': record.status || '✅ 完成',
          '输出文档链接': record.output,
          '备注': record.note
        }
      })
    });
    
    const data = await response.json();
    return { success: true, id: data.data.record_id };
  } catch (error) {
    console.error('添加记录失败:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 模拟数据（用于演示）
 */
function getMockRecords() {
  return [
    {
      id: '1',
      date: '2026-03-20',
      type: '技术深度阅读',
      content: 'Karpathy Autoresearch + Paperclip',
      duration: 30,
      status: '✅ 完成',
      output: '2 篇知识库文档',
      note: 'AI 自主科研系统 (43.9k⭐) + 零人工公司编排'
    },
    {
      id: '2',
      date: '2026-03-20',
      type: 'GitHub 探索',
      content: 'GitHub Trending 项目调研',
      duration: 15,
      status: '✅ 完成',
      output: '项目测评文档',
      note: '探索最新 AI/ML 项目'
    },
    {
      id: '3',
      date: '2026-03-19',
      type: '投资知识',
      content: 'A 股市场分析与 LPR 政策解读',
      duration: 20,
      status: '✅ 完成',
      output: '投资笔记',
      note: '每日财经新闻学习'
    }
  ];
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

module.exports = {
  getFeishuToken,
  getLearningRecords,
  addLearningRecord,
  getMockRecords
};
