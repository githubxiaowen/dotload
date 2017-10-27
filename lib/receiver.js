const http = require('http')
const formidable = require('formidable')
const fs = require('fs')
const { resolve, dirname } = require('path')
const mkdirp = require('mkdirp')
const parseRequest = require('./parseRequest')
module.exports=config => {
    const server = http.createServer((req, res) => {
        const handleError = (err) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' })
            res.end(err.toString());
        }
        if (req.url == '/') {
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end('ready for files bro');
        }
        else if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
            // console.log(req)
            var data='';
            req.on('data',chunk=>data+=chunk)
                .on('end',function(){
                    console.log(data)
                })
            const form = new formidable.IncomingForm();
            // fields为表单数据，files为文件数据
            form.uploadDir = config.to;
            form.parse(req, (err, fields, files) => {
                if (err) handleError(err)
                // 只处理文件，暂不处理表单字段
                var filename = files.file.name; //包含相对路径的文件名
                var filePath = files.file.path;
                // //更改文件名
                fs.exists(resolve(form.uploadDir, dirname(filename)), function (exists) {
                    if (exists) {
                        fs.rename(filePath, resolve(form.uploadDir, filename));
                    }
                    else {
                        mkdirp(resolve(form.uploadDir, dirname(filename)), function (err) {
                            if (err) {
                                handleError(err);
                            }
                            fs.rename(filePath, resolve(form.uploadDir, filename));
                        });
                    }
                })
                res.statusCode = 200;
                res.end('FILE ACCEPTED');
            })
        }
    })
    server.listen(config.port, () => {
        console.log(`server listening at ${config.hostname}:${config.port}`);
    })
}

// for test
// createServer(require('../config'));