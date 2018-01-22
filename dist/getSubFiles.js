"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('fs'), statSync = _a.statSync, readdirSync = _a.readdirSync;
var join = require('path').join;
/**
 * 读取指定目录下的文件夹列表
 * @param {*} dir
 * @return {Array} 文件夹下的文件名
 */
exports.readFolder = function (dir) {
    return readdirSync(dir)
        .reduce(function (files, file) {
        return statSync(join(dir, file)).isDirectory() ?
            files.concat(exports.readFolder(join(dir, file))) :
            files.concat(join(dir, file));
    }, []);
};
