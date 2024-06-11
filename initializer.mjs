import { Menu } from 'electron';
import fs from 'fs';
import i18n from 'i18n';
import path from 'path';
import * as database from './database.mjs';
import * as fileUtils from './fileUtils.mjs';
import * as menuItems from './menu.mjs';

// 環境変数の初期値
function getEnvParams() {
    let envParams = [
        { param_name: 'LABEL', param_value: '', label: 'User Info' },
        { param_name: 'USER_ORGAN', param_value: '', label: 'User Org.' },
        { param_name: 'USER_NAME', param_value: '', label: 'User Name' },
        { param_name: 'LABEL01', param_value: '', label: 'Mode Parameters' },
        { param_name: 'PERSONALITY', param_value: 'default', label: 'Personality' },
        { param_name: 'APPLICATION_LANG', param_value: 'ja', label: 'Application Language' },
        { param_name: 'LABEL', param_value: '', label: 'Gemini API info' },
        { param_name: 'GEMINI_API_KEY', param_value: '', label: 'Gemini API Key' },
        { param_name: 'GEMINI_MODEL', param_value: 'gemini-1.0-pro', label: 'Gemini Model' },
        { param_name: 'GEMINI_TEMPERATURE', param_value: '0.2', label: 'Gemini Temperature' },
        { param_name: 'GEMINI_MAX_OUTPUT_TOKENS', param_value: '1024', label: 'Gemini Max Output Tokens' },
        { param_name: 'GEMINI_TOP_P', param_value: '1.0', label: 'Gemini Top P' },
        { param_name: 'GEMINI_TOP_K', param_value: '1', label: 'Gemini Top K' },
        { param_name: 'LABEL', param_value: '', label: 'Search Engine' },
        { param_name: 'USE_SEARCH_RESULT', param_value: 'true', label: 'Use Search Result' },
        { param_name: 'GOOGLE_API_KEY', param_value: '', label: 'Google API Key' },
        { param_name: 'GOOGLE_SEARCH_ENGINE_ID', param_value: '', label: 'Google Search Engine ID' },
        { param_name: 'LABEL', param_value: '', label: 'History Settings' },
        { param_name: 'HISTORY_DIR', param_value: 'talk_history', label: 'History Directory' },
        { param_name: 'HISTORY_LIMIT', param_value: '100', label: 'History Limit' },
        { param_name: 'LABEL', param_value: '', label: 'Other Settings' },
        { param_name: 'DARK_MODE', param_value: 'true', label: 'Dark Mode' },
        { param_name: 'DEV_CONSOLE_MODE', param_value: 'false', label: 'Developer Console Mode' },
    ];
    return envParams;
}

/**
 * 環境変数を初期化する。
 */
function initEnv() {
    // .envファイルがなければ生成してパラメータを中に書き込む。
    if (!fs.existsSync(fileUtils.getEnvFilePath())) {
        initDirectories();

        // .envファイルを作成する。
        fs.writeFileSync(fileUtils.getEnvFilePath(), '', 'utf8');
        // .envファイルにenvParamsを書き込む。順番が大事。
        let envData = '';
        for (let i = 0; i < envParams.length; i++) {
            if (envParams[i].param_name === 'LABEL') {
                envData += `#${envParams[i].label}\n`;
            } else {
                envData += `${envParams[i].param_name}=${envParams[i].param_value}\n`;
            }
        }
        fs.writeFileSync(fileUtils.getEnvFilePath(), envData, 'utf8');
    }
    // Load .env file
    let envParams = fileUtils.config();
    i18n.setLocale(process.env.APPLICATION_LANG);
    return envParams;
}

/**
 * フォルダ階層を初期化する。
 */
function initDirectories() {
    const appUserDir = fileUtils.getAppUserDir();
    const appDir = fileUtils.getAppDir();
    // フォルダ階層を作成する。
    fileUtils.createDir(path.join(appUserDir, process.env.HISTORY_DIR === undefined ? 'talk_history' : process.env.HISTORY_DIR)); //ここに会話履歴を保存する。
    fileUtils.createEmptyFile(path.join(appDir, 'temp/currentView.html'));
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
    let localizedMenuItems = menuItems.localizeMenuItems(menuItems.menuItems);
    const menu = Menu.buildFromTemplate(localizedMenuItems);
    Menu.setApplicationMenu(menu);
}

/**
 * personality内のjsonファイルを全て読み込んでリストにする。
 */
async function initializePersonality() {
    const personalityDir = path.join(fileUtils.getAppDir(), 'personality');
    const files = fs.readdirSync(personalityDir);
    const personalityList = [];
    for (const element of files) {
        const file = element;
        if (file.endsWith('.json')) {
            const personality = JSON.parse(fs.readFileSync(path.join(personalityDir, file), 'utf8'));
            personalityList.push(personality);
        }
    }
    return personalityList;
}

export {
    getEnvParams, initDatabase, initDirectories, initEnv, initMenus,
    initializePersonality
};

