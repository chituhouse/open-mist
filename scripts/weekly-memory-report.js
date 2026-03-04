// 记忆系统每周报告 - 读取 metrics.jsonl 计算统计，发送飞书群通知
// 用法: node scripts/weekly-memory-report.js
// crontab: 0 22 * * 0 (每周日 22:00)
require("dotenv").config();
const lark = require("@larksuiteoapi/node-sdk");
const { MemoryMetrics } = require("../src/memory/metrics");
const { Archive } = require("../src/archive");
const { ShortTermMemory } = require("../src/memory/short-term");

const CHAT_ID = process.env.NOTIFY_CHAT_ID;

const client = new lark.Client({
  appId: process.env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET,
});

async function generateReport() {
  const metrics = new MemoryMetrics();
  const archive = new Archive();
  const shortTerm = new ShortTermMemory();

  const m7 = metrics.summarize(7);
  const archiveStats = archive.getStats();
  const stStats = shortTerm.getStats();

  const statusEmoji = (val, good, bad) => val <= good ? "OK" : val <= bad ? "WARN" : "BAD";

  const lines = [
    "=== 记忆系统周报 ===",
    "",
    "--- 本周指标 (7天) ---",
    "对话总数: " + m7.total,
    "检索命中率: " + (m7.hitRate * 100).toFixed(0) + "% " + (m7.total > 0 ? "[" + statusEmoji(1 - m7.hitRate, 0.5, 0.8) + "]" : ""),
    "平均检索延迟: " + m7.avgRetrievalMs + "ms " + (m7.total > 0 ? "[" + statusEmoji(m7.avgRetrievalMs, 50, 200) + "]" : ""),
    "上下文效率: " + (m7.contextEfficiency * 100).toFixed(1) + "% " + (m7.total > 0 ? "[" + statusEmoji(m7.contextEfficiency * 100, 5, 15) + "]" : ""),
    "平均回复大小: " + (m7.avgResponseBytes / 1024).toFixed(1) + "KB",
    m7.avgMemoryAgeDays !== null ? "记忆新鲜度: " + m7.avgMemoryAgeDays + " 天" : "",
    "",
    "--- 存储概览 ---",
    "短期记忆: " + stStats.totalConversations + " 条对话",
    "归档天数: " + archiveStats.days,
    "归档文件: " + archiveStats.totalFiles,
    archiveStats.oldestDay ? "归档范围: " + archiveStats.oldestDay + " ~ " + archiveStats.newestDay : "",
  ].filter(l => l !== undefined).join("\n");

  return lines;
}

async function sendReport(text) {
  await client.im.message.create({
    params: { receive_id_type: "chat_id" },
    data: {
      receive_id: CHAT_ID,
      msg_type: "text",
      content: JSON.stringify({ text }),
    },
  });
}

generateReport()
  .then(async (report) => {
    console.log(report);
    await sendReport(report);
    console.log("\n[WeeklyReport] 报告已发送到飞书群");
  })
  .catch(err => {
    console.error("[WeeklyReport] 失败:", err.message);
    process.exit(1);
  });
