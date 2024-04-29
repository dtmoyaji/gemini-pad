const fs = require('fs');

function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function createEmptyFile(path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '', 'utf8');
    }
}

module.exports= { createDir, createEmptyFile };
