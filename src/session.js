const fs = require('fs');
const path = require('path');

const SESSIONS_FILE = path.join(__dirname, '..', 'data', 'sessions.json');

class SessionStore {
  constructor() {
    this.sessions = {};
    this._load();
  }

  _load() {
    try {
      const dir = path.dirname(SESSIONS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (fs.existsSync(SESSIONS_FILE)) {
        this.sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
      }
    } catch (e) {
      console.warn('[Session] Failed to load sessions:', e.message);
      this.sessions = {};
    }
  }

  _save() {
    const dir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFile(SESSIONS_FILE, JSON.stringify(this.sessions, null, 2), err => {
      if (err) console.error('[Session] Failed to save sessions:', err.message);
    });
  }

  get(chatId) {
    return this.sessions[chatId]?.sessionId || null;
  }

  set(chatId, sessionId) {
    this.sessions[chatId] = {
      sessionId,
      updatedAt: Date.now()
    };
    this._save();
  }

  clear(chatId) {
    delete this.sessions[chatId];
    this._save();
  }
}

module.exports = { SessionStore };
