// 发送飞书群消息的工具脚本
// 用法: node scripts/send-notify.js "消息内容"
require('dotenv').config();
const lark = require('@larksuiteoapi/node-sdk');

const client = new lark.Client({
  appId: process.env.FEISHU_APP_ID,
  appSecret: process.env.FEISHU_APP_SECRET,
});

const CHAT_ID = process.env.NOTIFY_CHAT_ID;
const text = process.argv[2] || "测试消息";

client.im.message.create({
  params: { receive_id_type: "chat_id" },
  data: {
    receive_id: CHAT_ID,
    msg_type: "text",
    content: JSON.stringify({ text }),
  },
}).then(() => {
  console.log("通知已发送");
}).catch(err => {
  console.error("发送失败:", err.message);
  process.exit(1);
});
