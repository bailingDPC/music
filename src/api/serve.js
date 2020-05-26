const express = require("express");
const bodyParse = require("body-parser");

const { getRecommendData } = require("./recommend/getrecommendData");
const { getRecommendDetailData } = require("./recommendDetail/getdetailData");
const { getSingerData } = require("./singer/getSingerData");
const { getSingerDetailData } = require("./singerDetails/getSingerDetailData");
const { getSongDetailData } = require("./songDetail/getSongDetail");
const { getLyric } = require("./lyric/getlyric");
const { getRankData } = require("./rank/getRankData");
const { getRankDetailData } = require("./rankDetail/getRankDetail");
const { getSearchResult } = require("./search/getSearchData");
const { getHotKey } = require("./hotKey/getHotKey");

let app = express();
app.use(bodyParse.urlencoded({extended: true})); //使用中间件
app.all("*", function (req, res, next) {//解决跨域请求问题
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-with',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    if (req.method === "OPTIONS") {
        res.send(200);
        // eslint-disable-next-line no-console
        console.log("has option")
    } else {
        next()
    }
});

app.get("/api/recommendData", getRecommendData);
app.get("/api/recommendDetailData/:id", getRecommendDetailData);
app.get("/api/singerData", getSingerData);
app.post("/api/singerDetailData", getSingerDetailData);
app.post("/api/songDetailData", getSongDetailData);
app.post("/api/lyric", getLyric);
app.get("/api/rankData", getRankData);
app.get("/api/rankDetailData/:id", getRankDetailData);
app.get("/api/searchResult/:id", getSearchResult);
app.get("/api/hotKey", getHotKey);

app.listen(3000);
