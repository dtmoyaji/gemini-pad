const { app } = require('electron');
const dotenv = require('dotenv');

dotenv.config();

// Import necessary modules
const menuItems = [
    {
        label: 'ファイル',
        submenu: [
            { role: 'quit', label: '終了' },
            {
                label: '再起動', click: () => {
                    app.relaunch();
                    app.exit();
                }
            }
        ]
    },
    {
        label: '編集',
        submenu: [
            { role: 'undo', label: '元に戻す' },
            { role: 'redo', label: 'やり直し' },
            { type: 'separator' },
            { role: 'cut', label: '切り取り' },
            { role: 'copy', label: 'コピー' },
            { role: 'paste', label: '貼り付け' },
            { type: 'separator' },
            {
                label: '設定', click: () => {
                    app.emit('change-page', {
                        page: 'settings',
                        title: 'Settings',
                        data: {
                            env: process.env
                        }
                    });
                }
            }
        ]
    },
    {
        label: '表示',
        submenu: [
            { role: 'reload', label: 'リロード' },
            { role: 'toggleDevTools', label: '開発者ツールの切り替え' },
            { type: 'separator' },
            { role: 'resetZoom', label: 'ズームのリセット' },
            { role: 'zoomIn', label: 'ズームイン' },
            { role: 'zoomOut', label: 'ズームアウト' }
        ]
    },
    {
        label: 'ウィンドウ',
        submenu: [
            { role: 'minimize', label: '最小化' },
            { role: 'close', label: '閉じる' }
        ]
    },
    {
        label: 'ヘルプ',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://electronjs.org');
                }
            },
            {
                label: 'Gemini AI Studio',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://aistudio.google.com/app/prompts/new_freeform');
                }
            }
        ]
    },

];

module.exports = menuItems;