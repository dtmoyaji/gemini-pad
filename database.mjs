import path from 'path';
import sqlite from 'sqlite3';
import * as fileUtils from './fileUtils.mjs';

fileUtils.config();

let data = null;
let initialized = false;

/**
 * データベースを初期化する。
 */
async function initDatabase() {
    try {
        const db_path = path.join(fileUtils.getAppUserDir(), process.env.HISTORY_DIR, 'talk_history.db');
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
        data.all('SELECT * FROM talk_history WHERE bookmarked = FALSE ORDER BY id DESC LIMIT ?'
            , [listSize], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

async function getBookmarkedTalkList(listSize) {
    return new Promise((resolve, reject) => {
        data.all('SELECT * FROM talk_history WHERE bookmarked = TRUE ORDER BY bookmark_ordinal, id DESC LIMIT ?',
            [listSize], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
    });
}

async function setBookmarkedTalk(id, bookmarkable) {
    return new Promise((resolve, reject) => {
        data.run('UPDATE talk_history SET bookmarked = ? WHERE id = ?',
            [bookmarkable, id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

/**
 * 文字列を含むデータを検索する。検索フィールドは、タイトル、質問、回答、キーワードのいずれか。
 */
async function findTalk(keyword, bookmarked = false) {
    keyword = '%' + keyword + '%';
    const query = `SELECT * FROM talk_history
                    WHERE bookmarked = ? 
                    AND (title LIKE ? OR query LIKE ? OR answer LIKE ? OR keywords LIKE ?)
                    ORDER BY id DESC LIMIT ?`;
    const params = [bookmarked, keyword, keyword, keyword, keyword, process.env.HISTORY_LIMIT];

    return new Promise((resolve, reject) => {
        data.all(query, params, (err, rows) => {
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

/**
 * 会話を削除する。
 * @param {*} id
 * @returns
 */
async function removeTalk(id) {
    return new Promise((resolve, reject) => {
        data.run('DELETE FROM talk_history WHERE id = ?', [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * bookmarked=falseのレコードを削除する。
 */
async function removeAllNotBookmarkedTalks() {
    return new Promise((resolve, reject) => {
        data.run('DELETE FROM talk_history WHERE bookmarked = FALSE', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export {
    findTalk,
    getBookmarkedTalkList, getTalk, getTalkList, initDatabase,
    isInitialized, putTalk, removeAllNotBookmarkedTalks, removeTalk, setBookmarkedTalk
};


