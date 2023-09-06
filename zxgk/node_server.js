const express = require("express");
const bodyParser = require("body-parser");
const {calCookie, calSuffix} = require("./algo");

app = express()
app.use(bodyParser.urlencoded({extended: true, limit: "1000mb"}));
app.use(bodyParser.json({limit: "1000mb"}));


app.post("/cookie", (req, res) => {
    let {cookie} = calCookie(req.body.html)
    console.log("获取cookie：", cookie)
    res.send({
        "cookie": cookie,
    })
})

app.post("/suffix", (req, res) => {
    console.log(req.body);
    let {cookie, suffix} = calSuffix(
        req.body.html, req.body.checkPath, req.body.postData
    )
    console.log("获取cookie suffix：", cookie, suffix);
    res.send({
        "cookie": cookie,
        "suffix": suffix
    })
})

app.listen(5699, function () {
    console.log("开始监听5699端口")
})