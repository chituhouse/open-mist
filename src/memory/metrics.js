const fs = require("fs");
const path = require("path");

const METRICS_FILE = path.join(__dirname, "..", "..", "data", "memory", "metrics.jsonl");
const METRICS_DIR = path.dirname(METRICS_FILE);

if (!fs.existsSync(METRICS_DIR)) fs.mkdirSync(METRICS_DIR, { recursive: true });

/**
 * 记忆系统指标收集器
 *
 * 6 项指标：
 * 1. retrieval_hit   - 检索命中（有记忆注入 = true）
 * 2. context_tokens  - 记忆上下文 token 估算（字符数/4）
 * 3. total_tokens    - 总 prompt token 估算
 * 4. retrieval_ms    - 检索延迟（毫秒）
 * 5. response_bytes  - 助手回复字节数
 * 6. memory_age_days - 最近使用记忆距今天数
 */
class MemoryMetrics {
  /**
   * 记录一次对话的指标
   * @param {Object} data
   */
  record(data) {
    const entry = {
      ts: new Date().toISOString(),
      chatId: data.chatId,
      sessionId: data.sessionId || null,
      retrieval_hit: !!data.retrievalHit,
      retrieval_ms: data.retrievalMs || 0,
      context_tokens: data.contextTokens || 0,
      total_tokens: data.totalTokens || 0,
      response_bytes: data.responseBytes || 0,
      memory_age_days: data.memoryAgeDays || null,
      injected_count: data.injectedCount || 0,
    };
    fs.appendFileSync(METRICS_FILE, JSON.stringify(entry) + "\n");
  }

  /**
   * 读取最近 N 天的指标
   * @param {number} days
   * @returns {Object[]}
   */
  readRecent(days) {
    if (!fs.existsSync(METRICS_FILE)) return [];

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return fs.readFileSync(METRICS_FILE, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map(line => {
        try { return JSON.parse(line); }
        catch { return null; }
      })
      .filter(e => e && new Date(e.ts).getTime() >= cutoff);
  }

  /**
   * 计算指标摘要
   * @param {number} days
   * @returns {Object}
   */
  summarize(days) {
    const entries = this.readRecent(days);
    if (entries.length === 0) {
      return {
        total: 0,
        hitRate: 0,
        avgRetrievalMs: 0,
        contextEfficiency: 0,
        avgResponseBytes: 0,
        avgMemoryAgeDays: null,
      };
    }

    const total = entries.length;
    const hits = entries.filter(e => e.retrieval_hit).length;
    const hitRate = hits / total;

    const totalContextTokens = entries.reduce((s, e) => s + (e.context_tokens || 0), 0);
    const totalAllTokens = entries.reduce((s, e) => s + (e.total_tokens || 0), 0);
    const contextEfficiency = totalAllTokens > 0 ? totalContextTokens / totalAllTokens : 0;

    const avgRetrievalMs = entries.reduce((s, e) => s + (e.retrieval_ms || 0), 0) / total;
    const avgResponseBytes = entries.reduce((s, e) => s + (e.response_bytes || 0), 0) / total;

    const ageEntries = entries.filter(e => e.memory_age_days !== null && e.memory_age_days !== undefined);
    const avgMemoryAgeDays = ageEntries.length > 0
      ? ageEntries.reduce((s, e) => s + e.memory_age_days, 0) / ageEntries.length
      : null;

    return {
      total,
      hits,
      hitRate,
      avgRetrievalMs: Math.round(avgRetrievalMs),
      contextEfficiency,
      avgResponseBytes: Math.round(avgResponseBytes),
      avgMemoryAgeDays: avgMemoryAgeDays !== null ? Math.round(avgMemoryAgeDays * 10) / 10 : null,
    };
  }
}

module.exports = { MemoryMetrics };
