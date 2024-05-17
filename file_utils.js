const { app } = require('electron');
const path = require('path');
const fs = require('fs');

function getAppDir() {
    //const appDataPath = app.getPath('appData');
    //const appDir = path.join(appDataPath, 'gemini-pad').replace(/\\/g, '/');
    //return appDir;
    return __dirname;
}

function createDir(path) {
    console.log(`CURRENT DIR: ${__dirname}`);
    console.log(`CREATE DIR: ${path}`);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

function createEmptyFile(path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '', 'utf8');
    }
}

module.exports = {
    getAppDir,
    createDir,
    createEmptyFile
};
