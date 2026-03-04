#!/usr/bin/env node
// slim-sessions.mjs — 清理 Claude Code session 文件中的冗余 progress 快照
// 临时方案，等官方修复 #18905 后移除
//
// 原理: progress 条目的 normalizedMessages 是实时快照，正常结束后不再需要
// 用法: node slim-sessions.mjs [目录]  (默认: ~/.claude/projects)

import { readdirSync, statSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const sessionDir = process.argv[2] || join(homedir(), '.claude', 'projects');
const MIN_SIZE = 1024 * 1024; // 1MB

function findJsonl(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findJsonl(full));
      } else if (entry.name.endsWith('.jsonl')) {
        const size = statSync(full).size;
        if (size > MIN_SIZE) results.push({ path: full, size });
      }
    }
  } catch {}
  return results;
}

function formatMB(bytes) {
  return (bytes / 1048576).toFixed(1) + 'MB';
}

console.log(`[slim-sessions] Scanning: ${sessionDir}`);
console.log(`[slim-sessions] Only processing files > 1MB\n`);

const files = findJsonl(sessionDir);

if (files.length === 0) {
  console.log('[slim-sessions] No large session files found.');
  process.exit(0);
}

let totalSaved = 0;

for (const { path: filePath, size: originalSize } of files) {
  // 备份
  const bakPath = filePath + '.bak';
  copyFileSync(filePath, bakPath);

  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let changed = false;

    const cleaned = lines.map(line => {
      if (!line.trim()) return line;
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'progress' && obj.normalizedMessages) {
          delete obj.normalizedMessages;
          changed = true;
        }
        return changed ? JSON.stringify(obj) : line;
      } catch { return line; }
    });

    if (changed) {
      writeFileSync(filePath, cleaned.join('\n'));
      const newSize = statSync(filePath).size;
      const saved = originalSize - newSize;
      totalSaved += saved;
      console.log(`  ${filePath}`);
      console.log(`  ${formatMB(originalSize)} → ${formatMB(newSize)} (saved ${formatMB(saved)})`);
    } else {
      console.log(`  ${filePath} — no progress bloat (${formatMB(originalSize)})`);
    }

    // 成功，删除备份
    unlinkSync(bakPath);
  } catch (e) {
    // 出错，恢复备份
    copyFileSync(bakPath, filePath);
    unlinkSync(bakPath);
    console.log(`  ${filePath} — ERROR: ${e.message}, restored from backup`);
  }
}

console.log(`\n[slim-sessions] Total saved: ${formatMB(totalSaved)}`);
