'use strict';

/**
 * 飞书消息历史 API
 * 编辑、撤回、转发、已读、历史、Pin 等消息扩展能力
 */
class FeishuMessageAPI {
  constructor(client) {
    this.client = client;
  }

  async editMessage(messageId, newContent, msgType = 'text') {
    try {
      const content = msgType === 'text'
        ? JSON.stringify({ text: newContent })
        : newContent;
      await this.client.im.message.update({
        path: { message_id: messageId },
        data: { content, msg_type: msgType },
      });
      console.log(`[Feishu] Message edited: ${messageId}`);
      return true;
    } catch (err) {
      console.error(`[Feishu] Edit message failed: ${err.message}`);
      return false;
    }
  }

  async recallMessage(messageId) {
    try {
      await this.client.im.message.delete({
        path: { message_id: messageId },
      });
      console.log(`[Feishu] Message recalled: ${messageId}`);
      return true;
    } catch (err) {
      console.error(`[Feishu] Recall message failed: ${err.message}`);
      return false;
    }
  }

  async forwardMessage(messageId, receiverId, receiveIdType = 'chat_id') {
    try {
      const resp = await this.client.im.message.forward({
        path: { message_id: messageId },
        data: { receive_id: receiverId },
        params: { receive_id_type: receiveIdType },
      });
      const newMsgId = resp?.message_id || resp?.data?.message_id;
      console.log(`[Feishu] Message forwarded: ${messageId} → ${receiverId} (new: ${newMsgId})`);
      return newMsgId;
    } catch (err) {
      console.error(`[Feishu] Forward message failed: ${err.message}`);
      return null;
    }
  }

  async getReadUsers(messageId) {
    try {
      const items = [];
      let pageToken;
      do {
        const params = { user_id_type: 'open_id', page_size: 100 };
        if (pageToken) params.page_token = pageToken;
        const resp = await this.client.im.message.readUsers({
          path: { message_id: messageId },
          params,
        });
        const data = resp?.data || resp;
        if (data?.items) items.push(...data.items);
        pageToken = data?.page_token;
      } while (pageToken);
      console.log(`[Feishu] Read users for ${messageId}: ${items.length}`);
      return { readCount: items.length, users: items };
    } catch (err) {
      console.error(`[Feishu] Get read users failed: ${err.message}`);
      return { readCount: 0, users: [] };
    }
  }

  async getChatHistory(chatId, { startTime, endTime, pageSize = 20, pageToken } = {}) {
    try {
      const params = {
        container_id_type: 'chat',
        container_id: chatId,
        sort_type: 'ByCreateTimeDesc',
        page_size: pageSize,
      };
      if (startTime) params.start_time = String(startTime);
      if (endTime) params.end_time = String(endTime);
      if (pageToken) params.page_token = pageToken;

      const resp = await this.client.im.message.list({ params });
      const data = resp?.data || resp;
      const messages = (data?.items || []).map(m => ({
        messageId: m.message_id,
        msgType: m.msg_type,
        createTime: m.create_time,
        senderId: m.sender?.id,
        content: m.body?.content,
      }));
      console.log(`[Feishu] Chat history for ${chatId}: ${messages.length} messages`);
      return { messages, hasMore: data?.has_more, pageToken: data?.page_token };
    } catch (err) {
      console.error(`[Feishu] Get chat history failed: ${err.message}`);
      return { messages: [], hasMore: false };
    }
  }

  async pinMessage(messageId) {
    try {
      await this.client.im.pin.create({
        data: { message_id: messageId },
      });
      console.log(`[Feishu] Message pinned: ${messageId}`);
      return true;
    } catch (err) {
      console.error(`[Feishu] Pin message failed: ${err.message}`);
      return false;
    }
  }

  async unpinMessage(messageId) {
    try {
      await this.client.im.pin.delete({
        path: { message_id: messageId },
      });
      console.log(`[Feishu] Message unpinned: ${messageId}`);
      return true;
    } catch (err) {
      console.error(`[Feishu] Unpin message failed: ${err.message}`);
      return false;
    }
  }

  async getPinnedMessages(chatId) {
    try {
      const items = [];
      let pageToken;
      do {
        const params = { chat_id: chatId, page_size: 50 };
        if (pageToken) params.page_token = pageToken;
        const resp = await this.client.im.pin.list({ params });
        const data = resp?.data || resp;
        if (data?.items) items.push(...data.items);
        pageToken = data?.page_token;
      } while (pageToken);
      console.log(`[Feishu] Pinned messages in ${chatId}: ${items.length}`);
      return items;
    } catch (err) {
      console.error(`[Feishu] Get pinned messages failed: ${err.message}`);
      return [];
    }
  }
}

module.exports = { FeishuMessageAPI };
