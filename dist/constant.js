"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E_MKDIR = 100;
exports.E_MKDIR_MSG = '创建文件夹失败，请检查服务器权限';
exports.I_SERVER_ACCEPTED = 200;
exports.I_SERVER_ACCEPTED_MSG = 'FILE ACCEPTED';
/**
 *
 * @param {*} fn
 * @param {*} context
 * @param {*} args
 * eg:
 */
exports.c2p = function (fn, context) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        fn.apply(context, args, function (e, res) {
            if (e) {
                reject(e);
            }
            else {
                resolve(res);
            }
        });
    });
};
