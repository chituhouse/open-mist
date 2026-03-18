'use strict';

const fs = require('fs');
const path = require('path');
const { execFile: execFileCb } = require('child_process');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
const execFileAsync = promisify(execFileCb);

const DOWNLOADS_DIR = path.join(__dirname, '..', '..', 'downloads');

/**
 * 飞书媒体文件处理
 * 图片/文件下载、视频推送、缩略图生成
 */
class FeishuMedia {
  constructor(client, { mediaDir }) {
    this.client = client;
    this.mediaDir = mediaDir;
  }

  async saveImage(messageId, imageKey) {
    try {
      console.log(`[Feishu] Downloading image: ${imageKey}`);
      const resp = await this.client.im.messageResource.get({
        path: { message_id: messageId, file_key: imageKey },
        params: { type: 'image' },
      });

      if (resp && typeof resp.getReadableStream === 'function') {
        const stream = resp.getReadableStream();
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const fileName = `img-${Date.now()}-${imageKey.substring(0, 8)}.png`;
        const filePath = path.join(this.mediaDir, fileName);
        fs.writeFileSync(filePath, buffer);
        console.log(`[Feishu] Image saved: ${filePath} (${Math.round(buffer.length / 1024)}KB)`);
        return { type: 'image', path: filePath, name: fileName };
      }

      console.error('[Feishu] Unexpected image response format');
      return null;
    } catch (err) {
      console.error('[Feishu] Failed to download image:', err.message);
      return null;
    }
  }

  async saveFile(messageId, fileKey, fileName) {
    try {
      console.log(`[Feishu] Downloading file: ${fileName} (${fileKey})`);
      const resp = await this.client.im.messageResource.get({
        path: { message_id: messageId, file_key: fileKey },
        params: { type: 'file' },
      });

      if (resp && typeof resp.getReadableStream === 'function') {
        const stream = resp.getReadableStream();
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const safeName = `${Date.now()}-${fileName}`;
        const filePath = path.join(this.mediaDir, safeName);
        fs.writeFileSync(filePath, buffer);
        console.log(`[Feishu] File saved: ${filePath} (${Math.round(buffer.length / 1024)}KB)`);
        return { type: 'file', path: filePath, name: fileName };
      }

      console.error('[Feishu] Unexpected file response format');
      return null;
    } catch (err) {
      console.error('[Feishu] Failed to download file:', err.message);
      return null;
    }
  }

  parsePostContent(content) {
    let text = '';
    const imageKeys = [];
    const post = content.zh_cn || content.en_us || content;
    const title = post.title || '';
    const paragraphs = post.content || [];

    for (const paragraph of paragraphs) {
      for (const element of paragraph) {
        if (element.tag === 'text') {
          text += element.text || '';
        } else if (element.tag === 'img') {
          if (element.image_key) imageKeys.push(element.image_key);
        } else if (element.tag === 'at') {
          // skip
        } else if (element.tag === 'a') {
          text += element.text || element.href || '';
        }
      }
      text += '\n';
    }

    if (title) {
      text = title + '\n' + text;
    }

    return { text: text.trim(), imageKeys };
  }

  downloadFromUrl(url, redirectCount = 0) {
    if (redirectCount > 5) return Promise.reject(new Error('Too many redirects'));

    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const request = client.get(url, { timeout: 15000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          this.downloadFromUrl(res.headers.location, redirectCount + 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      });
      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Download timeout'));
      });
    });
  }

  async generateAndUploadThumbnail(videoPath) {
    const thumbPath = videoPath + '.thumb.jpg';
    try {
      await execFileAsync('/usr/bin/ffmpeg', [
        '-i', videoPath,
        '-ss', '00:00:01',
        '-frames:v', '1',
        '-vf', 'scale=480:-1',
        '-y',
        thumbPath,
      ], { timeout: 10000 });

      if (!fs.existsSync(thumbPath)) return null;

      const uploadResp = await this.client.im.image.create({
        data: {
          image_type: 'message',
          image: fs.createReadStream(thumbPath),
        },
      });

      fs.unlinkSync(thumbPath);

      const imageKey = uploadResp?.image_key || uploadResp?.data?.image_key;
      if (imageKey) {
        console.log(`[Feishu] Thumbnail uploaded: ${imageKey}`);
      }
      return imageKey;
    } catch (err) {
      try { fs.unlinkSync(thumbPath); } catch {}
      throw err;
    }
  }

  async pushNewDownloads(chatId, sinceTimestamp) {
    try {
      if (!fs.existsSync(DOWNLOADS_DIR)) return;
      const files = fs.readdirSync(DOWNLOADS_DIR);
      for (const file of files) {
        const match = file.match(/^(\d+)-/);
        if (match && parseInt(match[1]) >= sinceTimestamp) {
          const filePath = path.join(DOWNLOADS_DIR, file);
          await this.sendMediaToChat(chatId, filePath);
        }
      }
    } catch (err) {
      console.warn('[Feishu] Push downloads failed:', err.message);
    }
  }

  async sendMediaToChat(chatId, filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const fileStat = fs.statSync(filePath);
    const sizeMB = fileStat.size / 1024 / 1024;

    if (sizeMB > 30) {
      console.log(`[Feishu] File too large for direct push (${sizeMB.toFixed(1)}MB): ${fileName}`);
      return;
    }

    const isVideo = ['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext);
    const isAudio = ['.mp3', '.ogg', '.wav', '.opus', '.m4a'].includes(ext);

    try {
      const fileType = isVideo ? 'mp4' : isAudio ? 'opus' : 'stream';
      const uploadResp = await this.client.im.file.create({
        data: {
          file_type: fileType,
          file_name: fileName,
          file: fs.createReadStream(filePath),
        },
      });
      const fileKey = uploadResp?.file_key || uploadResp?.data?.file_key;
      if (!fileKey) {
        console.error('[Feishu] File upload returned no file_key:', JSON.stringify(uploadResp).substring(0, 200));
        return;
      }

      if (isVideo) {
        let imageKey = null;
        try {
          imageKey = await this.generateAndUploadThumbnail(filePath);
        } catch (thumbErr) {
          console.warn('[Feishu] Thumbnail generation failed (non-blocking):', thumbErr.message);
        }

        const content = imageKey
          ? { file_key: fileKey, image_key: imageKey }
          : { file_key: fileKey };

        await this.client.im.message.create({
          data: {
            receive_id: chatId,
            msg_type: 'media',
            content: JSON.stringify(content),
          },
          params: { receive_id_type: 'chat_id' },
        });
        console.log(`[Feishu] Pushed video: ${fileName} (${sizeMB.toFixed(1)}MB)`);
      } else {
        await this.client.im.message.create({
          data: {
            receive_id: chatId,
            msg_type: 'file',
            content: JSON.stringify({ file_key: fileKey }),
          },
          params: { receive_id_type: 'chat_id' },
        });
        console.log(`[Feishu] Pushed file: ${fileName} (${sizeMB.toFixed(1)}MB)`);
      }
    } catch (err) {
      console.error(`[Feishu] Media push failed for ${fileName}: ${err.message}`);
    }
  }
}

module.exports = { FeishuMedia };
