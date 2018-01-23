module.exports = {
    hostname: 'localhost', //host ip
    port: 9001, // port
    method: 'POST',
    path: '/upload',
    to: '/Users/didi/work/github/dotload/target/', // 最后的/别忘了
    from: 'source/' // 使用相对路径，在根目录下执行
}
