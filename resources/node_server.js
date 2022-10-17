function formatPrint(a,b) {
    return a+'||'+b
}
const { get_cookie } = require('./rs_test');
const express = require('express');
const bodyParser = require('body-parser');
const iconv = require('iconv-lite');
const fs=require('fs');
const app = express();
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// env_js=fs.readFileSync('./rs.js','utf8');
/**************************************生成 cookie **************************************/
app.post('/api/cookie', multipartMiddleware, function (req, res) {
    let requestdata = req.body.requestdata
    if (!requestdata) {
        res.json({
            code: 404,
            errorMsg: 'param error',
            data: null
        });
    } else {
        try {
            result = get_cookie(requestdata);
            console.log("cookie：" + result)
            res.json({
                code: 200,
                errorMsg: 'success',
                data: result
            })
        } catch (e) {
            console.log(e);
            res.json({
                code: 500,
                errorMsg: 'internal error',
                data: null
            })
        }
    }
});

/**************************************启动服务**************************************/
const server = app.listen(8001, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(formatPrint(
        'INFO',
        `公示系统瑞数加密服务启动, 监听地址为: http://${host}:${port}`
        )
    )
});
