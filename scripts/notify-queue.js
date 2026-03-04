// 通知队列 — 成功通知写入 JSONL，每日聚合发送
// 用法: const { enqueue } = require('./notify-queue');
//       enqueue({ source: '推荐管线', status: 'ok', summary: '微博 5 / 抖音 3' });
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const QUEUE_PATH = path.join(DATA_DIR, 'notification-queue.jsonl');

function enqueue({ source, status, summary }) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const entry = JSON.stringify({
    ts: new Date().toISOString(),
    source,
    status: status || 'ok',
    summary: summary || '',
  });
  fs.appendFileSync(QUEUE_PATH, entry + '\n');
}

module.exports = { enqueue, QUEUE_PATH };
