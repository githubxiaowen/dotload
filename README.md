# Node文件上传
### How it works
Dotload reads files from local hard disk, post the formdata built by rfc rules to the remote server. Data will be parsed and saved to the disk as files. All you need is a *config.js*

### Simple Form Type
```
#First boundary
--<boundary><crlf>
# Field1
Content-Disposition:form-data; name="<fieldname1>"<crlf><crlf>
<value1><crlf>
--<boundary><crlf>
# Field2
Content-Disposition:form-data; name="<fieldname2>"<crlf><crlf>
<value2><crlf>
--<boundary><crlf>
# File1
Content-Disposition:form-data; name="<fieldname3>" filename="<filename1>"<crlf>
Content-Type: <mimetype><crlf><crlf>       #optional
<binary file data><crlf>
--<boundary><crlf>
# File2
Content-Disposition:form-data; name="<fieldname4>" filename="<filename2>"<crlf>
Content-Type: <mimetype><crlf><crlf>       #optional
<binary file data><crlf>
# Last boundary
--<boundary>--<crlf>
```
### Usage

edit config.js first
```js
module.exports = {
  hostname: 'localhost', //host ip
  port: 9000, // port
  method: 'POST',
  path: '/upload',
  to: '/Users/xiaowen/work/dotload/test/target/'
}
```
#### Server

1. install
npm i -S dotload
2. vim server.js

```js
const createServer = require('../lib/receiver')
const config = require('./config')
createServer(config)
```
3. start server
```js
pm2 start server.js --name receiverServer
```
### Client
1. install
npm i -S dotload
2. vim upload.js
```js
const upload = require('../lib/upload')
const config = require('./config')
const uploadPath='test/source/'
upload(config,uploadPath)
```
3. test
```js
node test/upload.js
```

# TODO
- [ ] remove the dependency of formidable ,parse the data using node
- [ ] callback 2 promise
### References
[FormData](https://github.com/form-data/form-data)

[RFC](https://tools.ietf.org/html/rfc2046#section-5.1)
