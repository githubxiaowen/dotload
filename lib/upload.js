import fs from 'fs'
import { resolve } from 'path'
import readFolder from './getSubFiles'

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
        content = new Buffer(content, 'utf8')
    }
    if (!content instanceof Buffer) throw Error('unable to upload non bufferable content')
    opt = opt || {}
    data = data || {}
    const CRLF = "\r\n"
    let length = 0
    let collect = []
    const boundary = '------xiaowen' + Math.random()
    // collect the form data
    collect.push(`--${boundary}${CRLF}`);
    Object.entries(data).forEach(([key, value]) => {
        collect.push(
            `Content-Disposition: form-data; name="${key}"${CRLF}${CRLF}
            ${value}${CRLF}
            --${boundary}${CRLF}
             `)
    });
    // single file
    collect.push(`Content-Disposition: form-data; name="file"; filename="${subpath}"${CRLF}${CRLF}`)
    collect.push(content)
    collect.push(`${CRLF}--${boundary}--${CRLF}`)

    collect.forEach(ele => {
        length += typeof ele === 'string' ? new Buffer(ele).length : ele.length
    });

    opt.headers = Object.assign({}, opt.headers, {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': length
    })

    // send data
    const http = opt.protocol === 'https:' ? require('https') : require('http');
    const req = http.request(opt, res => {
        const status = res.statusCode;
        let body = '';
        res
            .on('data', function (chunk) {
                body += chunk;
            })
            .on('end', function () {
                if (status >= 200 && status < 300 || status === 304) {
                    callback(null, body);
                } else {
                    callback(status);
                }
            })
            .on('error', function (err) {
                callback(err.message || err);
            });
    });
    collect.forEach(d => req.write(d));
    req.end();
}

export default (config, srcDir) => {
    const loadPromises = readFolder(srcDir).map(file => new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            _upload(config, null, data, file.replace(srcDir, './'), (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
    }))
    const startTimestamp = Date.now();
    Promise.all(loadPromises)
        .then(res => {
            console.log(`uploading task cost ${Date.now() - startTimestamp}ms`);
        }, err => {
            console.error(`upload failed for ${err}`);
        })
}