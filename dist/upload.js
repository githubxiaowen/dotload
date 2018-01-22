"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var getSubFiles_1 = require("./getSubFiles");
/**
 *
 * @param {*} opt
 * @param {*} data  表单数据，对象表示，不需要上传表单的话之后可以挪走
 * @param {*} content  文件内容
 * @param {*} relativePath
 * @param {*} callback
 */
function _upload(opt, data, content, relativePath, callback) {
    if (typeof content === 'string') {
        content = new Buffer(content, 'utf8');
    }
    if (!(content instanceof Buffer))
        throw Error('unable to upload non bufferable content');
    opt = opt || {};
    data = data || {};
    var CRLF = "\r\n";
    var length = 0;
    var collect = [];
    var boundary = '------xiaowen' + Math.random();
    // collect the form data
    collect.push("--" + boundary + CRLF);
    Object.entries(data).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        collect.push("Content-Disposition: form-data; name=\"" + key + "\"" + CRLF + CRLF + "\n            " + value + CRLF + "\n            --" + boundary + CRLF + "\n             ");
    });
    // single file
    collect.push("Content-Disposition: form-data; name=\"file\"; filename=\"" + relativePath + "\"" + CRLF + CRLF);
    collect.push(content);
    collect.push(CRLF + "--" + boundary + "--" + CRLF);
    collect.forEach(function (ele) {
        length += typeof ele === 'string' ? new Buffer(ele).length : ele.length;
    });
    opt.headers = Object.assign({}, opt.headers, {
        'Content-Type': 'multipart/form-data; boundary=' + boundary
        // 'Content-Length': length
    });
    // send data
    var http = opt.protocol === 'https:' ? require('https') : require('http');
    var req = http.request(opt, function (res) {
        var status = res.statusCode;
        var body = '';
        res
            .on('data', function (chunk) {
            body += chunk;
        })
            .on('end', function () {
            if (status >= 200 && status < 300 || status === 304) {
                callback(null, body);
            }
            else {
                callback(status);
            }
        })
            .on('error', function (err) {
            callback(err.message || err);
        });
    });
    collect.forEach(function (d) { return req.write(d); });
    req.end();
}
exports.upload = function (config) {
    var loadPromises = getSubFiles_1.readFolder(config.from).map(function (file) { return new Promise(function (resolve, reject) {
        console.log('uploading file', file);
        fs.readFile(file, function (e, data) {
            if (e)
                reject(e);
            // 替换为相对路径
            _upload(config, null, data, file.replace(config.from, './'), function (e, data) {
                if (e)
                    reject(e);
                resolve(data);
            });
        });
    }); });
    var startTimestamp = Date.now();
    Promise.all(loadPromises)
        .then(function (res) {
        console.log("uploading task cost " + (Date.now() - startTimestamp) + "ms");
    }, function (err) {
        console.error("upload failed for " + err);
    });
};
