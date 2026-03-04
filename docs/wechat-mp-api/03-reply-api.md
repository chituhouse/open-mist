# 回复消息 API

微信公众号有两种消息发送方式，适用场景不同：

| 方式 | 触发条件 | 时间限制 | 格式 |
|------|---------|---------|------|
| **被动回复** | 在接收消息的 HTTP 响应体中直接返回 | 5 秒内必须响应 | XML |
| **客服消息（主动发送）**| 用户 48 小时内有过消息交互 | 48 小时内可发，每用户每天 100 条 | JSON（需 access_token）|

---

## 一、被动回复消息

### 1.1 回复文本

```xml
<xml>
  <ToUserName><![CDATA[接收方OpenID]]></ToUserName>
  <FromUserName><![CDATA[公众号ID]]></FromUserName>
  <CreateTime>1696000000</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[回复内容]]></Content>
</xml>
```

注意：`ToUserName` 是用户 OpenID（来自接收消息的 `FromUserName`），`FromUserName` 是公众号 ID（来自接收消息的 `ToUserName`），二者互换。

### 1.2 回复图片

```xml
<xml>
  <ToUserName><![CDATA[接收方OpenID]]></ToUserName>
  <FromUserName><![CDATA[公众号ID]]></FromUserName>
  <CreateTime>1696000000</CreateTime>
  <MsgType><![CDATA[image]]></MsgType>
  <Image>
    <MediaId><![CDATA[media_id]]></MediaId>
  </Image>
</xml>
```

### 1.3 回复图文消息（最多 10 条）

```xml
<xml>
  <ToUserName><![CDATA[接收方OpenID]]></ToUserName>
  <FromUserName><![CDATA[公众号ID]]></FromUserName>
  <CreateTime>1696000000</CreateTime>
  <MsgType><![CDATA[news]]></MsgType>
  <ArticleCount>1</ArticleCount>
  <Articles>
    <item>
      <Title><![CDATA[文章标题]]></Title>
      <Description><![CDATA[文章描述]]></Description>
      <PicUrl><![CDATA[https://example.com/pic.jpg]]></PicUrl>
      <Url><![CDATA[https://example.com/article]]></Url>
    </item>
  </Articles>
</xml>
```

### 1.4 回复语音

```xml
<xml>
  <ToUserName><![CDATA[接收方OpenID]]></ToUserName>
  <FromUserName><![CDATA[公众号ID]]></FromUserName>
  <CreateTime>1696000000</CreateTime>
  <MsgType><![CDATA[voice]]></MsgType>
  <Voice>
    <MediaId><![CDATA[media_id]]></MediaId>
  </Voice>
</xml>
```

### 1.5 不回复

当不需要回复时，返回以下任一内容，避免用户看到"该公众号暂时无法提供服务"：

```
success
```

或者返回空字符串（长度为 0，不是 XML 空标签）。

---

## 二、客服消息（主动发送）

### 2.1 触发条件

用户在以下情况与公众号产生交互后，**48 小时内**可使用此接口向该用户发消息：
- 发送任意消息
- 点击自定义菜单
- 订阅事件（关注）
- 扫描带参数二维码
- 支付成功事件
- 用户维权

### 2.2 接口地址

```
POST https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN
```

### 2.3 发送文本

```json
{
  "touser": "oUser1234567890abcdef",
  "msgtype": "text",
  "text": {
    "content": "Hello，这是主动发送的消息"
  }
}
```

### 2.4 发送图片

```json
{
  "touser": "oUser1234567890abcdef",
  "msgtype": "image",
  "image": {
    "media_id": "MEDIA_ID"
  }
}
```

### 2.5 发送图文消息

```json
{
  "touser": "oUser1234567890abcdef",
  "msgtype": "news",
  "news": {
    "articles": [
      {
        "title": "文章标题",
        "description": "文章描述",
        "url": "https://example.com/article",
        "picurl": "https://example.com/pic.jpg"
      }
    ]
  }
}
```

### 2.6 限制说明

- 仅限 48 小时内，每用户每天最多 100 条
- 超过 48 小时或需要大量推送 → 使用**模板消息**（服务号已认证才可申请）
- 需将服务器 IP 加入公众平台 IP 白名单

---

## 三、access_token 管理

### 3.1 什么是 access_token

公众号调用所有后台 API 的全局凭证，有效期 **7200 秒（2 小时）**。

有两个版本：

| 版本 | 接口 | 特点 |
|------|------|------|
| **普通版** | `GET /cgi-bin/token` | 每次调用返回新 token，旧 token 立即失效 |
| **稳定版**（推荐）| `POST /cgi-bin/stable_token` | 有效期内重复调用返回同一 token，支持强制刷新 |

### 3.2 获取普通 access_token

```
GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

响应：
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200
}
```

### 3.3 获取稳定版 access_token（推荐）

```
POST https://api.weixin.qq.com/cgi-bin/stable_token
Content-Type: application/json

{
  "grant_type": "client_credential",
  "appid": "APPID",
  "secret": "APPSECRET"
}
```

强制刷新（仅在 token 泄漏时使用，每天限 20 次）：
```json
{
  "grant_type": "client_credential",
  "appid": "APPID",
  "secret": "APPSECRET",
  "force_refresh": true
}
```

响应：
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200
}
```

### 3.4 最佳实践：中控服务器模式

不要每次调用 API 时都重新获取 token，应该：

```javascript
class AccessTokenManager {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.token = null;
    this.expireAt = 0;
  }

  async getToken() {
    // 提前 5 分钟刷新（300 秒）
    if (this.token && Date.now() < this.expireAt - 300 * 1000) {
      return this.token;
    }
    await this.refresh();
    return this.token;
  }

  async refresh() {
    const res = await fetch('https://api.weixin.qq.com/cgi-bin/stable_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credential',
        appid: this.appId,
        secret: this.appSecret,
      }),
    });
    const data = await res.json();
    if (data.errcode) throw new Error(`Get token failed: ${data.errmsg}`);
    this.token = data.access_token;
    this.expireAt = Date.now() + data.expires_in * 1000;
  }
}

const tokenManager = new AccessTokenManager(
  process.env.WX_APPID,
  process.env.WX_APPSECRET
);

// 使用时
const token = await tokenManager.getToken();
```

### 3.5 注意事项

- 存储空间至少 512 字节
- 多服务器部署时，必须**中控服务器统一管理**，防止多实例互相覆盖
- 普通版 token 每日调用上限 2000 次；稳定版每分钟 1 万次，每天 50 万次
- token 应存储在 Redis/数据库，不要只放内存（进程重启会丢失）

---

## 四、AI 机器人超时解决方案

### 问题

被动回复必须 5 秒内响应，而调用 AI API（Claude/GPT/DeepSeek 等）通常需要 5~30 秒。

### 方案一：重试窗口扩展（无需认证，最简单）

利用微信重试 3 次的机制，将有效窗口从 5 秒扩展到约 15 秒：

```javascript
// 存储进行中的 AI 请求
const pendingRequests = new Map();

app.post('/wechat', async (req, res) => {
  const msg = parseXml(req.body);
  const msgId = msg.MsgId || `${msg.FromUserName}:${msg.CreateTime}`;

  // 检查是否已有结果
  if (pendingRequests.has(msgId)) {
    const cached = pendingRequests.get(msgId);
    if (cached.result) {
      // AI 已完成，返回结果
      pendingRequests.delete(msgId);
      return respondWithText(res, msg, cached.result);
    }
    // AI 还在跑，让本次请求也超时（等待下一次重试）
    await sleep(4500);  // 等到接近 5 秒再返回 success
    return res.send('success');
  }

  // 首次收到此消息，异步启动 AI
  const requestState = { result: null };
  pendingRequests.set(msgId, requestState);

  // 异步调用 AI（不 await）
  callAI(msg.Content).then(result => {
    requestState.result = result;
  });

  // 等待最多 4 秒，看能否在本次请求内完成
  const deadline = Date.now() + 4000;
  while (Date.now() < deadline) {
    if (requestState.result) {
      pendingRequests.delete(msgId);
      return respondWithText(res, msg, requestState.result);
    }
    await sleep(200);
  }

  // 本次超时，等微信重试
  res.send('success');
});
```

### 方案二：先回复再推送（已认证服务号，推荐）

```javascript
app.post('/wechat', async (req, res) => {
  const msg = parseXml(req.body);

  // 立即回复一个提示，告知用户正在处理
  res.set('Content-Type', 'application/xml');
  res.send(buildTextReply(msg.ToUserName, msg.FromUserName, '正在思考中，请稍候...'));

  // 异步调用 AI，完成后通过客服接口推送
  callAI(msg.Content).then(async (result) => {
    const token = await tokenManager.getToken();
    await fetch(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        touser: msg.FromUserName,
        msgtype: 'text',
        text: { content: result }
      })
    });
  });
});
```

### 方案对比

| 方案 | 认证要求 | 用户体验 | 实现复杂度 |
|------|---------|---------|----------|
| 重试窗口扩展 | 无需认证 | AI≤15秒内体验好，超15秒无回复 | 中 |
| 先回复再推送 | 需已认证服务号 | 最好（有"处理中"提示，之后推送结果）| 低 |
| 简化提示词加速 | 无需认证 | 一般（只能接受浅答）| 低 |
