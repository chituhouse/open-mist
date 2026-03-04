#!/bin/bash
# slim-sessions.sh — 清理 Claude Code session 文件中的冗余 progress 快照
# 临时方案，等官方修复后移除。参考: github.com/anthropics/claude-code/issues/18905
#
# 原理: progress 条目中的 normalizedMessages 是实时快照，session 正常结束后不再需要。
#       删除这些字段可将文件从几百MB降到几MB，不影响 /resume 和对话历史。
#
# 用法: ./slim-sessions.sh [目录]  (默认: ~/.claude/projects)

set -euo pipefail

SESSION_DIR="${1:-$HOME/.claude/projects}"
MIN_SIZE_KB=1024  # 只处理 >1MB 的文件
TOTAL_SAVED=0

echo "[slim-sessions] Scanning: $SESSION_DIR"
echo "[slim-sessions] Only processing files > ${MIN_SIZE_KB}KB"
echo ""

find "$SESSION_DIR" -name "*.jsonl" -size +${MIN_SIZE_KB}k -type f | while read -r file; do
  original_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
  original_mb=$(echo "scale=1; $original_size / 1048576" | bc)

  # 备份
  cp "$file" "${file}.bak"

  # 用 node 处理: 删除 progress 条目中的 normalizedMessages
  node -e "
    const fs = require('fs');
    const lines = fs.readFileSync('$file', 'utf8').split('\n');
    const cleaned = lines.map(line => {
      if (!line.trim()) return line;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'progress' && obj.normalizedMessages) {
          delete obj.normalizedMessages;
        }
        return JSON.stringify(obj);
      } catch { return line; }
    });
    fs.writeFileSync('$file', cleaned.join('\n'));
  "

  new_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
  new_mb=$(echo "scale=1; $new_size / 1048576" | bc)
  saved=$(echo "scale=1; ($original_size - $new_size) / 1048576" | bc)

  if [ "$(echo "$saved > 0" | bc)" -eq 1 ]; then
    echo "[slim-sessions] $file"
    echo "  ${original_mb}MB → ${new_mb}MB (saved ${saved}MB)"
    # 清理成功，删除备份
    rm "${file}.bak"
  else
    # 没有变化，删除备份
    rm "${file}.bak"
    echo "[slim-sessions] $file — no change (${original_mb}MB)"
  fi
done

echo ""
echo "[slim-sessions] Done."
