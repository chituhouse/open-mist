# 消息格式说明

微信公众号所有消息均通过 **HTTP POST + XML 格式**传输。消息分两类：
- **普通消息**：用户主动发送的文本、图片、语音等
- **事件消息**：用户操作触发（关注、点击菜单等），`MsgType` 为 `event`

---

## 一、公共字段

所有消息（含事件）均包含以下公共字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `ToUserName` | String | 消息接收方（公众号 ID）|
| `FromUserName` | String | 消息发送方（用户 OpenID）|
| `CreateTime` | Integer | 消息创建时间（Unix 时间戳）|
| `MsgType` | String | 消息类型：`text`/`image`/`voice`/`video`/`location`/`link`/`event` |

---

## 二、普通消息

### 2.1 文本消息（最常用）

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1348831860</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[用户发送的文本内容]]></Content>
  <MsgId>1234567890123456</MsgId>
</xml>
```

额外字段：
| 字段 | 说明 |
|------|------|
| `Content` | 文本内容 |
| `MsgId` | 消息 ID（64位整数，用于去重）|
| `MsgDataId` | 消息数据 ID（群发场景）|

### 2.2 图片消息

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1348831860</CreateTime>
  <MsgType><![CDATA[image]]></MsgType>
  <PicUrl><![CDATA[https://mmbiz.qpic.cn/xxx]]></PicUrl>
  <MediaId><![CDATA[media_id]]></MediaId>
  <MsgId>1234567890123456</MsgId>
</xml>
```

额外字段：
| 字段 | 说明 |
|------|------|
| `PicUrl` | 图片链接，HTTP GET 可下载 |
| `MediaId` | 媒体 ID（可通过素材接口下载）|

### 2.3 语音消息

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1357290913</CreateTime>
  <MsgType><![CDATA[voice]]></MsgType>
  <MediaId><![CDATA[media_id]]></MediaId>
  <Format><![CDATA[amr]]></Format>
  <MsgId>1234567890123456</MsgId>
  <!-- 开通语音识别功能后会有 Recognition 字段 -->
  <Recognition><![CDATA[识别结果文本]]></Recognition>
</xml>
```

额外字段：
| 字段 | 说明 |
|------|------|
| `Format` | 语音格式，如 `amr`、`speex` |
| `Recognition` | 语音识别结果（需开通识别功能，服务号可申请）|

### 2.4 视频消息

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1357290913</CreateTime>
  <MsgType><![CDATA[video]]></MsgType>
  <MediaId><![CDATA[media_id]]></MediaId>
  <ThumbMediaId><![CDATA[thumb_media_id]]></ThumbMediaId>
  <MsgId>1234567890123456</MsgId>
</xml>
```

### 2.5 地理位置消息

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1351776360</CreateTime>
  <MsgType><![CDATA[location]]></MsgType>
  <Location_X>23.134521</Location_X>
  <Location_Y>113.358803</Location_Y>
  <Scale>20</Scale>
  <Label><![CDATA[广州市天河区天河路xxx号]]></Label>
  <MsgId>1234567890123456</MsgId>
</xml>
```

### 2.6 链接消息（用户分享的文章链接）

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>1351776360</CreateTime>
  <MsgType><![CDATA[link]]></MsgType>
  <Title><![CDATA[文章标题]]></Title>
  <Description><![CDATA[文章描述]]></Description>
  <Url><![CDATA[https://example.com/article]]></Url>
  <MsgId>1234567890123456</MsgId>
</xml>
```

---

## 三、事件消息

事件消息的 `MsgType` 固定为 `event`，通过 `Event` 字段区分事件类型。

### 3.1 关注 / 取消关注

```xml
<!-- 关注事件 -->
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>123456789</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[subscribe]]></Event>
</xml>

<!-- 取消关注事件（不可回复） -->
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>123456789</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[unsubscribe]]></Event>
</xml>
```

### 3.2 扫描带参数二维码

```xml
<!-- 已关注用户扫码 -->
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>123456789</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[SCAN]]></Event>
  <EventKey><![CDATA[scene_value]]></EventKey>
  <Ticket><![CDATA[ticket_string]]></Ticket>
</xml>

<!-- 未关注用户扫码后关注，Event=subscribe，EventKey=qrscene_xxx -->
```

### 3.3 菜单点击事件

```xml
<!-- 点击菜单拉取消息（CLICK 类型菜单项） -->
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>123456789</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[CLICK]]></Event>
  <EventKey><![CDATA[KEY_VALUE]]></EventKey>
</xml>

<!-- 点击菜单跳转链接（VIEW 类型菜单项） -->
<xml>
  ...
  <Event><![CDATA[VIEW]]></Event>
  <EventKey><![CDATA[https://example.com]]></EventKey>
</xml>
```

### 3.4 地理位置上报（需公众号开启该功能）

```xml
<xml>
  <ToUserName><![CDATA[gh_xxxxxxxx]]></ToUserName>
  <FromUserName><![CDATA[oUser1234567890abcdef]]></FromUserName>
  <CreateTime>123456789</CreateTime>
  <MsgType><![CDATA[event]]></MsgType>
  <Event><![CDATA[LOCATION]]></Event>
  <Latitude>23.137466</Latitude>
  <Longitude>113.352425</Longitude>
  <Precision>119.385040</Precision>
</xml>
```

### 3.5 事件类型汇总

| Event 值 | 说明 | 可否回复 |
|----------|------|---------|
| `subscribe` | 关注（含扫码关注）| 可以 |
| `unsubscribe` | 取消关注 | 不可以 |
| `SCAN` | 已关注用户扫二维码 | 可以 |
| `LOCATION` | 上报地理位置 | 可以 |
| `CLICK` | 点击菜单（CLICK 类型）| 可以 |
| `VIEW` | 点击菜单（VIEW 跳转）| 不可以 |
| `TEMPLATESENDJOBFINISH` | 模板消息发送结果 | 不可以 |
| `MASSSENDJOBFINISH` | 群发消息结果通知 | 不可以 |

---

## 四、Node.js 消息处理骨架

```javascript
const express = require('express');
const xml2js = require('xml2js');
const crypto = require('crypto');

const app = express();

// 解析 XML body
app.use(express.text({ type: 'application/xml' }));
app.use(express.text({ type: 'text/xml' }));

// GET：URL 验证
app.get('/wechat', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;
  const token = process.env.WX_TOKEN;
  const hash = crypto.createHash('sha1')
    .update([token, timestamp, nonce].sort().join(''))
    .digest('hex');
  if (hash === signature) {
    res.send(echostr);
  } else {
    res.status(403).send('Forbidden');
  }
});

// POST：接收消息
app.post('/wechat', async (req, res) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  const body = await parser.parseStringPromise(req.body);
  const msg = body.xml;

  const { MsgType, Event, FromUserName, ToUserName } = msg;

  let replyContent = '';

  if (MsgType === 'text') {
    const userText = msg.Content;
    replyContent = await handleTextMessage(userText);  // 调用 AI 等逻辑
  } else if (MsgType === 'event' && Event === 'subscribe') {
    replyContent = '欢迎关注！';
  } else {
    // 不需要回复时返回 success（避免微信显示服务不可用）
    return res.send('success');
  }

  // 组装文本回复 XML
  const replyXml = buildTextReply(ToUserName, FromUserName, replyContent);
  res.set('Content-Type', 'application/xml');
  res.send(replyXml);
});

function buildTextReply(toUser, fromUser, content) {
  return `<xml>
  <ToUserName><![CDATA[${toUser}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
</xml>`;
}
```

---

## 五、重复消息去重

微信服务器 5 秒超时后会重试，同一条消息会以相同 `MsgId` 推送多次。必须做去重：

```javascript
const processedMsgIds = new Map();  // 生产环境用 Redis

function isDuplicate(msgId) {
  if (processedMsgIds.has(msgId)) return true;
  processedMsgIds.set(msgId, Date.now());
  // 清理 5 分钟前的记录
  const cutoff = Date.now() - 5 * 60 * 1000;
  for (const [id, time] of processedMsgIds) {
    if (time < cutoff) processedMsgIds.delete(id);
  }
  return false;
}
```

事件消息没有 `MsgId`，用 `FromUserName + CreateTime` 去重。
