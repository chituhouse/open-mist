/**
 * ChannelAdapter 基类 — 仅作接口文档，不强制继承。
 *
 * 每个 adapter 需实现：
 * - get platform()  → 平台标识 ('feishu' | 'wecom' | ...)
 * - async start()   → 启动连接/服务器
 * - async stop()    → 可选，优雅关停
 */
class ChannelAdapter {
  constructor(gateway) {
    this.gateway = gateway;
  }

  get platform() {
    throw new Error('must override');
  }

  async start() {
    throw new Error('must override');
  }

  async stop() {}

  async addReaction(messageId, type) {}
}

module.exports = { ChannelAdapter };
