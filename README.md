# Node文件上传
### 原理
node本地读取文件内容，仿照form表单提交的过程，向配置了接收服务的远端机器发送POST请求，服务端通过formidable组件对请求内容解析，放置在配置好的目标文件夹下

### 表单格式
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
#### Server
1. install
npm i -S dotload
2. vim server.js

```
import {createServer} from 'dotload'
import config from './config'
createServer(config)
```
3. start server
```
pm2 start server.js --name receiverServer
```
### Client
1. install
npm i -S dotload
2. vim upload.js
```
import {upload} from 'dotload'
import config from './config'
const uploadPath='src/'
upload(config,uploadPath)
```
3. node upload.js


### References
[FormData](https://github.com/form-data/form-data)

[RFC](https://tools.ietf.org/html/rfc2046#section-5.1)
