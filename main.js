const { renderFile } = require('ejs');
const { BrowserWindow, app, ipcMain, screen, nativeImage, nativeTheme, dialog } = require('electron');
const { writeFileSync } = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const database = require('./database.js');
const initializer = require('./initializer.js');
const marked = require('marked');
const file_utils = require('./file_utils.js');
const { get } = require('http');
const axios = require('axios');
const cheerio = require('cheerio');
const { searchDuckDuckGo, searchGoogleCSE } = require('./externalSearch.js');

let mainWindow;

let promptTemplate = [
];

let pastPrompt = [];

// Create a renderer with a custom link function
const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
    return `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
};

// Set the renderer to marked
marked.setOptions({ renderer });

// 外部検索を設定を元に判別し実行する。
async function getExternalInfo(query) {
    // 環境変数が設定されていない場合、DuckDuckGoを使用する。
    if (process.env.GOOGLE_API_KEY === '' || process.env.GOOGLE_CSE_ID === '') {
        return await searchDuckDuckGo(query);
    } else {
        return await searchGoogleCSE(query);
    }
}

// Create a new Electron window
async function createWindow() {

    const { height: screen_height, width: screen_width } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: screen_height,
        height: screen_height,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            contentSecurityPolicy: "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com"
        }
    });


    // Open DevTools (optional)
    if (process.env.DEV_CONSOLE_MODE === "true") {
        win.webContents.openDevTools();
    };

    // Load your HTML file
    mainWindow = win;
    if (process.env.GEMINI_API_KEY === '' || process.env.GEMINI_API_KEY === undefined) {
        changePage({ page: 'settings', title: 'Hello, World!', data: { env: process.env } });
    } else {
        showManual();
    }
    return win;
}

// Event listener for when Electron has finished initialization
app.whenReady().then(async () => {
    if (process.env.DARK_MODE === 'true') {
        nativeTheme.themeSource = 'dark';
    }

    mainWindow = await createWindow();

    // Event listener for macOS
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    await initializer.initDatabase();
    const talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
    const bookmarkedTalks = await database.getBookmarkedTalkList(process.env.HISTORY_LIMIT);
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('chat-history-reply', talkList);
        mainWindow.webContents.send('bookmarked-talks-reply', bookmarkedTalks);

        // ダークモードの設定を送信する。
        if (process.env.DARK_MODE === 'true') {
            mainWindow.webContents.send('set-dark-mode', process.env.DARK_MODE);
        }
        // 外部検索の設定を送信する。
        if (process.env.USE_SEARCH_RESULT === 'true') {
            mainWindow.webContents.send('use-web-reply', 'selected');
        } else {
            mainWindow.webContents.send('use-web-reply', 'unselected');
        }
    });
});

// Event listener for when all windows are closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

async function changePage(payload) {
    let srcFile = join(__dirname, `views/${payload.page}.ejs`);
    renderFile(srcFile,
        {
            title: payload.title,
            data: payload.data,
            dirname: __dirname.replace(/\\/g, '/'),
        },
        {},
        function (err, str) {
            const tempFile = join(file_utils.getAppDir(), 'temp/currentView.html');
            if (str === undefined) {
                str = 'ページデータが生成できませんでした。';
            }
            if (err !== null) {
                let stack = err.stack;
                stack = escapeHtml(stack);
                str += join('\n---\n<pre>', stack, '</pre>');
            }
            writeFileSync(tempFile, str, 'utf8');
            mainWindow.loadFile(tempFile);
        }
    );
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * ページ遷移を受信した。
 */
app.on('change-page', async (payload) => {
    changePage(payload);
});

/**
 * ページ遷移を受信した。
 */
ipcMain.on('change-page', async (event, payload) => {
    changePage(payload);
});

/**
 * チャットメッセージを受信した。
 */
ipcMain.on('chat-message', async (event, arg) => {
    // argの改行コードを\\nに変換する。
    arg = arg.replace(/\n/g, '\\n');

    const Gemini = await import('gemini-driver/geminiDriver.mjs');

    try {
        event.reply('show-loading-reply', 'loading');

        // 質問の回答を取得する。
        pastPrompt = [];
        pastPrompt = [...promptTemplate];

        // webの情報を取得する。
        let refinfo = "";
        if (process.env.USE_SEARCH_RESULT === 'true') {
            let externalInfo = await getExternalInfo(arg);
            if (externalInfo !== undefined && externalInfo.length > 0) {
                let data = { "data": [] };
                for (let item of externalInfo) {
                    data.data.push(item);
                    refinfo += `\n\n[${item.title}](${item.link}) `;
                }
                pastPrompt.push(data);
            }
        }

        console.log("回答を取得");
        pastPrompt.push({ role: "user", content: arg });
        let prompt = JSON.stringify(pastPrompt);
        let replyMessage = await Gemini.queryGemini(prompt);
        if (refinfo !== '') {
            replyMessage += `\n\n**参考**\n${refinfo}`;
        }
        event.reply('chat-reply', replyMessage);

        event.reply('show-loading-reply', 'loaded');

        // タイトルを取得する。
        console.log("タイトルを取得");
        let titleQuery = [];
        titleQuery = [...pastPrompt];
        titleQuery.push({ role: "user", content: arg });
        titleQuery.push({ role: "assistant", content: replyMessage });
        titleQuery.push({ role: "user", content: '会話内容にタイトルを生成してください。\nmarkdownは使わないでください。簡潔な内容にしてください。' });
        let queryTitle = await Gemini.queryGemini(JSON.stringify(titleQuery));
        event.reply('chat-title-reply', queryTitle);

        // キーワードを取得する。
        console.log("キーワードを取得");
        let keywordQuery = [];
        keywordQuery = [...pastPrompt];
        keywordQuery.push({ role: "user", content: arg });
        keywordQuery.push({ role: "assistant", content: '会話内容について、SEOに効果的なキーワードを考えてください。' });
        let keywords = await Gemini.queryGemini(JSON.stringify(keywordQuery));

        // 会話履歴に追加する。
        database.putTalk(queryTitle, arg, replyMessage, keywords);
        let talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
        event.reply('chat-history-reply', talkList);

        // ブックマークされた会話を取得する。
        let bookmarkedTalks = await database.getBookmarkedTalkList(process.env.HISTORY_LIMIT);
        event.reply('bookmarked-talks-reply', bookmarkedTalks);

    } catch (error) {
        // ダイアログを表示する。
        const dialog = require('electron').dialog;
        if (error.message.includes('Candidate was blocked due to SAFETY')) {
            dialog.showErrorBox('エラー', '質問が不適切な回答を生成するか、危険であると判断されたため、回答がブロックされました。\n質問を変更してください。');
        } else {
            dialog.showErrorBox('エラー', error.message);
        }
        showManual();
    }
});

// マニュアルページを表示する。
function showManual() {
    const readme = fs.readFileSync(join(__dirname, 'README.md'), 'utf8');
    changePage({ page: 'index', title: 'Hello, World!', data: { manual: readme } });
}

ipcMain.on('clip-response', async (event, arg) => {
    event.reply('clip-response', arg);
});

ipcMain.on('use-web', async (event, arg) => {
    let params = {};
    // initializer.envParamsの要素に一致する値をenvから取得する。
    for (let key of Object.keys(initializer.envParams)) {
        params[key] = process.env[key];
    }
    if (arg === 'selected') {
        params[initializer.envParams.USE_SEARCH_RESULT] = 'true';
        params[initializer.envParams.GEMINI_TEMPERATURE] = '0.3';
    } else {
        params[initializer.envParams.USE_SEARCH_RESULT] = 'false';
        params[initializer.envParams.GEMINI_TEMPERATURE] = '0.1';
    }
    saveSettings(params);
});

function saveSettings(params) {
    let writeData = '';
    for (const key in params) {
        process.env[key] = params[key];
        let paramLine = `${key} = ${params[key]}`;
        writeData += `${paramLine}\n`;
    }
    fs.writeFileSync('.env', writeData, 'utf8');
    dotenv.config();
}

ipcMain.on('save-settings', async (event, arg) => {
    saveSettings(arg);
    event.reply('settings-saved', '保存しました.');
    // リブートする。
    app.relaunch();
    app.quit();
});

ipcMain.on('talk-history-clicked', async (event, arg) => {
    const talk = await database.getTalk(arg);
    event.reply('one-history-reply', talk);
});

ipcMain.on('talk-history-bookmark-clicked', async (event, id) => {
    database.setBookmarkedTalk(id, true);
    const bookmarkedTalkList = await database.getBookmarkedTalkList(process.env.HISTORY_LIMIT);
    event.reply('bookmarked-talks-reply', bookmarkedTalkList);
    const talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
    event.reply('chat-history-reply', talkList);
});

ipcMain.on('bookmark-garbage-clicked', async (event, id) => {
    database.setBookmarkedTalk(id, false);
    const bookmarkedTalkList = await database.getBookmarkedTalkList(process.env.HISTORY_LIMIT);
    event.reply('bookmarked-talks-reply', bookmarkedTalkList);
    const talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
    event.reply('chat-history-reply', talkList);
});

ipcMain.on('markdown-to-html', async (event, arg) => {
    const html = marked.marked(arg);
    event.reply('markdown-to-html-reply', html);
});

ipcMain.on('manual-transfer', async (event, arg) => {
    const readme = fs.readFileSync(join(__dirname, 'README.md'), 'utf8');
    event.reply('manual-transfer-reply', readme);
});

ipcMain.on('search-chat-history', async (event, arg) => {
    const talkList = await database.findTalk(arg);
    event.reply('chat-history-reply', talkList);
});

ipcMain.on('talk-history-delete-clicked', async (event, id) => {
    database.removeTalk(id);
    const talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
    event.reply('chat-history-reply', talkList);
});

ipcMain.on('show-loading', async (event, arg) => {
    event.reply('show-loading-reply', arg);
});

ipcMain.on('remove-chat-history', async (event, arg) => {
    let options = {
        type: 'question', buttons: ['OK', 'Cancel'], defaultId: 1,
        title: '確認', message: '全ての通信履歴を削除しますか？',
    };
    await dialog.showMessageBox(mainWindow, options).then(async (returnValue) => {
        if (returnValue.response === 0) {
            database.removeAllNotBookmarkedTalks();
            event.reply('chat-history-reply', []);
            options = {
                type: 'info', buttons: ['OK'], defaultId: 0,
                title: '削除しました', message: 'しおりを挟んでいない通信履歴を全て削除しました。',
            };
            await dialog.showMessageBox(mainWindow, options).then((returnValue) => {
                mainWindow.focus();
            });
        }
    });
});

initializer.initEnv();
initializer.initDirectories();
initializer.initMenus();
const personalities = initializer.initializePersonality();

personalities.then((data) => {
    for (const personality of data) {
        if (personality.name === process.env.PERSONALITY) {
            promptTemplate.push({ role: personality.role, content: personality.content });
            break;
        }
    }
});

// USER_ORGANが設定されている場合、プロンプトに追加する。
if (process.env.USER_ORGAN !== '') {
    promptTemplate.push({ role: 'system', content: `ユーザーの所属は${process.env.USER_ORGAN}です。` });
}

// USER_NAMEが設定されている場合、プロンプトに追加する。
if (process.env.USER_NAME !== '') {
    promptTemplate.push({ role: 'system', content: `ユーザー名は${process.env.USER_NAME}です。` });
}
