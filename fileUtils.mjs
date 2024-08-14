import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import * as initializer from './initializer.mjs';

function getAppDir() {
    const __filename = fileURLToPath(import.meta.url);
    let appDir = path.dirname(__filename);
    if (appDir.endsWith('app.asar')) {
        // app.asar.unpackedに置換
        appDir = appDir.replace('app.asar', 'app.asar.unpacked');
    }
    return appDir;
}

function getProjectDir() {
    return getAppDir();
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

function config() {
    let envFilePath = getEnvFilePath();
    // .envファイルがなければ生成してパラメータを中に書き込む。
    if (!fs.existsSync(envFilePath)) {
        initializer.initEnv();
    }
    dotenv.config({ path: getEnvFilePath() });
    // .envファイルを読み込んで、envParamsとprocess.envに格納する。
    let envParams = initializer.getEnvParams();
    let envFileData = fs.readFileSync(getEnvFilePath(), 'utf8');
    for (let line of envFileData.split('\n')) {
        let [key, value] = line.split('=');
        if (key !== undefined && value !== undefined) {
            key = key.trim();
            value = value.trim();
            // process.envにkeyとvalueを設定する。
            process.env[key] = value;
            // envParamsのparam_name===keyのparam_valueをvalueに変更する。
            for (let envParam of envParams) {
                if (envParam.param_name === key) {
                    envParam.param_value = value;
                }
            }
        }
    }
    return envParams;
}

export {
    config, createDir,
    createEmptyFile, getAppDir, getAppUserDir, getEnvFilePath, getProjectDir
};

