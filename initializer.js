const { Menu } = require('electron');
const menuItems = require('./menu.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const file_utils = require('./file_utils.js');
const database = require('./database.js');

const envParams = {
    USER_ORGAN: 'USER_ORGAN',
    USER_NAME: 'USER_NAME',
    GEMINI_API_KEY: 'GEMINI_API_KEY',
    GEMINI_MODEL: 'GEMINI_MODEL',
    GEMINI_TEMPERATURE: 'GEMINI_TEMPERATURE',
    GEMINI_MAX_OUTPUT_TOKENS: 'GEMINI_MAX_OUTPUT_TOKENS',
    GEMINI_TOP_P: 'GEMINI_TOP_P',
    GEMINI_TOP_K: 'GEMINI_TOP_K',
    USE_SEARCH_RESULT: 'USE_SEARCH_RESULT',
    GOOGLE_API_KEY: 'GOOGLE_API_KEY',
    GOOGLE_CSE_ID : 'GOOGLE_CSE_ID',
    DEV_CONSOLE_MODE : 'DEV_CONSOLE_MODE',
    HISTORY_DIR : 'HISTORY_DIR',
    HISTORY_LIMIT : 'HISTORY_LIMIT',
    DARK_MODE : 'DARK_MODE',
    PERSONALITY : 'PERSONALITY',
    LANG: 'LANG'
};

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
        USER_ORGAN = 
        USER_NAME = 

        GEMINI_API_KEY = 
        GEMINI_MODEL = gemini-1.0-pro
        GEMINI_TEMPERATURE = 0.5
        GEMINI_MAX_OUTPUT_TOKENS = 1024
        GEMINI_TOP_P = 1.0
        GEMINI_TOP_K = 1

        USE_SEARCH_RESULT = false
        GOOGLE_API_KEY =
        GOOGLE_SEARCH_ENGINE_ID =

        DEV_CONSOLE_MODE = false

        HISTORY_DIR = talk_history
        HISTORY_LIMIT = 100

        DARK_MODE = true

        PERSONALITY = default
        LANG = ja
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
    const appDir = file_utils.getAppDir();
    // フォルダ階層を作成する。
    file_utils.createDir(path.join(appDir, 'temp')); // ejsでレンダリングしたhtmlを保存する。
    file_utils.createDir(path.join(appDir, process.env.HISTORY_DIR)); //ここに会話履歴を保存する。
    file_utils.createEmptyFile(path.join(appDir, 'temp/currentView.html'));
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

/**
 * personality内のjsonファイルを全て読み込んでリストにする。
 */
async function initializePersonality(){
    const personalityDir = path.join(file_utils.getAppDir(), 'personality');
    const files = fs.readdirSync(personalityDir);
    const personalityList = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.endsWith('.json')) {
            const personality = JSON.parse(fs.readFileSync(path.join(personalityDir, file), 'utf8'));
            personalityList.push(personality);
        }
    }
    return personalityList;
}

module.exports = {
    initEnv,
    initDirectories,
    initDatabase,
    initMenus,
    initializePersonality,
    envParams
};
