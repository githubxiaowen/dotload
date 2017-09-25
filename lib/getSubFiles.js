const fs = require('fs')
const path = require('path')
const readFolder = (dir) =>
    fs.readdirSync(dir)
        .reduce((files, file) =>
            fs.statSync(path.join(dir, file)).isDirectory() ?
                files.concat(readFolder(path.join(dir, file))) :
                files.concat(path.join(dir, file)),
        []);

module.exports = readFolder;
