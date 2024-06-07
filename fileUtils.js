const dotenv = require('dotenv');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { __ } = require('i18n');

function getAppDir() {
    let appDir = __dirname;
    if(appDir.endsWith('app.asar')){
        // app.asar.unpackedに置換
        appDir = appDir.replace('app.asar', 'app.asar.unpacked');
    }
    return appDir;
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

function getHomedir() {
    return os.homedir();
}

function getAppUserDir() {
    let homeDir = getHomedir();
    let appUserDir = path.join(homeDir, '.gemini-pad');
    return appUserDir;
}

function getEnvFilePath() {
    let homeDir = getHomedir();
    let envFilePath = path.join(homeDir, '.gemini-pad', '.env');
    return envFilePath;
}

function config(){
    dotenv.config({ path: getEnvFilePath() });
}

module.exports = {
    getAppDir,
    createDir,
    createEmptyFile,
    config,
    getEnvFilePath,
    getHomeDir: getHomedir,
    getAppUserDir
};
