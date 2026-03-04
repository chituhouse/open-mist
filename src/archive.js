const fs = require("fs");
const path = require("path");

const ARCHIVE_DIR = path.join(__dirname, "..", "data", "archive");

// 确保归档目录存在
if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

/**
 * 对话归档层 - 完整对话记录，JSONL 格式，永不删除
 *
 * 存储路径：data/archive/YYYY-MM-DD/chatId.jsonl
 * 每行一条 JSON 记录
 */
class Archive {
  /**
   * 追加一条消息到归档
   * @param {Object} entry
   * @param {string} entry.chatId - 飞书 chat ID
   * @param {string} entry.role - user / assistant
   * @param {string} entry.content - 消息内容
   * @param {string} [entry.sessionId] - Claude session ID
   * @param {string[]} [entry.toolsUsed] - 使用的工具
   * @param {string[]} [entry.mediaFiles] - 媒体文件路径
   */
  append(entry) {
    const now = new Date();
    const dateDir = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const dir = path.join(ARCHIVE_DIR, dateDir);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${entry.chatId}.jsonl`);
    const record = {
      ts: now.toISOString(),
      role: entry.role,
      content: entry.content,
      sessionId: entry.sessionId || null,
      toolsUsed: entry.toolsUsed || [],
      mediaFiles: entry.mediaFiles || [],
    };

    fs.appendFileSync(filePath, JSON.stringify(record) + "\n");
  }

  /**
   * 写入会话结束标记
   * @param {string} chatId
   * @param {string} sessionId
   */
  markSessionEnd(chatId, sessionId) {
    const now = new Date();
    const dateDir = now.toISOString().split("T")[0];
    const dir = path.join(ARCHIVE_DIR, dateDir);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${chatId}.jsonl`);
    const record = {
      ts: now.toISOString(),
      role: "system",
      content: "session_end",
      sessionId: sessionId,
    };

    fs.appendFileSync(filePath, JSON.stringify(record) + "\n");
  }

  /**
   * 读取某天某个 chat 的归档
   * @param {string} date - YYYY-MM-DD
   * @param {string} chatId
   * @returns {Object[]}
   */
  read(date, chatId) {
    const filePath = path.join(ARCHIVE_DIR, date, `${chatId}.jsonl`);
    if (!fs.existsSync(filePath)) return [];

    return fs.readFileSync(filePath, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map(line => {
        try { return JSON.parse(line); }
        catch { return null; }
      })
      .filter(Boolean);
  }

  /**
   * 获取归档统计
   * @returns {Object}
   */
  getStats() {
    if (!fs.existsSync(ARCHIVE_DIR)) return { days: 0, totalFiles: 0 };

    const days = fs.readdirSync(ARCHIVE_DIR).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
    let totalFiles = 0;
    for (const day of days) {
      const dayDir = path.join(ARCHIVE_DIR, day);
      totalFiles += fs.readdirSync(dayDir).filter(f => f.endsWith(".jsonl")).length;
    }

    return {
      days: days.length,
      totalFiles,
      oldestDay: days.sort()[0] || null,
      newestDay: days.sort().pop() || null,
    };
  }
}

module.exports = { Archive };
