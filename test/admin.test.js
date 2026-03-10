'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { mask, formatDuration, formatBytes, progressBar, parseEnvFile, replaceEnvVar } = require('../admin.js');

describe('mask', () => {
  it('masks long strings showing first 4 and last 4', () => {
    assert.equal(mask('sk-ant-api03-abcdef123456'), 'sk-a****3456');
  });
  it('returns empty for empty string', () => {
    assert.equal(mask(''), '');
  });
  it('fully masks short strings', () => {
    assert.equal(mask('ab'), '****');
    assert.equal(mask('abcdefgh'), '****');
  });
  it('handles 9-char string (boundary)', () => {
    assert.equal(mask('123456789'), '1234****6789');
  });
});

describe('formatDuration', () => {
  it('formats days and hours', () => {
    assert.equal(formatDuration(86400000), '1天 0小时');
  });
  it('formats hours and minutes', () => {
    assert.equal(formatDuration(3661000), '1小时 1分钟');
  });
  it('formats zero as 0分钟', () => {
    assert.equal(formatDuration(0), '0分钟');
  });
  it('formats multi-day duration', () => {
    assert.equal(formatDuration(86400000 * 12 + 3600000 * 3), '12天 3小时');
  });
});

describe('formatBytes', () => {
  it('formats GB', () => {
    assert.equal(formatBytes(1073741824), '1.0 GB');
  });
  it('formats MB', () => {
    assert.equal(formatBytes(1048576), '1.0 MB');
  });
  it('formats zero', () => {
    assert.equal(formatBytes(0), '0 B');
  });
  it('formats KB', () => {
    assert.equal(formatBytes(1024), '1.0 KB');
  });
});

describe('progressBar', () => {
  it('renders 30% of 16 width', () => {
    const bar = progressBar(0.3, 16);
    assert.equal(bar.length, 16);
    assert.equal(bar, '\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591');
  });
  it('renders 100%', () => {
    assert.equal(progressBar(1.0, 10), '\u2588'.repeat(10));
  });
  it('renders 0%', () => {
    assert.equal(progressBar(0, 10), '\u2591'.repeat(10));
  });
});

describe('parseEnvFile', () => {
  it('parses KEY=VALUE lines', () => {
    const entries = parseEnvFile('FOO=bar\nBAZ=qux');
    const vars = entries.filter(e => e.type === 'var');
    assert.equal(vars.length, 2);
    assert.equal(vars[0].key, 'FOO');
    assert.equal(vars[0].value, 'bar');
  });
  it('preserves comments', () => {
    const entries = parseEnvFile('# comment\nFOO=bar');
    assert.equal(entries[0].type, 'comment');
    assert.equal(entries[1].type, 'var');
  });
  it('handles empty lines', () => {
    const entries = parseEnvFile('\n\nFOO=bar\n');
    const comments = entries.filter(e => e.type === 'comment');
    assert.ok(comments.length >= 2);
  });
});

describe('replaceEnvVar', () => {
  it('replaces existing variable', () => {
    const result = replaceEnvVar('FOO=old\nBAR=keep', 'FOO', 'new');
    assert.ok(result.includes('FOO=new'));
    assert.ok(result.includes('BAR=keep'));
  });
  it('appends non-existing variable', () => {
    const result = replaceEnvVar('FOO=bar', 'NEW', 'value');
    assert.ok(result.includes('FOO=bar'));
    assert.ok(result.includes('NEW=value'));
  });
  it('does not affect other variables', () => {
    const result = replaceEnvVar('A=1\nB=2\nC=3', 'B', 'updated');
    assert.ok(result.includes('A=1'));
    assert.ok(result.includes('B=updated'));
    assert.ok(result.includes('C=3'));
  });
  it('preserves comments', () => {
    const result = replaceEnvVar('# header\nFOO=old', 'FOO', 'new');
    assert.ok(result.includes('# header'));
  });
});
