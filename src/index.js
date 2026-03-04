require('dotenv').config();
const { Gateway } = require('./gateway');
const { FeishuAdapter } = require('./channels/feishu');
const { ClaudeClient } = require('./claude');
const { SessionStore } = require('./session');
const { BitableLogger } = require('./bitable');
const { TaskExecutor } = require('./task-executor');
const { Deployer } = require('./deployer');

async function main() {
  console.log('[Jarvis] Starting gateway...');

  const gateway = new Gateway({
    session: new SessionStore(),
    claude: new ClaudeClient(),
  });

  const feishu = new FeishuAdapter({
    gateway,
    bitable: new BitableLogger(),
    taskExecutor: new TaskExecutor(),
    deployer: new Deployer(),
  });

  await feishu.start();

  // 企业微信（可选，仅当配置了 WECOM_CORP_ID 时启动）
  if (process.env.WECOM_CORP_ID) {
    const { WeComAdapter } = require('./channels/wecom');
    const wecom = new WeComAdapter({ gateway });
    await wecom.start();
  }

  console.log('[Jarvis] Gateway running ✓');
}

main().catch(err => {
  console.error('[Jarvis] Fatal error:', err);
  process.exit(1);
});
