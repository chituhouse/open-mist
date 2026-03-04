# 开发日记：子进程 stdin 管道死锁

> 2026-02-21 · P2 Heartbeat 守护实现过程中发现

## 问题

heartbeat.js 用 Node.js `spawn()` 调用 `claude -p "巡检..."`，进程启动了但永远不返回。手动在终端执行同样的命令却秒完成。

## 根因

Node.js `spawn()`/`exec()`/`execFile()` 默认给子进程的 stdin 创建 pipe（管道）。如果父进程**不往里写、也不关闭**这根管道，子进程会一直等待输入，造成死锁。

```
父进程 (heartbeat.js)              子进程 (claude -p)

stdin pipe  ──【不写、不关】──→     "stdin 是管道，可能还有数据" → 等待...
stdout pipe ←──【claude 没开始】──  (空)
```

## 修复

```javascript
// 把 stdin 指向 /dev/null，子进程读到立即 EOF
spawn('claude', ['-p', prompt, ...], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
```

## 调试过程（约 20 分钟）

| 阶段 | 假设 | 尝试 | 结果 |
|------|------|------|------|
| 1 | 超时不够 | 2min → 3min → 5min | 全部超时 |
| 2 | 环境变量问题 | 检查 HOME/PATH/TERM | 全部正确 |
| 3 | systemd 特殊行为 | 对比手动执行 | 手动秒完成 |
| 4 | **对比实验** | execSync vs exec | **execSync 成功，exec 超时** |
| 5 | 定位 stdin | spawn + `stdio: ['ignore', ...]` | **5 秒完成** |

关键转折是第 4 步：同步版成功、异步版失败，两者的核心区别是 stdin 管道的生命周期管理。

## 背景知识：Unix 三个标准流

每个 Unix 进程天生有三个 I/O 流，这是 1970 年代 Ken Thompson 设计的，目的是让小程序通过管道组合成大功能。

```bash
cat access.log | grep "ERROR" | sort | uniq -c | head -10
```

| fd | 名称 | 方向 | 用途 | 典型场景 |
|---|------|------|------|---------|
| 0 | stdin | 外部 → 进程 | 读取输入 | 键盘、管道、文件重定向 |
| 1 | stdout | 进程 → 外部 | 正常输出 | 结果、数据 |
| 2 | stderr | 进程 → 外部 | 错误输出 | 错误信息、进度条、调试日志 |

**分离 stdout 和 stderr 的精妙之处**：

```bash
# stdout 是数据，stderr 是进度/错误，互不干扰
curl https://example.com/big.tar.gz | tar xz
#    stdout → 文件数据 → 给 tar 解压
#    stderr → 下载进度 → 显示在终端

# 数据导出时错误不污染结果
find / -name "*.conf" > result.txt 2>/dev/null
#    stdout → 文件路径 → 写入 result.txt
#    stderr → Permission denied → 丢弃
```

## 为什么 `claude -p` 会检查 stdin

因为 CLI 工具通常同时支持两种输入方式：

```bash
# 方式 A：命令行参数
claude -p "你好"

# 方式 B：管道输入（stdin）
echo "你好" | claude -p
cat prompt.txt | claude -p
```

claude 启动后处理完 `-p` 参数，还会检查 stdin：如果 stdin 是终端（TTY）或 `/dev/null`，立即跳过；如果是管道（pipe），就等待读取，因为可能有数据要来。

Node.js 默认创建的就是 pipe，所以 claude 会等。

## 其他可能遇到的场景

### 1. 任何支持管道输入的 CLI 工具

```javascript
// 可能卡住的工具：python、node、ruby、cat、jq、ffmpeg（部分模式）
spawn('python3', ['-c', 'print("hello")']);  // python 也会检查 stdin
spawn('node', ['-e', 'console.log("hi")']);  // node 同理
```

### 2. Docker 容器内执行命令

```javascript
// docker exec 也会创建 stdin 管道
spawn('docker', ['exec', 'container', 'some-command']);
```

### 3. SSH 远程执行

```javascript
// ssh 远程命令同样可能等 stdin
spawn('ssh', ['server', 'some-command']);
// 修复：ssh -T（禁用伪终端分配）+ stdio ignore
```

### 4. CI/CD 脚本中调用 CLI 工具

GitHub Actions、Jenkins 等 CI 环境中，spawn 子进程也可能遇到同样问题。

### 5. Python 的 subprocess

```python
# Python 也有同样的问题
import subprocess

# 可能卡住
proc = subprocess.Popen(['claude', '-p', 'hello'], stdout=subprocess.PIPE)

# 修复：显式关闭 stdin
proc = subprocess.Popen(['claude', '-p', 'hello'],
                        stdin=subprocess.DEVNULL,  # ← 关键
                        stdout=subprocess.PIPE)
```

## 判断规则

当你在代码中 spawn 子进程时，问自己：**我需要往子进程的 stdin 写数据吗？**

- **需要**（像 SDK 那样传 prompt）→ 写完后 **必须 `.end()` 关闭**
- **不需要**（参数已经通过 args 传了）→ 设 `stdio: ['ignore', ...]`

## 对比：各种 Node.js 子进程 API 的 stdin 行为

| API | stdin 默认行为 | 是否安全 |
|-----|--------------|---------|
| `execSync()` | 继承父进程 stdin 或自动管理 | 安全（同步执行，fd 自动关闭） |
| `exec()` | 创建 pipe，不自动关闭 | **可能死锁** |
| `execFile()` | 创建 pipe，不自动关闭 | **可能死锁** |
| `spawn()` | 创建 pipe，不自动关闭 | **可能死锁**（除非手动处理） |
| `spawn({ stdio: 'ignore' })` | 连接到 /dev/null | 安全 |
| `fork()` | 创建 IPC channel + pipe | 特殊（Node 进程间通信） |

## 一句话总结

**spawn 子进程时，如果不需要 stdin，显式设为 `'ignore'`。这不是优化，是防死锁。**
