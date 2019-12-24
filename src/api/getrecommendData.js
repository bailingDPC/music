const express = require("express")
const { recommendTable } = require("./recommendTable")
let app = express();

app.all("*", function (req, res, next) {//解决跨域请求问题
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-with',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    if(req.method === "OPTIONS"){
        res.send(200)
        // eslint-disable-next-line no-console
        console.log("has option")
    }else{
        next()
    }
});

app.get("/api/recommenddata", function(req, res){
    recommendTable
        .find({},{
            __v: false,
            _id: false
        })
        .then((data) => {
            // eslint-disable-next-line no-console
            console.log("查询成功");
            res.send(JSON.stringify(data));
        })
        .catch(() => {
            // eslint-disable-next-line no-console
            console.log("查询失败");
        })
})
app.listen(9527);