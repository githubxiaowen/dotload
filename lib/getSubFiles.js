const { statSync, readdirSync } = require('fs')
const { join } = require('path')

/**
 * 读取指定目录下的文件夹列表
 * @param {*} dir
 * @return {Array} 文件夹下的文件名
 */
export const readFolder = dir =>
    readdirSync(dir)
    .reduce((files, file) =>
        statSync(join(dir, file)).isDirectory() ?
        files.concat(readFolder(join(dir, file))) :
        files.concat(join(dir, file)), []);
