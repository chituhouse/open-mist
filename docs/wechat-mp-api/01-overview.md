# 微信公众号开发概述

## 一、账号类型

### 1.1 三种类型对比

| 类型 | 适用对象 | 消息频率 | 消息展示位置 | 核心用途 |
|------|---------|---------|------------|---------|
| **订阅号** | 个人/企业 | 每天群发 1 条 | 折叠在"订阅号"文件夹 | 内容推送、自媒体 |
| **服务号** | 企业/政府/组织 | 每月群发 4 条 | 聊天列表（有提醒）| 服务交互、支付、高级功能 |
| **企业微信** | 企业内部 | 无限制 | 独立 App | 内部协同、员工管理 |

> 注意："企业号"已于 2018 年升级为"企业微信"，是独立 App，不在公众平台体系内。

### 1.2 订阅号 vs 服务号关键差异

**开发接口权限**：

| 功能 | 订阅号（未认证）| 订阅号（已认证）| 服务号（未认证）| 服务号（已认证）|
|------|:---:|:---:|:---:|:---:|
| 基础消息接口 | ✓ | ✓ | ✓ | ✓ |
| 自定义菜单 | - | ✓ | ✓ | ✓ |
| 模板消息（业务通知）| - | - | - | ✓ |
| 网页授权获取用户信息 | - | - | - | ✓ |
| 微信支付 | - | - | - | ✓ |
| 获取用户地理位置 | - | - | - | ✓ |
| 客服消息接口（主动发消息）| 仅被动回复 | 48h内可用 | 48h内可用 | 48h内可用 |

**对 AI 机器人开发的影响**：
- 订阅号（未认证）：只能被动回复，5 秒超时，AI 响应慢时体验差
- 服务号（已认证）：可以先回复 `success`，再异步通过客服接口推送 AI 结果，体验最好

### 1.3 注册说明

- 个人可注册**订阅号**（目前已不支持新的个人服务号）
- 企业/组织注册服务号需提供营业执照
- 建议开发调试使用**测试账号**（有全部接口权限）：登录公众平台 → 开发 → 开发者工具 → 公众平台测试账号

---

## 二、服务器接入流程

### 2.1 配置项

登录 [微信公众平台](https://mp.weixin.qq.com) → 开发 → 基本配置，填写：

| 字段 | 说明 |
|------|------|
| **URL** | 开发者服务器地址，接收微信消息和事件推送，必须 80/443 端口 |
| **Token** | 任意字符串，用于验证消息来源（与 access_token 无关）|
| **EncodingAESKey** | 手动填写或随机生成，用于消息加密（可选明文模式）|

消息加密模式：
- **明文模式**：消息不加密，开发调试推荐
- **兼容模式**：明文和密文同时推送
- **安全模式**：全加密，生产环境推荐

### 2.2 URL 验证流程（接入时触发一次）

微信服务器向开发者 URL 发送 GET 请求，携带 4 个参数：

```
GET https://your-server.com/wechat?signature=xxx&timestamp=xxx&nonce=xxx&echostr=xxx
```

| 参数 | 说明 |
|------|------|
| `signature` | 微信加密签名 |
| `timestamp` | 时间戳 |
| `nonce` | 随机数 |
| `echostr` | 随机字符串（验证成功后需原样返回）|

**验证算法**：
```
SHA1(sort([token, timestamp, nonce]).join('')) === signature
```

具体步骤：
1. 将 `token`、`timestamp`、`nonce` 三个字符串按字典序排序
2. 拼接为一个字符串，SHA1 加密
3. 与 `signature` 比对，一致则**原样返回 `echostr`**

**Node.js 示例**：
```javascript
const crypto = require('crypto');

function verifySignature(token, signature, timestamp, nonce) {
  const str = [token, timestamp, nonce].sort().join('');
  const hash = crypto.createHash('sha1').update(str).digest('hex');
  return hash === signature;
}

// Express 路由
app.get('/wechat', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;
  if (verifySignature(process.env.WX_TOKEN, signature, timestamp, nonce)) {
    res.send(echostr);  // 验证成功，原样返回 echostr
  } else {
    res.status(403).send('Invalid signature');
  }
});
```

### 2.3 后续消息推送（正常运行）

验证通过后，每当用户发消息或触发事件，微信服务器向同一 URL 发送 **POST 请求**，携带 XML 数据。

```
POST https://your-server.com/wechat
Content-Type: application/xml

<xml>
  <ToUserName>...</ToUserName>
  ...
</xml>
```

同一 URL 同时处理 GET（验证）和 POST（消息），通过请求方法区分。

---

## 三、开发流程总结

```
1. 注册公众号（或申请测试账号）
   ↓
2. 部署后端服务（Node.js/Python/Java 等）
   - GET /wechat → 验证签名，返回 echostr
   - POST /wechat → 接收消息，返回 XML 回复
   ↓
3. 公众平台配置服务器 URL + Token
   ↓
4. 点击"提交"，微信发 GET 请求验证
   ↓
5. 验证成功，开始接收用户消息
   ↓
6. 实现业务逻辑（解析 XML → 调用 AI → 组装 XML 回复）
```

---

## 四、重要限制

- **5 秒超时**：被动回复必须在 5 秒内响应，超时微信重试 3 次
- **重复消息去重**：微信重试时 `MsgId` 相同，业务层需做去重（Redis/Map 缓存 MsgId）
- **IP 白名单**：调用部分 API（如主动发消息）需将服务器 IP 加入公众平台白名单
- **HTTPS 要求**：生产环境 URL 必须是 HTTPS（测试账号可用 HTTP）
