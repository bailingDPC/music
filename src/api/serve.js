const express = require("express");
const bodyParse = require("body-parser");

const { getRecommendData } = require("./recommend/getrecommendData");
const { getDetailData } = require("./recommendDetail/getdetailData");
const { getSingerData } = require("./singer/getSingerData");
const { getSingerDetailData } = require("./singerDetails/getSingerDetailData");
const { getSongDetailData } = require("./songDetail/getSongDetail");

let app = express();
app.use(bodyParse.urlencoded({extended: false})); //使用中间件

app.all("*", function (req, res, next) {//解决跨域请求问题
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-with',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    if (req.method === "OPTIONS") {
        res.send(200)
        // eslint-disable-next-line no-console
        console.log("has option")
    } else {
        next()
    }
});

app.get("/api/recommenddata", getRecommendData);
app.get("/api/detaildata/:id", getDetailData);
app.get("/api/singerData", getSingerData);
app.post("/api/singerDetailData", getSingerDetailData);
app.post("/api/songDetailData", getSongDetailData);

app.listen(9527);