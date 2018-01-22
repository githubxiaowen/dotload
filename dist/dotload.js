System.register("constant", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var E_MKDIR, E_MKDIR_MSG, I_SERVER_ACCEPTED, I_SERVER_ACCEPTED_MSG;
    return {
        setters: [],
        execute: function () {
            exports_1("E_MKDIR", E_MKDIR = 100);
            exports_1("E_MKDIR_MSG", E_MKDIR_MSG = '创建文件夹失败，请检查服务器权限');
            exports_1("I_SERVER_ACCEPTED", I_SERVER_ACCEPTED = 200);
            exports_1("I_SERVER_ACCEPTED_MSG", I_SERVER_ACCEPTED_MSG = 'FILE ACCEPTED');
        }
    };
});
System.register("getSubFiles", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var _a, statSync, readdirSync, join, readFolder;
    return {
        setters: [],
        execute: function () {
            _a = require('fs'), statSync = _a.statSync, readdirSync = _a.readdirSync;
            join = require('path').join;
            /**
             * 读取指定目录下的文件夹列表
             * @param {*} dir
             * @return {Array} 文件夹下的文件名
             */
            exports_2("readFolder", readFolder = function (dir) {
                return readdirSync(dir)
                    .reduce(function (files, file) {
                    return statSync(join(dir, file)).isDirectory() ?
                        files.concat(readFolder(join(dir, file))) :
                        files.concat(join(dir, file));
                }, []);
            });
        }
    };
});
System.register("upload", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    /**
     *
     * @param {*} opt
     * @param {*} data  表单数据，对象表示，不需要上传表单的话之后可以挪走
     * @param {*} content  文件内容
     * @param {*} subpath
     * @param {*} callback
     */
    function _upload(opt, data, content, subpath, callback) {
        if (typeof content === 'string') {
            content = new Buffer(content, 'utf8');
        }
        if (!content instanceof Buffer)
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
        collect.push("Content-Disposition: form-data; name=\"file\"; filename=\"" + subpath + "\"" + CRLF + CRLF);
        collect.push(content);
        collect.push(CRLF + "--" + boundary + "--" + CRLF);
        collect.forEach(function (ele) {
            length += typeof ele === 'string' ? new Buffer(ele).length : ele.length;
        });
        opt.headers = Object.assign({}, opt.headers, {
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': length
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
    var fs, resolve, readFolder;
    return {
        setters: [],
        execute: function () {
            fs = require('fs');
            resolve = require('path').resolve;
            readFolder = require('./getSubFiles');
            exports_3("default", function (config) {
                var loadPromises = readFolder(config.from).map(function (file) { return new Promise(function (resolve, reject) {
                    fs.readFile(file, function (e, data) {
                        if (e)
                            reject(e);
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
            });
        }
    };
});
System.register("receiver", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var http, formidable, fs, mkdirp, _a, resolve, dirname;
    return {
        setters: [],
        execute: function () {
            http = require('http');
            formidable = require('formidable');
            fs = require('fs');
            mkdirp = require('mkdirp');
            _a = require('path'), resolve = _a.resolve, dirname = _a.dirname;
            exports_4("default", function (config) {
                var server = http.createServer(function (req, res) {
                    var handleError = function (e) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(e.toString());
                    };
                    if (req.url == '/') {
                        res.writeHead(200, {
                            'Content-type': 'text/html'
                        });
                        res.end('ready for files bro');
                    }
                    else if (req.url === '/upload' && req.method.toLowerCase() == 'post') {
                        var data = '';
                        var form_1 = new formidable.IncomingForm();
                        // fields为表单数据，files为文件数据
                        form_1.uploadDir = config.to;
                        form_1.parse(req, function (e, fields, files) {
                            if (e)
                                handleError(e);
                            // 只处理文件，暂不处理表单字段
                            var filename = files.file.name; //包含相对路径的文件名
                            var filePath = files.file.path;
                            // //更改文件名
                            fs.exists(resolve(form_1.uploadDir, dirname(filename)), function (exists) {
                                if (exists) {
                                    fs.rename(filePath, resolve(form_1.uploadDir, filename));
                                }
                                else {
                                    mkdirp(resolve(form_1.uploadDir, dirname(filename)), function (e) {
                                        if (e) {
                                            handleError(e);
                                        }
                                        fs.rename(filePath, resolve(form_1.uploadDir, filename));
                                    });
                                }
                            });
                            res.statusCode = 200;
                            res.end('FILE ACCEPTED');
                        });
                    }
                });
                server.listen(config.port, function () {
                    console.log("server listening at " + config.hostname + ":" + config.port);
                });
            });
        }
    };
});
System.register("index", ["upload", "receiver"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var upload_1, receiver_1;
    return {
        setters: [
            function (upload_1_1) {
                upload_1 = upload_1_1;
            },
            function (receiver_1_1) {
                receiver_1 = receiver_1_1;
            }
        ],
        execute: function () {
            exports_5("default", {
                upload: upload_1.default,
                createServer: receiver_1.default
            });
        }
    };
});
