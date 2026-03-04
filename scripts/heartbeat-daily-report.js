// Heartbeat 每日巡检日报
// 用法: node scripts/heartbeat-daily-report.js
// crontab: 0 7 * * * ... node scripts/heartbeat-daily-report.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { enqueue } = require('./notify-queue');

const PROJECT_DIR = path.resolve(__dirname, '..');
const LOG_FILE = path.join(PROJECT_DIR, 'logs/heartbeat.log');

function parseLast24h() {
  if (!fs.existsSync(LOG_FILE)) return { total: 0, ok: 0, fail: 0, entries: [], fixes: [] };

  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const lines = fs.readFileSync(LOG_FILE, 'utf-8').split('\n').filter(Boolean);
  const entries = [];
  const fixes = []; // 自动修复记录
  let ok = 0, fail = 0;

  for (const line of lines) {
    const m = line.match(/^\[(.+?)\] (.+)/);
    if (!m) continue;
    const ts = new Date(m[1]).getTime();
    if (ts < cutoff) continue;

    const msg = m[2];
    if (msg === '开始巡检') {
      entries.push({ ts, status: 'pending', detail: '' });
    } else if (msg === '巡检正常') {
      if (entries.length && entries[entries.length - 1].status === 'pending') {
        entries[entries.length - 1].status = 'ok';
        ok++;
      }
    } else if (msg.startsWith('巡检失败')) {
      if (entries.length && entries[entries.length - 1].status === 'pending') {
        entries[entries.length - 1].status = 'fail';
        entries[entries.length - 1].detail = msg;
        fail++;
      }
    } else if (msg.startsWith('巡检结果:') || msg.startsWith('巡检输出:')) {
      if (entries.length) {
        entries[entries.length - 1].detail = msg.replace(/^巡检(结果|输出): ?/, '');
      }
    } else if (msg.startsWith('[孤儿清理]') || msg.startsWith('[权限告警]') || msg.startsWith('[内存告警]')) {
      fixes.push({ ts, msg });
    }
  }

  // 过滤掉 pending（日志截断的不完整记录）
  const completed = entries.filter(e => e.status !== 'pending');
  return { total: completed.length, ok, fail, entries: completed, fixes };
}

function main() {
  const report = parseLast24h();
  const { total, ok, fail } = report;

  enqueue({
    source: '健康巡检',
    status: fail > 0 ? 'error' : 'ok',
    summary: `${ok}/${total} 通过 (${total > 0 ? ((ok / total) * 100).toFixed(0) : 0}%)`,
  });

  console.log(`[${new Date().toISOString()}] 巡检结果已入队: ${total}次巡检, ${ok}正常, ${fail}异常`);
}

try {
  main();
} catch (err) {
  console.error('巡检日报失败:', err.message);
  process.exit(1);
}
