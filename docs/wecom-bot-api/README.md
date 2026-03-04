# 企业微信智能机器人（AI 助手）API 文档

本目录收录企业微信智能机器人（aiHelper / AI助手）的完整开发文档，适用于开发者接入企业微信智能机器人 API 模式。

> 注意：所有文档内容均通过网络搜索整理自企业微信官方开发者中心，原始文档地址为 `https://developer.work.weixin.qq.com`。官方文档为单页应用（SPA），本地文档于 2026 年 2 月整理。

---

## 文档目录

| 文件名 | 原始 URL | 说明 |
|--------|---------|------|
| [path_101039.md](./path_101039.md) | https://developer.work.weixin.qq.com/document/path/101039 | 概述：API 模式说明、创建配置、URL 验证流程 |
| [path_100719.md](./path_100719.md) | https://developer.work.weixin.qq.com/document/path/100719 | 接收消息：所有消息类型的回调格式和字段说明 |
| [path_101027.md](./path_101027.md) | https://developer.work.weixin.qq.com/document/path/101027 | 接收事件：进入会话、卡片点击、用户反馈等事件格式 |
| [path_101031.md](./path_101031.md) | https://developer.work.weixin.qq.com/document/path/101031 | 被动回复消息：流式消息回复、模板卡片回复格式 |
| [path_101032.md](./path_101032.md) | https://developer.work.weixin.qq.com/document/path/101032 | 模板卡片类型：五种卡片类型的完整格式说明 |
| [path_101033.md](./path_101033.md) | https://developer.work.weixin.qq.com/document/path/101033 | 加解密方案：AES 加解密、签名验证、URL 验证完整流程 |
| [path_101138.md](./path_101138.md) | https://developer.work.weixin.qq.com/document/path/101138 | 主动回复消息：使用 response_url 异步回复的方法 |

---

## 快速上手

### 基本流程

```
1. 在企业微信管理后台创建智能机器人（API 模式）
   配置 URL / Token / EncodingAESKey

2. 服务器接收 GET 请求，验证 URL 有效性
   - 解密 echostr → 原样返回

3. 用户发消息 → 服务器接收加密 POST 回调
   - 验证签名（msg_signature）
   - 解密消息体（AES-CBC）
   - 解析 JSON 消息内容

4. 处理业务逻辑，回复消息
   方式一（被动回复）：在 HTTP 响应体中返回加密后的回复
   方式二（主动回复）：使用 response_url 发送明文 JSON POST
```

### 关键回调字段速查

| 字段 | 说明 |
|------|------|
| `msgid` | 消息唯一 ID（用于排重） |
| `aibotid` | 智能机器人 ID |
| `chatid` | 群聊 ID（单聊无此字段） |
| `chattype` | `group`=群聊，`single`=单聊 |
| `from.userid` | 发消息的用户 ID |
| `from.corpid` | 用户所在企业 ID |
| `response_url` | 主动回复用的 URL（1小时有效，只用一次） |
| `msgtype` | 消息类型：`text`/`image`/`voice`/`file`/`mixed`/`event`/`stream` |

### 加解密关键参数

| 参数 | 说明 |
|------|------|
| Token | 自定义字符串，用于签名验证 |
| EncodingAESKey | 43位 Base64，解码后为 32 字节 AES 密钥 |
| ReceiveId | **企业内部智能机器人传空字符串 `""`** |
| AES 模式 | CBC，PKCS#7 填充，IV = AESKey 前 16 字节 |

---

## 消息类型速查

### 接收消息（用户 → 机器人）

| `msgtype` | 说明 | 支持场景 |
|-----------|------|---------|
| `text` | 文本消息 | 群聊 @ + 单聊 |
| `mixed` | 图文混排 | 群聊 @ + 单聊 |
| `image` | 图片 | 仅单聊 |
| `voice` | 语音（含 ASR 转文字） | 仅单聊 |
| `file` | 文件 | 仅单聊 |
| `event` | 事件（进入会话/卡片点击/反馈） | 群聊 + 单聊 |
| `stream` | 流式消息刷新推送 | 群聊 + 单聊 |

### 回复消息（机器人 → 用户）

**被动回复（HTTP 响应，需加密）：**

| `msgtype` | 说明 |
|-----------|------|
| `stream` | 流式文本消息（适合 LLM 输出） |
| `stream_with_template_card` | 流式文本 + 模板卡片 |
| `template_card` | 仅模板卡片 |

**主动回复（response_url POST，无需加密）：**

| `msgtype` | 说明 |
|-----------|------|
| `text` | 纯文本 |
| `markdown` | Markdown 格式 |
| `image` | 图片（Base64） |
| `news` | 图文消息 |

---

## 注意事项

1. **回调超时**：企业微信服务器 5 秒内收不到响应会断连重试（消息重试 3 次，事件不重试）
2. **response_url 限制**：每个只能用一次，1 小时内有效
3. **流式消息**：从用户发消息开始最多等待 6 分钟
4. **消息排重**：使用 `msgid` 对消息排重，避免重复处理
5. **并发限制**：用户与同一机器人最多同时有 3 条消息交互中
6. **域名要求**：回调 URL 需要 ICP 备案且主体与企业一致

---

## 参考文档目录（完整）

| 文档 | 链接 |
|------|------|
| 概述 | https://developer.work.weixin.qq.com/document/path/101039 |
| 接收消息 | https://developer.work.weixin.qq.com/document/path/100719 |
| 接收事件 | https://developer.work.weixin.qq.com/document/path/101027 |
| 被动回复消息 | https://developer.work.weixin.qq.com/document/path/101031 |
| 模板卡片类型 | https://developer.work.weixin.qq.com/document/path/101032 |
| 回调和回复的加解密方案 | https://developer.work.weixin.qq.com/document/path/101033 |
| 主动回复消息 | https://developer.work.weixin.qq.com/document/path/101138 |
| 加解密方案说明（通用） | https://developer.work.weixin.qq.com/document/path/91144 |
| 回调配置 | https://developer.work.weixin.qq.com/document/path/91116 |
| 知识集管理 API | https://developer.work.weixin.qq.com/document/path/99975 |
