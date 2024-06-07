const dotenv = require('dotenv');
const fileUtils = require('./fileUtils.js');
const fs = require('fs');
const { join } = require('path');

fileUtils.config();

let labels = [];

function loadLabels() {
    let lang = process.env.APPLICATION_LANG;
    let filename = join(__dirname, `l10n/${lang}.json`);
    if(fs.existsSync(filename) === false) {
        filename = join(__dirname, `l10n/en.json`);
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

module.exports = {
    loadLabels,
    localize
};
