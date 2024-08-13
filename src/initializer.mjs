import electronPackage from 'electron';
import fs from 'fs';
import i18n from 'i18n';
import path from 'path';
import * as database from './database.mjs';
import * as fileUtils from './fileUtils.mjs';
import * as menuItems from './menu.mjs';

const { Menu } = electronPackage;

// 環境変数の初期値
function getEnvParams() {
    // このパラメータを調整すると、.envファイルの項目と設定の画面が変わる。
    let envParams = [
        { param_name: 'LABEL', param_value: '', label: 'User Info' },
        { param_name: 'USER_ORGAN', param_value: '', label: 'User Org.' },
        { param_name: 'USER_NAME', param_value: '', label: 'User Name' },
        { param_name: 'USER_PHONE', param_value: '', label: 'User Phone' },
        { param_name: 'USER_MAIL', param_value: '', label: 'User Mail' },
        { param_name: 'LABEL010', param_value: '', label: 'Mode Parameters' },
        { param_name: 'PERSONALITY', param_value: 'default', label: 'Personality' },
        { param_name: 'APPLICATION_LANG', param_value: 'ja', label: 'Application Language' },
        { param_name: 'LABEL020', param_value: '', label: 'LLM Model' },
        { param_name: 'GEMINI_MODEL', param_value: 'gemini-1.5-flash', label: 'LLM Model of gemini/ollama' },
        { param_name: 'LABEL025', param_value: '', label: 'Gemini API info' },
        { param_name: 'GEMINI_API_KEY', param_value: '', label: 'Gemini API Key' },
        { param_name: 'GEMINI_TEMPERATURE', param_value: '0.2', label: 'Gemini Temperature' },
        { param_name: 'GEMINI_MAX_OUTPUT_TOKENS', param_value: '1024', label: 'Gemini Max Output Tokens' },
        { param_name: 'GEMINI_TOP_P', param_value: '1.0', label: 'Gemini Top P' },
        { param_name: 'GEMINI_TOP_K', param_value: '1', label: 'Gemini Top K' },
        { param_name: 'LABEL030', param_value: '', label: 'Search Engine' },
        { param_name: 'USE_SEARCH_RESULT', param_value: 'true', label: 'Use Search Result' },
        { param_name: 'SEARCH_DOC_LIMIT', param_value: '4', label: 'Search Document Limit' },
        { param_name: 'GOOGLE_API_KEY', param_value: '', label: 'Google API Key' },
        { param_name: 'GOOGLE_SEARCH_ENGINE_ID', param_value: '', label: 'Google Search Engine ID' },
        { param_name: 'LABEL040', param_value: '', label: 'History Settings' },
        { param_name: 'HISTORY_DIR', param_value: 'talk_history', label: 'History Directory' },
        { param_name: 'HISTORY_LIMIT', param_value: '100', label: 'History Limit' },
        { param_name: 'LABEL050', param_value: '', label: 'Other Settings' },
        { param_name: 'DARK_MODE', param_value: 'true', label: 'Dark Mode' },
        { param_name: 'DEV_CONSOLE_MODE', param_value: 'false', label: 'Developer Console Mode' },
        { param_name: 'LABEL060', param_value: '', label: 'Elasticsearch + Nextcloud'},
        { param_name: 'USE_ELASTICSEARCH', param_value: 'false', label: 'Use Elasticsearch' },
        { param_name: 'ELASTICSEARCH_PROTOCOL', param_value: 'http', label: 'protocol http/https' },
        { param_name: 'ELASTICSEARCH_HOST', param_value: 'localhost', label: 'host IP or URL' },
        { param_name: 'ELASTICSEARCH_PORT', param_value: '9200', label: 'port' },
        { param_name: 'ELASTICSEARCH_INDEX', param_value: 'gemini_pad', label: 'index name' },
        { param_name: 'ELASTICSEARCH_APIKEY', param_value: '', label: 'API Key' },
        { param_name: 'ELASTICSEARCH_URL_PREFIX', param_value: '', label: 'URL Prefix' },
        { param_name: 'ELASTICSEARCH_CUT_OFF_SCORE', param_value: '85', label: 'cut off score' },
        { param_name: 'ELASTICSEARCH_USE_DOCUMENT_LIMIT', param_value: '3', label: 'use document limit' },
        { param_name: 'ELASTICSEARCH_OWNERS_LIMIT', param_value: '', label: 'document owner as(comma separated)' },
        { param_name: 'LABEL070', param_value: '', label: 'Solr(Examin)' },
        { param_name: 'USE_SOLR', param_value: 'false', label: 'Use Solr' },
        { param_name: 'SOLR_PROTOCOL', param_value: 'http', label: 'protocol http/https' },
        { param_name: 'SOLR_HOST', param_value: '127.0.0.1', label: 'host IP or URL' },
        { param_name: 'SOLR_PORT', param_value: '8983', label: 'port' },
        { param_name: 'SOLR_CORE', param_value: 'geminipad', label: 'core name' },
        { param_name: 'LABEL080', param_value: '', label: 'Deep RAG(Examin)' },
        { param_name: 'DEEP_RAG_MODE', param_value: 'false', label: 'use Deep RAG mode (gemma2 only)' },
        { param_name: 'DEEP_RAG_DEPTH', param_value: '1', label: 'Depth of RAG mode' },
    ];
    return envParams;
}

/**
 * 環境変数を初期化する。
 */
function initEnv() {
    let envParams = getEnvParams();
    // .envファイルがなければ生成してパラメータを中に書き込む。
    if (!fs.existsSync(fileUtils.getEnvFilePath())) {
        initDirectories();

        // .envファイルを作成する。
        fs.writeFileSync(fileUtils.getEnvFilePath(), '', 'utf8');
        // .envファイルにenvParamsを書き込む。順番が大事。
        saveEnv(envParams);
    }
    // Load .env file
    envParams = fileUtils.config();
    i18n.setLocale(process.env.APPLICATION_LANG);
    return envParams;
}

// envParamsを.envファイルに保存する。
function saveEnv(envParams) {
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

/**
 * フォルダ階層を初期化する。
 */
function initDirectories() {
    const appUserDir = fileUtils.getAppUserDir();
    const appDir = fileUtils.getAppDir();
    // フォルダ階層を作成する。
    fileUtils.createDir(path.join(appUserDir, process.env.HISTORY_DIR === undefined ? 'talk_history' : process.env.HISTORY_DIR)); //ここに会話履歴を保存する。
    fileUtils.createEmptyFile(path.join(appDir, '../temp/currentView.html'));
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
    getEnvParams,
    initDatabase,
    initDirectories,
    initEnv,
    initMenus,
    initializePersonality,
    saveEnv
};

