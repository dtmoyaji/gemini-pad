const dotenv = require('dotenv');
const path = require('path');
const sqlite = require('sqlite3');

dotenv.config();

let data = null;
let initialized = false;

/**
 * データベースを初期化する。
 */
async function initDatabase() {
    try {
        const db_path = path.join(__dirname, process.env.HISTORY_DIR, 'talk_history.db');
        const db = new sqlite.Database(db_path);
        data = db;
        await initTables();
    } catch (err) {
        console.error(err);
    }
}

/**
 * テーブルを初期化する。
 */
async function initTables() {
    return new Promise((resolve, reject) => {
        if (data !== null) {
            data.run(`CREATE TABLE IF NOT EXISTS talk_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT,
            query TEXT,
            answer TEXT,
            keywords,
            bookmarked BOOLEAN DEFAULT FALSE,
            bookmark_ordinal INTEGER DEFAULT -1
        )`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    initialized = true;
                    resolve();
                }
            });
        }
    });
}

function isInitialized() {
    return initialized;
}

function putTalk(title, query, answer, keywords) {
    if (data !== null) {
        data.run('INSERT INTO talk_history (title, query, answer, keywords) VALUES (?, ?, ?, ?)', [title, query, answer, keywords]);
    }
}

/**
 * 新しい方から指定した数の会話を取得する。
 * @param {*} listSize 
 */
async function getTalkList(listSize) {
    return new Promise((resolve, reject) => {
        data.all('SELECT * FROM talk_history ORDER BY id DESC LIMIT ?', [listSize], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/**
 * 文字列を含むデータを検索する。検索フィールドは、タイトル、質問、回答、キーワードのいずれか。
 */
async function findTalk(keyword) {
    keyword = '%' + keyword + '%';
    return new Promise((resolve, reject) => {
        data.all('SELECT * FROM talk_history WHERE title LIKE ? OR query LIKE ? OR answer LIKE ? OR keywords LIKE ? ORDER BY id DESC LIMIT ?',
            [keyword, keyword, keyword, keyword, process.env.HISTORY_LIMIT],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

/**
 * IDを指定して会話を取得する。
 */
async function getTalk(id) {
    return new Promise((resolve, reject) => {
        data.all('SELECT * FROM talk_history WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
}

module.exports = {
    initDatabase,
    isInitialized,
    getTalk,
    putTalk,
    getTalkList,
    findTalk
};


