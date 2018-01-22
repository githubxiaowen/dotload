"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var fs = require("fs");
var mkdirp = require("mkdirp");
var formidable = require("formidable");
var _a = require('path'), resolve = _a.resolve, dirname = _a.dirname;
exports.createServer = function (config) { return __awaiter(_this, void 0, void 0, function () {
    var server;
    return __generator(this, function (_a) {
        server = http.createServer(function (req, res) {
            var handleError = function (e) {
                console.error(e);
                res.writeHead(200, {
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
            else if (req.url === '/upload' && (req.method || '').toLowerCase() == 'post') {
                var data = '';
                var form_1 = new formidable.IncomingForm();
                // fields为表单数据，files为文件数据
                form_1.uploadDir = config.to;
                console.log(config.to);
                if ((fs.existsSync(config.to))) {
                    console.log(config.to);
                    mkdirp(config.to, function (e) {
                        if (e)
                            handleError(e);
                        form_1.parse(req, function (e, fields, files) {
                            if (e)
                                handleError(e);
                            // 只处理文件，暂不处理表单字段
                            var filename = files.file.name; // 解析前的的相对路径文件名
                            var filePath = files.file.path; // 解析后的临时文件名
                            // 判断是否存在目标文件夹
                            fs.exists(resolve(form_1.uploadDir, dirname(filename)), function (exists) {
                                if (exists) {
                                    fs.rename(filePath, resolve(form_1.uploadDir, filename), function (e) {
                                        if (e)
                                            handleError(e);
                                        res.statusCode = 200;
                                        res.end('FILE ACCEPTED');
                                    });
                                }
                                else {
                                    mkdirp(resolve(form_1.uploadDir, dirname(filename)), function (e) {
                                        if (e)
                                            handleError(e);
                                        fs.rename(filePath, resolve(form_1.uploadDir, filename), function (e) {
                                            if (e)
                                                handleError(e);
                                            res.statusCode = 200;
                                            res.end('FILE ACCEPTED');
                                        });
                                    });
                                }
                            });
                        });
                    });
                }
                else {
                    handleError('folder not created yet');
                }
            }
        }).listen(config.port, function () {
            console.log("server listening at " + config.hostname + ":" + config.port);
        });
        return [2 /*return*/];
    });
}); };
