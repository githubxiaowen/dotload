import * as http from 'http'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as formidable from 'formidable'
const { resolve, dirname } = require('path')

export const createServer = async config => {
  const server = http.createServer((req, res) => {
    const handleError = e => {
      console.error(e)
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.end(e.toString());
    }
    if (req.url == '/') {
      res.writeHead(200, {
        'Content-type': 'text/html'
      });
      res.end('ready for files bro');
    }
    else if (req.url === '/upload' && (req.method || '').toLowerCase() == 'post') {
      var data = '';
      const form = new formidable.IncomingForm();
      // fields为表单数据，files为文件数据
      form.uploadDir = config.to;
      console.log(config.to)
      if ((fs.existsSync(config.to))) {
        console.log(config.to)
        mkdirp(config.to, e => {
          if (e) handleError(e)
          form.parse(req, (e, fields, files) => {
            if (e) handleError(e)
            // 只处理文件，暂不处理表单字段
            var filename = files.file.name // 解析前的的相对路径文件名
            var filePath = files.file.path // 解析后的临时文件名

            // 判断是否存在目标文件夹
            fs.exists(resolve(form.uploadDir, dirname(filename)), function (exists) {
              if (exists) {
                fs.rename(filePath, resolve(form.uploadDir, filename), e => {
                  if (e) handleError(e)
                  res.statusCode = 200
                  res.end('FILE ACCEPTED')
                });
              }
              else {
                mkdirp(resolve(form.uploadDir, dirname(filename)), function (e) {
                  if (e) handleError(e)
                  fs.rename(filePath, resolve(form.uploadDir, filename), e => {
                    if (e) handleError(e)
                    res.statusCode = 200
                    res.end('FILE ACCEPTED')
                  });
                });
              }
            })
          })
        })
      } else {
        handleError('folder not created yet')
      }
    }
  }).listen(config.port, () => {
    console.log(`server listening at ${config.hostname}:${config.port}`);
  })
}
