const logger = require('/usr/spider/utils/logger').logger('node_server.js', 'debug');
const express = require("express");
const bodyParser = require("body-parser");
const {calCookie, calSuffix} = require("./algo");
const cluster = require('cluster');
const os = require('os');

const app = express();
app.use(bodyParser.urlencoded({extended: true, limit: "1000mb"}));
app.use(bodyParser.json({limit: "1000mb"}));

// 通过 cluster.isMaster 判断当前是否为主进程
if (cluster.isMaster) {
    const numCPUs = os.cpus().length - 2;

    console.log(`Master ${process.pid} is running`);

    // 根据 CPU 核心数创建多个子进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // 可根据需要重新启动子进程
        cluster.fork();
    });
} else {
    app.post("/cookie", (req, res) => {
        let html = req.body.html
        if(html.indexOf("$_ts.cd") == -1){
            logger.error("River Security html is Error")
            res.send({
                "cookie": null,
                "suffix": null,
                "error_message": "Please post the current html of River Security"
            })
            return false
        }
        let {cookie} = calCookie(html)
        logger.debug("获取cookie：", cookie)
        res.send({
            "cookie": cookie,
        })
    })

    app.post("/suffix", (req, res) => {
        let html = req.body.html
        if(html.indexOf("$_ts.cd") == -1){
            logger.error("River Security html is Error")
            res.send({
                "cookie": null,
                "suffix": null,
                "error_message": "Please post the current html of River Security"
            })
            return false
        }
        let {cookie, suffix} = calSuffix(
            html, req.body.checkPath, req.body.postData
        )
        logger.debug("获取cookie suffix：", cookie, suffix);
        res.send({
            "cookie": cookie,
            "suffix": suffix
        })
    })

    /**************************************启动服务**************************************/
    const port = 5699; // 替换为你希望的端口号
    const server = app.listen(port, () => {
        console.log(`Worker ${cluster.worker.id} is listening on port ${port}`);
        logger.debug(`瑞数加密服务启动, 监听地址为: http://localhost:${port}`);
    });
}
