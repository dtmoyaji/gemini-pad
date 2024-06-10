import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';



function getAppDir() {
    const __filename = fileURLToPath(import.meta.url);
    let appDir = path.dirname(__filename);
    if(appDir.endsWith('app.asar')){
        // app.asar.unpackedに置換
        appDir = appDir.replace('app.asar', 'app.asar.unpacked');
    }
    return appDir;
}

function createDir(path) {
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

export {
    config, createDir,
    createEmptyFile, getAppDir, getAppUserDir, getEnvFilePath
};

