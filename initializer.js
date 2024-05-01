const { Menu } = require('electron');
const menuItems = require('./menu.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const file_utils = require('./file_utils.js');
const database = require('./database.js');

/**
 * 環境変数を初期化する。
 */
function initEnv() {
    // .envファイルがなければ生成してパラメータを中に書き込む。
    if (!fs.existsSync('.env')) {
        // .envファイルを作成する。
        fs.writeFileSync('.env', '', 'utf8');
        // .envファイルにパラメータを書き込む。
        const parameters = `
        GEMINI_API_KEY = 
        GEMINI_MODEL = gemini-1.0-pro
        GEMINI_TEMPERATURE = 0.1
        GEMINI_MAX_OUTPUT_TOKENS = 1024
        GEMINI_TOP_P = 1.0
        GEMINI_TOP_K = 1

        DEV_CONSOLE_MODE = false

        HISTORY_DIR = talk_history
        HISTORY_LIMIT = 100
        `;
        // parametersの各行をトリムする。
        const parameters_array = parameters.split('\n');
        const parameters_trimmed = parameters_array.map((line) => line.trim());
        // parameters_trimmedをファイルに書き込む。
        fs.writeFileSync('.env', parameters_trimmed.join('\n'), 'utf8');
    }
    // Load .env file
    dotenv.config();
}

/**
 * フォルダ階層を初期化する。
 */
function initDirectories() {
    // フォルダ階層を作成する。
    file_utils.createDir(path.join(__dirname, 'temp')); // ejsでレンダリングしたhtmlを保存する。
    file_utils.createDir(path.join(__dirname, process.env.HISTORY_DIR)); //ここに会話履歴を保存する。
    file_utils.createEmptyFile(path.join(__dirname, 'temp/currentView.html'));
}

/**
 * データベースを初期化する。
 */
async function initDatabase() {
    await database.initDatabase();
}

/**
 * メニューを初期化する。
 */
async function initMenus() {
    const menu = Menu.buildFromTemplate(menuItems);
    Menu.setApplicationMenu(menu);
}

module.exports = {
    initEnv,
    initDirectories,
    initDatabase,
    initMenus
};
