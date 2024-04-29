// package.js
const { execSync } = require('child_process');
const fs = require('fs');

const patterns = fs.readFileSync('.packageignore', 'utf-8').split('\n').filter(Boolean);
const ignoreArgs = patterns.map(pattern => `--ignore=${pattern}`).join(' ');

const command = `electron-packager . --overwrite --platform=win32 --arch=x64 --prune=true --out=release-builds ${ignoreArgs}`;

console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
