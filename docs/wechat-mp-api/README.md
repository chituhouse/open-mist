# 微信公众号（MP）开发文档

> 整理日期：2026-02-21
> 用途：了解微信公众平台（Official Account）开发，与企业微信机器人做类比

## 文档目录

| 文件 | 内容 |
|------|------|
| [01-overview.md](./01-overview.md) | 公众号类型、接入流程、开发权限概述 |
| [02-message-format.md](./02-message-format.md) | 消息接收格式（XML）、事件推送格式 |
| [03-reply-api.md](./03-reply-api.md) | 被动回复、客服消息主动发送、access_token 管理 |
| [04-vs-wecom.md](./04-vs-wecom.md) | 与企业微信的开发差异对比 |

## 快速定向

**我只想知道怎么收/发消息** → [02-message-format.md](./02-message-format.md) + [03-reply-api.md](./03-reply-api.md)

**我想做 AI 聊天机器人** → [03-reply-api.md § AI 机器人超时解决方案](./03-reply-api.md#ai-机器人超时解决方案)

**我已经做了企业微信，想对比区别** → [04-vs-wecom.md](./04-vs-wecom.md)

## 核心架构图

```
用户手机                微信服务器             开发者服务器
   |                        |                        |
   |---- 发消息 ----------->|                        |
   |                        |--- POST XML ---------->|
   |                        |                        |--- 处理逻辑（5秒内）
   |                        |<-- 回复 XML -----------|
   |<--- 收到回复 ----------|                        |
```

**关键约束**：开发者服务器必须在 **5 秒内**响应，否则微信重试（最多 3 次），超时后用户看到"该公众号暂时无法提供服务"。

## 官方文档链接

- 微信公众号开发文档总入口：https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
- 消息接收：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_ordinary_messages.html
- 被动回复：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Passive_user_reply_message.html
- 客服消息（主动发送）：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Customer_Service_Messages.html
- 获取 access_token：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
- 获取 Stable access_token：https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/getStableAccessToken.html
- 事件推送：https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_event_pushes.html
