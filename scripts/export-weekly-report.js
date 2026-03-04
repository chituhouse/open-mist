/**
 * 每周知识报告导出器
 *
 * 运行时间: 每周日 23:00
 * 输出路径: docs/digests/weekly/YYYY-WNN.md
 *
 * 用法:
 *   node scripts/export-weekly-report.js                   # 导出本周报告
 *   node scripts/export-weekly-report.js --week-offset 1   # 导出上周报告
 */

const fs = require('fs');
const path = require('path');

class WeeklyReportExporter {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data', 'memory');
    this.outputDir = path.join(__dirname, '..', 'docs', 'digests', 'weekly');
    this.dailyDir = path.join(__dirname, '..', 'docs', 'digests', 'daily');
  }

  /**
   * 加载短期记忆数据
   */
  loadShortTermMemory() {
    const filePath = path.join(this.dataDir, 'short-term.json');
    if (!fs.existsSync(filePath)) {
      console.log('[WeeklyReport] 短期记忆文件不存在');
      return { conversations: [], indices: {} };
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  /**
   * 计算周的起止日期
   */
  getWeekRange(weekOffset = 0) {
    const now = new Date();
    now.setDate(now.getDate() - weekOffset * 7);

    const dayOfWeek = now.getDay();
    // 周一为一周开始
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // ISO 周数计算
    const jan1 = new Date(startOfWeek.getFullYear(), 0, 1);
    const days = Math.floor((startOfWeek - jan1) / 86400000);
    const weekNumber = Math.ceil((days + jan1.getDay() + 1) / 7);

    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      weekNumber,
      year: startOfWeek.getFullYear(),
    };
  }

  /**
   * 获取日期范围内的对话
   */
  getConversationsInRange(memory, startDate, endDate) {
    const dateIndex = memory.index?.byDate || memory.indices?.byDate || {};
    const conversations = [];

    // 遍历日期范围
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const ids = dateIndex[dateStr] || [];

      ids.forEach(id => {
        const conv = memory.conversations.find(c => c.conversationId === id);
        if (conv) {
          conversations.push(conv);
        }
      });
    }

    return conversations;
  }

  /**
   * 汇总周统计数据
   */
  aggregateWeeklyStats(conversations) {
    let totalMessages = 0;
    let highImportance = 0;
    const filesModified = new Set();
    const toolsUsed = new Set();

    for (const conv of conversations) {
      totalMessages += conv.messageCount || 0;
      if ((conv.importance || 5) >= 7) highImportance++;
      (conv.context?.filesModified || []).forEach(f => filesModified.add(f));
      (conv.context?.toolsUsed || []).forEach(t => toolsUsed.add(t));
    }

    return {
      conversationCount: conversations.length,
      totalMessages,
      highImportance,
      filesModified: filesModified.size,
      toolsUsed: [...toolsUsed],
    };
  }

  /**
   * 按日期分组对话
   */
  groupByDate(conversations) {
    const groups = {};
    for (const conv of conversations) {
      const date = conv.endTime?.split('T')[0] ||
                   conv.startTime?.split('T')[0] ||
                   'unknown';
      if (!groups[date]) groups[date] = [];
      groups[date].push(conv);
    }
    return groups;
  }

  /**
   * 提取热门话题（按标签统计）
   */
  extractHotTopics(conversations) {
    const tagCount = {};
    for (const conv of conversations) {
      for (const tag of (conv.tags || [])) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }

    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  /**
   * 提取关键决策
   */
  extractKeyDecisions(conversations) {
    const decisions = [];

    for (const conv of conversations) {
      const date = conv.endTime?.split('T')[0] ||
                   conv.startTime?.split('T')[0];

      for (const decision of (conv.summary?.keyDecisions || [])) {
        decisions.push({
          date,
          decision,
          entities: conv.summary?.entities || [],
        });
      }
    }

    return decisions.slice(0, 15);
  }

  /**
   * 提取本周出现的实体
   */
  extractEntities(conversations) {
    const entityMap = new Map();

    for (const conv of conversations) {
      const date = conv.endTime?.split('T')[0] ||
                   conv.startTime?.split('T')[0];

      for (const entity of (conv.summary?.entities || [])) {
        if (!entityMap.has(entity)) {
          entityMap.set(entity, {
            name: entity,
            firstMentioned: date,
            count: 0,
          });
        }
        entityMap.get(entity).count++;
      }
    }

    return [...entityMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  /**
   * 生成 Markdown 内容
   */
  generateMarkdown(data) {
    const {
      year, weekNumber, startDate, endDate,
      stats, hotTopics, keyDecisions, entities, dailyGroups
    } = data;

    const now = new Date().toISOString().replace('T', ' ').split('.')[0];

    let md = `# Jarvis 周报 - ${year} 第 ${weekNumber} 周\n\n`;
    md += `> 周期: ${startDate} ~ ${endDate}\n`;
    md += `> 生成于: ${now}\n\n`;

    // 周统计
    md += `## 📈 周统计\n\n`;
    md += `| 指标 | 数值 |\n|------|------|\n`;
    md += `| 对话数量 | ${stats.conversationCount} |\n`;
    md += `| 消息总数 | ${stats.totalMessages} |\n`;
    md += `| 高重要性对话 (≥7) | ${stats.highImportance} |\n`;
    md += `| 修改文件数 | ${stats.filesModified} |\n`;
    md += `| 使用工具数 | ${stats.toolsUsed.length} |\n\n`;

    // 热门话题
    if (hotTopics.length > 0) {
      md += `## 🔥 本周热门话题\n\n`;
      hotTopics.forEach(([topic, count], idx) => {
        md += `${idx + 1}. **${topic}** - 出现 ${count} 次\n`;
      });
      md += '\n';
    }

    // 关键决策
    if (keyDecisions.length > 0) {
      md += `## 💡 本周关键决策\n\n`;
      md += `| 日期 | 决策 | 相关实体 |\n|------|------|----------|\n`;
      keyDecisions.forEach(d => {
        const entitiesStr = d.entities.slice(0, 3).join(', ') || '-';
        md += `| ${d.date} | ${d.decision} | ${entitiesStr} |\n`;
      });
      md += '\n';
    }

    // 知识实体
    if (entities.length > 0) {
      md += `## 🧠 知识实体\n\n`;
      md += `| 实体 | 首次提及 | 出现次数 |\n|------|----------|----------|\n`;
      entities.forEach(e => {
        md += `| ${e.name} | ${e.firstMentioned} | ${e.count} |\n`;
      });
      md += '\n';
    }

    // 每日摘要链接
    const dates = Object.keys(dailyGroups).sort();
    if (dates.length > 0) {
      md += `## 📚 每日摘要链接\n\n`;
      dates.forEach(date => {
        const dailyFile = path.join(this.dailyDir, `${date}.md`);
        if (fs.existsSync(dailyFile)) {
          md += `- [${date}](../daily/${date}.md) (${dailyGroups[date].length} 对话)\n`;
        } else {
          md += `- ${date} (${dailyGroups[date].length} 对话)\n`;
        }
      });
      md += '\n';
    }

    // 工具使用明细
    if (stats.toolsUsed.length > 0) {
      md += `## 🛠️ 使用工具\n\n`;
      md += stats.toolsUsed.map(t => `- ${t}`).join('\n');
      md += '\n\n';
    }

    md += `---\n*生成自 Jarvis 记忆系统 v1.1*\n`;

    return md;
  }

  /**
   * 确保目录存在
   */
  ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * 导出周报告
   */
  async export(weekOffset = 0) {
    const { startDate, endDate, weekNumber, year } = this.getWeekRange(weekOffset);
    const weekStr = `${year}-W${String(weekNumber).padStart(2, '0')}`;

    console.log(`[WeeklyReport] 开始导出 ${weekStr} (${startDate} ~ ${endDate}) 的报告...`);

    // 1. 加载短期记忆
    const memory = this.loadShortTermMemory();

    // 2. 获取该周所有对话
    const conversations = this.getConversationsInRange(memory, startDate, endDate);

    if (conversations.length === 0) {
      console.log(`[WeeklyReport] ${weekStr} 无对话记录，跳过`);
      return null;
    }

    console.log(`[WeeklyReport] 找到 ${conversations.length} 个对话`);

    // 3. 汇总统计
    const stats = this.aggregateWeeklyStats(conversations);

    // 4. 按日期分组
    const dailyGroups = this.groupByDate(conversations);

    // 5. 提取热门话题
    const hotTopics = this.extractHotTopics(conversations);

    // 6. 提取关键决策
    const keyDecisions = this.extractKeyDecisions(conversations);

    // 7. 提取实体
    const entities = this.extractEntities(conversations);

    // 8. 生成 Markdown
    const markdown = this.generateMarkdown({
      year, weekNumber, startDate, endDate,
      stats, hotTopics, keyDecisions, entities, dailyGroups
    });

    // 9. 写入文件
    this.ensureDir(this.outputDir);
    const outputPath = path.join(this.outputDir, `${weekStr}.md`);
    fs.writeFileSync(outputPath, markdown);

    console.log(`[WeeklyReport] ✓ 导出完成: ${outputPath}`);
    return outputPath;
  }
}

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  let weekOffset = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--week-offset' && args[i + 1]) {
      weekOffset = parseInt(args[i + 1], 10);
      if (isNaN(weekOffset) || weekOffset < 0) {
        console.error('[WeeklyReport] 错误: week-offset 应为非负整数');
        process.exit(1);
      }
    }
  }

  return { weekOffset };
}

// 主入口
if (require.main === module) {
  const { weekOffset } = parseArgs();
  const exporter = new WeeklyReportExporter();

  exporter.export(weekOffset)
    .then(result => {
      if (result) {
        console.log('[WeeklyReport] 任务完成');
      } else {
        console.log('[WeeklyReport] 无数据需要导出');
      }
    })
    .catch(err => {
      console.error('[WeeklyReport] 错误:', err);
      process.exit(1);
    });
}

module.exports = { WeeklyReportExporter };
