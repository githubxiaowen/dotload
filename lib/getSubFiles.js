const fs = require('fs')
const { join } = require('path')
export default readFolder = (dir) =>
    fs.readdirSync(dir)
        .reduce((files, file) =>
            fs.statSync(join(dir, file)).isDirectory() ?
                files.concat(readFolder(join(dir, file))) :
                files.concat(join(dir, file)),
        []);
