const { Menu } = require('electron');
const menuItems = require('./menu.js');
const fs = require('fs');
const path = require('path');
const fileUtils = require('./fileUtils.js');
const database = require('./database.js');
const i18n = require('i18n');

const envParams = [
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'USER_ORGAN', param_value: '', },
    { param_name: 'USER_NAME', param_value: '' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'PERSONALITY', param_value: 'default' },
    { param_name: 'APPLICATION_LANG', param_value: 'ja' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'GEMINI_API_KEY', param_value: '' },
    { param_name: 'GEMINI_MODEL', param_value: 'gemini-1.0-pro' },
    { param_name: 'GEMINI_TEMPERATURE', param_value: '0.2' },
    { param_name: 'GEMINI_MAX_OUTPUT_TOKENS', param_value: '1024' },
    { param_name: 'GEMINI_TOP_P', param_value: '1.0' },
    { param_name: 'GEMINI_TOP_K', param_value: '1' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'USE_SEARCH_RESULT', param_value: 'true' },
    { param_name: 'GOOGLE_API_KEY', param_value: '' },
    { param_name: 'GOOGLE_SEARCH_ENGINE_ID', param_value: '' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'DEV_CONSOLE_MODE', param_value: 'false' },
    { param_name: 'HISTORY_DIR', param_value: 'talk_history' },
    { param_name: 'HISTORY_LIMIT', param_value: '100' },
    { param_name: 'LABEL', param_value: '' },
    { param_name: 'DARK_MODE', param_value: 'true' },
];

/**
 * 環境変数を初期化する。
 */
function initEnv() {
    // .envファイルがなければ生成してパラメータを中に書き込む。
    if (!fs.existsSync(fileUtils.getEnvFilePath())) {
        initDirectories();

        // .envファイルを作成する。
        fs.writeFileSync(fileUtils.getEnvFilePath(), '', 'utf8');
        // .envファイルにenvParamsを書き込む。
        let envData = '';
        envParams.forEach((param) => {
            if (param.param_name === 'LABEL') {
                envData += '#\n';
            } else {
                envData += `${param.param_name}=${param.param_value}\n`;
            }
        });
        fs.writeFileSync(fileUtils.getEnvFilePath(), envData, 'utf8');
    }
    // Load .env file
    fileUtils.config();
    i18n.setLocale(process.env.APPLICATION_LANG);

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

module.exports = {
    initEnv,
    initDirectories,
    initDatabase,
    initMenus,
    initializePersonality,
    envParams
};
