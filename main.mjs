import { renderFile } from 'ejs';
import { BrowserWindow, app, dialog, ipcMain, nativeTheme, screen, shell } from 'electron';
import fs, { writeFileSync } from 'fs';
import i18n from 'i18n';
import * as marked from 'marked';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import * as database from './database.mjs';
import * as fileUtils from './fileUtils.mjs';
import * as initializer from './initializer.mjs';
import { createAiModel, injectPersonality } from './models/modelController.mjs';
import packageInfo from './package.json' with { type: "json" };

// __dirnameを設定する。
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_MODEL_FOR_TITLING = 'gemini-1.0-pro'

let appEnv = initializer.initEnv();

i18n.configure({
    locales: ['en', 'ja', 'de', 'fr', 'es'],
    defaultLocale: 'en',
    directory: __dirname + '/l10n',
});
i18n.setLocale(process.env.APPLICATION_LANG);

let mainWindow;
let currentMarkdown = '';
let currentTitle = '';

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

    // Electron上の<a>タグをクリックしたときにデフォルトブラウザで開くようにする。
    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
    });

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
    let srcFile = join(fileUtils.getAppDir(), `views/${payload.page}.ejs`);
    renderFile(srcFile,
        {
            __: i18n.__,
            version: packageInfo.version,
            title: payload.title,
            data: payload.data,
            locale: process.env.APPLICATION_LANG,
            dirname: __dirname.replace(/\\/g, '/'),
            envParams: appEnv
        },
        {},
        function (err, str) {
            const tempFile = join(fileUtils.getAppDir(), 'temp/currentView.html');
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

    try {

        event.reply('show-loading-reply', 'loading');

        // チャットメッセージを生成する。
        let replyGetter = await createAiModel(process.env.GEMINI_MODEL);
        if (process.env.DEEP_RAG_MODE === 'true') {
            await injectPersonality('deeprag', replyGetter);
        } else {
            await injectPersonality(process.env.PERSONALITY, replyGetter);
        }
        let replyMessage = await replyGetter.invokeWebRAG(arg, event);
        // \\nを改行コードに変換する。
        replyMessage = replyMessage.replace(/\\n/g, '\n');
        event.reply('chat-reply', replyMessage);

        event.reply('show-loading-reply', 'loaded');

        // タイトルを取得する。
        console.log("タイトルを取得");
        let titleGetter = await createAiModel(GEMINI_MODEL_FOR_TITLING);
        await injectPersonality("titleMaker", titleGetter);
        await titleGetter.pushLine(titleGetter.ROLE_USER, arg);
        await titleGetter.pushLine(titleGetter.ROLE_ASSISTANT, replyMessage);
        let queryTitle = await titleGetter.invoke(`
            タイトルを考えて書き出してください。
            markdownは使わず、textで出力してください。
            タイトル ** ** で囲まないでください。
            30文字以内で簡潔な内容にしてください。
            タイトルだけ出力してください
            ${i18n.__("Answer in")}
        `);
        // タイトルの先頭に日付をYYYYMMDD_として追加する。日付は0埋めする。
        let date = new Date();
        let dateStr = date.getFullYear() + ('00' + (date.getMonth() + 1)).slice(-2) + ('00' + date.getDate()).slice(-2) + '_';
        queryTitle.content = dateStr + queryTitle.content;
        event.reply('chat-title-reply', queryTitle.content);
        currentTitle = queryTitle.content;

        // キーワードを取得する。
        console.log("キーワードを取得");
        let keywordGetter = await createAiModel(GEMINI_MODEL_FOR_TITLING);
        await injectPersonality(process.env.PERSONALITY, keywordGetter);
        await keywordGetter.pushLine(keywordGetter.ROLE_USER, arg);
        await keywordGetter.pushLine(keywordGetter.ROLE_ASSISTANT, replyMessage);
        let keywords = await keywordGetter.invoke(`
            会話内容について、SEOに効果的なキーワードを考えてください。
            ${i18n.__("Answer in")}
            `);

        // 会話履歴に追加する。
        database.putTalk(queryTitle.content, arg, replyMessage, keywords.content);
        let talkList = await database.getTalkList(process.env.HISTORY_LIMIT);
        event.reply('chat-history-reply', talkList);

        // ブックマークされた会話を取得する。
        let bookmarkedTalks = await database.getBookmarkedTalkList(process.env.HISTORY_LIMIT);
        event.reply('bookmarked-talks-reply', bookmarkedTalks);

    } catch (error) {
        console.log(error.message);
        // ダイアログを表示する。
        if (error.message === undefined) {
            dialog.showErrorBox('エラー', error);
        } else if (error.message.includes('Candidate was blocked due to SAFETY')) {
            dialog.showErrorBox('エラー', '質問が不適切な回答を生成するか、危険であると判断されたため、回答がブロックされました。\n質問を変更してください。');
        } else {
            dialog.showErrorBox('エラー', error.message);
        }
        showManual();
    }
});

// マニュアルページを表示する。
function showManual() {
    let filename = join(__dirname, `README.${process.env.APPLICATION_LANG}.md`);
    if (!fs.existsSync(filename)) {
        filename = join(__dirname, 'README.md');
    }
    console.log(filename);
    const readme = fs.readFileSync(filename, 'utf8');
    let pageInfo = {
        page: 'index',
        title: 'Hello, World!',
        locale: process.env.APPLICATION_LANG,
        data: {
            manual: readme
        }
    }
    changePage(pageInfo);
}

ipcMain.on('clip-response', async (event, arg) => {
    event.reply('clip-response', arg);
});

ipcMain.on('use-web', async (event, arg) => {
    let paramEntry = appEnv.find((entry) => entry.param_name === 'USE_SEARCH_RESULT');
    if (arg === 'selected') {
        paramEntry.param_value = 'true';
    } else {
        paramEntry.param_value = 'false';
    }
    initializer.saveEnv(appEnv);
    appEnv = fileUtils.config();
});

ipcMain.on('save-settings', async (event, arg) => {
    for (const key in arg) {
        appEnv.find((entry) => entry.param_name === key).param_value = arg[key];
    }
    initializer.saveEnv(appEnv);
    event.reply('settings-saved', '保存しました.');
    // リブートする。
    app.relaunch();
    app.quit();
});

ipcMain.on('talk-history-clicked', async (event, arg) => {
    const talk = await database.getTalk(arg);
    currentTitle = talk.title;
    currentMarkdown = talk.answer;
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
    currentMarkdown = arg;
    const html = marked.marked(arg);
    event.reply('markdown-to-html-reply', html);
});

ipcMain.on('manual-transfer', async (event, arg) => {
    let filename = join(__dirname, `README.${process.env.APPLICATION_LANG}.md`);
    if (!fs.existsSync(filename)) {
        filename = join(__dirname, 'README.md');
    }
    console.log(filename);
    const readme = fs.readFileSync(filename, 'utf8');
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

// Open a file dialog to select a markdown file
app.on('open-mdfile', async (event, arg) => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        });

        if (!result.canceled) {
            const mdfile = result.filePaths[0];
            const mdcontent = fs.readFileSync(mdfile, 'utf8');
            // 親ディレクトリと拡張子を除いたファイル名を取得する。
            currentTitle = path.basename(mdfile, '.md');
            const message = {
                title: currentTitle,
                content: mdcontent
            }
            mainWindow.webContents.send('open-mdfile-reply', message);
        }
    } catch (error) {
        console.error(error);
    }
});

app.on('save-mdfile-as', async (event, arg) => {
    try {
        dialog.showSaveDialog(mainWindow, {
            title: 'Save Markdown File',
            defaultPath: `${currentTitle}.md`,
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        }).then((result) => {
            if (!result.canceled) {
                fs.writeFileSync(result.filePath, currentMarkdown, 'utf8');
            }
        });
    } catch (error) {
        console.error(error);
    }
});

initializer.initDirectories();
initializer.initMenus();

