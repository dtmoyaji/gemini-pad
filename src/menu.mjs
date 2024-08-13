import electronPackage from 'electron';
import * as fileUtils from './fileUtils.mjs';
import * as l10n from './l10n.mjs';

const { app } = electronPackage;

fileUtils.config();

// Import necessary modules
let menuItems = [
    {
        label: 'File',
        submenu: [
            { role: 'quit', label: 'Quit' },
            {
                label: 'Open MDFile', click: () => {
                    app.emit('open-mdfile', {});
                }
            },
            {
                label: 'Save MDFile as', click: () => {
                    app.emit('save-mdfile-as', {});
                }
            },
            {
                label: 'Reboot', click: () => {
                    app.relaunch();
                    app.exit();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo', label: 'Undo' },
            { role: 'redo', label: 'Redo' },
            { type: 'separator' },
            { role: 'cut', label: 'Cut' },
            { role: 'copy', label: 'Copy' },
            { role: 'paste', label: 'Paste' },
            { type: 'separator' },
            {
                label: 'Settings', click: () => {
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
        label: 'View',
        submenu: [
            { role: 'reload', label: 'Reload' },
            { role: 'toggleDevTools', label: 'Toggle_Developer_Tools' },
            { type: 'separator' },
            { role: 'resetZoom', label: 'Reset_Zoom' },
            { role: 'zoomIn', label: 'Zoom_In' },
            { role: 'zoomOut', label: 'Zoom_Out' },
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize', label: 'Minimize' },
            { role: 'close', label: 'Close' }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About_Electron',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://electronjs.org');
                }
            },
            {
                label: 'Gemini_AI_Studio',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://aistudio.google.com/app/prompts/new_freeform');
                }
            }
        ]
    },

];

// menuItemsのラベルをローカライズする。
function localizeMenuItems() {
    l10n.loadLabels();
    let localizedMenuItems = [];
    for (let i = 0; i < menuItems.length; i++) {
        let menu = menuItems[i];
        let localizedMenu = {
            label: l10n.localize(menu.label),
            submenu: []
        };
        for (let j = 0; j < menu.submenu.length; j++) {
            let item = menu.submenu[j];
            if (item.type === 'separator') {
                localizedMenu.submenu.push({ type: 'separator' });
                continue;
            } else {
                localizedMenu.submenu.push({
                    role: item.role,
                    label: l10n.localize(item.label),
                    click: item.click
                });
            }
        }
        localizedMenuItems.push(localizedMenu);
    }
    return localizedMenuItems;
}

export {
    localizeMenuItems, menuItems
};
