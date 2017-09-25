import fs from 'fs'
import {join} from 'path'
const readFolder = (dir) =>
    fs.readdirSync(dir)
        .reduce((files, file) =>
            fs.statSync(join(dir, file)).isDirectory() ?
                files.concat(readFolder(join(dir, file))) :
                files.concat(join(dir, file)),
        []);

export default readFolder;
