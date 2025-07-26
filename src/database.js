const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const fs = require('fs');
      const dataDir = path.join(__dirname, 'data');
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const dbPath = path.join(dataDir, 'api_keys.sqlite');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS api_keys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key_id TEXT UNIQUE NOT NULL,
          label TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_used DATETIME
        )
      `;

      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
          reject(err);
        } else {
          console.log('API keys table ready');
          resolve();
        }
      });
    });
  }

  insertApiKey(keyId, label) {
    return new Promise((resolve, reject) => {
      const insertSQL = 'INSERT INTO api_keys (key_id, label) VALUES (?, ?)';
      
      this.db.run(insertSQL, [keyId, label], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, keyId, label });
        }
      });
    });
  }

  findApiKey(keyId) {
    return new Promise((resolve, reject) => {
      const selectSQL = 'SELECT * FROM api_keys WHERE key_id = ?';
      
      this.db.get(selectSQL, [keyId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  updateLastUsed(keyId) {
    return new Promise((resolve, reject) => {
      const updateSQL = 'UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE key_id = ?';
      
      this.db.run(updateSQL, [keyId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = new Database();
