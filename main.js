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
    const Gemini = await import('gemini-driver/geminiDriver.mjs');
    //console.log(arg); // prints "arg" in the console

    try {
        event.reply('show-loading-reply', 'loading');

        // 質問の回答を取得する。
        pastPrompt = [];
        pastPrompt = [...promptTemplate];

        // webの情報を取得する。
        if (process.env.USE_SEARCH_RESULT === 'true' &&
            process.env.GOOGLE_API_KEY !== '' &&
            process.env.GOOGLE_CSE_ID !== ''
        ) {
            let externalInfo = await getExternalInfo(arg);
            let data = { "data": [] };
            for (let item of externalInfo) {
                data.data.push(item);
            }
            pastPrompt.push(data);
        }

        pastPrompt.push({ role: "user", content: arg });
        let prompt = JSON.stringify(pastPrompt);
        let replyMessage = await Gemini.queryGemini(prompt);
        event.reply('chat-reply', replyMessage);

        event.reply('show-loading-reply', 'loaded');

        // タイトルを取得する。
        let titleQuery = [];
        titleQuery = [...pastPrompt];
        titleQuery.push({ role: "assistant", content: replyMessage });
        titleQuery.push({ role: "user", content: '会話内容にタイトルを生成してください。\nmarkdownは使わないでください。' });
        let queryTitle = await Gemini.queryGemini(JSON.stringify(titleQuery));
        event.reply('chat-title-reply', queryTitle);

        // キーワードを取得する。
        let keywordQuery = [];
        keywordQuery = [...pastPrompt];
        keywordQuery.push({ role: "assistant", content: '会話内容について、SEOに効果的な10のキーワードを考えてください。' });
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

// Google CSE を使って、外部情報を取得する。検索結果のURLから情報を取得し、JSON形式で返す。
async function getExternalInfo(prompt) {
    const Gemini = await import('gemini-driver/geminiDriver.mjs');
    try {
        let promptData = [
            { "system": "あなたはweb検索のプロフェッショナルです。" },
            { "user": `---\n${prompt}\n---\nこの情報収集に最適な検索文章を考えて提示してください。prefixを付けないでテキストだけ返してください。` }
        ];
        let szPrompt = JSON.stringify(promptData);
        let keyworkds = await Gemini.queryGemini(szPrompt);

        let returnData = [];
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.GOOGLE_CSE_ID,
                q: keyworkds,
                num: 2,
            }
        });

        for (let item of response.data.items) {
            if (item.mime !== 'application/pdf') {
                let itemLink = item.link;
                // itemLinkから情報を取得する。
                try {
                    let itemResponse = await axios.get(itemLink);

                    let itemData = itemResponse.data;
                    const $ = cheerio.load(itemData);
                    itemData = $('body').text();
                    // 改行でsplitして、trimして再結合する。
                    itemData = itemData.split('\n').map((line) => line.trim()).join(' ');
                    // 連続する空白を削除する。
                    itemData = itemData.replace(/\s+/g, ' ');
                    // 先頭から2k文字までで切り取る。
                    itemData = itemData.substring(0, 2048);
                    //console.log(itemLink);
                    returnData.push({ "role" : "note", "url": itemLink, "data": itemData });
                } catch (error) {
                    console.error(error); // エラーメッセージをログに出力
                }
            }
        }

        return returnData;
    } catch (error) {
        console.error(error.response.data); // エラーメッセージをログに出力
    }
}

// マニュアルページを表示する。
function showManual() {
    const readme = fs.readFileSync(join(__dirname, 'README.md'), 'utf8');
    changePage({ page: 'index', title: 'Hello, World!', data: { manual: readme } });
}

ipcMain.on('save-settings', async (event, arg) => {
    let writeData = '';
    for (const key in arg) {
        process.env[key] = arg[key];
        writeData += `${key} = ${arg[key]}\n`;
    }
    fs.writeFileSync('.env', writeData, 'utf8');
    dotenv.config();
    event.reply('settings-saved', '保存しました.');
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
