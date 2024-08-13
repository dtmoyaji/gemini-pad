import fs from 'fs';
import { join } from 'path';
import * as fileUtils from './fileUtils.mjs';

fileUtils.config();

let labels = [];

function loadLabels() {
    let lang = process.env.APPLICATION_LANG;
    let filename = join(fileUtils.getAppDir(), `l10n/${lang}.json`);
    if(fs.existsSync(filename) === false) {
        filename = join(fileUtils.getAppDir(), `l10n/en.json`);
    }
    let data = fs.readFileSync(filename, 'utf8');
    labels = JSON.parse(data);
    return labels;
}

function localize(key) {
    let result = labels[key];
    if (result === undefined || result === null) {
        return key;
    }
    return result;
}

export {
    loadLabels,
    localize
};
