const { renderFile } = require('ejs');
const { BrowserWindow, app, ipcMain, screen } = require('electron');
const { writeFileSync } = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const database = require('./database.js');
const initializer = require('./initializer.js');
const marked = require('marked');

let mainWindow;

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
            preload: join(__dirname, 'preload.js'),
            contextIsolation: true,
            contentSecurityPolicy: "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com"
        }
    });


    // Open DevTools (optional)
    if (process.env.DEV_CONSOLE_MODE === "true") {
        win.webContents.openDevTools();
    };

    // readme.mdを読み込んで格納する。
    const readme = fs.readFileSync(join(__dirname, 'README.md'), 'utf8');

    // Load your HTML file
    mainWindow = win;
    if (process.env.GEMINI_API_KEY === '' || process.env.GEMINI_API_KEY === undefined) {
        changePage({ page: 'settings', title: 'Hello, World!', data: { env: process.env } });
    } else {
        changePage({ page: 'index', title: 'Hello, World!', data: { manual: readme } });
    }
    return win;
}

// Event listener for when Electron has finished initialization
app.whenReady().then(async () => {
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
            data: payload.data
        },
        {},
        function (err, str) {
            const tempFile = join(__dirname, 'temp/currentView.html');
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
    console.log(arg); // prints "arg" in the console

    try {
        // 質問の回答を取得する。
        let replyMessage = await Gemini.queryGemini(arg);
        event.reply('chat-reply', replyMessage);

        // タイトルを取得する。
        let titleQuery = join('次の文に30文字以下の長さでタイトルを考えてください。\n---\n', arg, replyMessage);
        let queryTitle = await Gemini.queryGemini(titleQuery);
        event.reply('chat-title-reply', queryTitle);

        // キーワードを取得する。
        let keywordQuery = join(
            '次の文にSEOに効果的な10のキーワードを考えてください。\n---\n',
            'タイトル :',
            queryTitle,
            '\n---\n',
            arg, replyMessage);
        let keywords = await Gemini.queryGemini(keywordQuery);

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
    }
});

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


initializer.initEnv();
initializer.initDirectories();
initializer.initMenus();
