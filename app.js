const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const {
    getHotKey,
    getSearchResult,
    getRankDetailData,
    getRankData,
    getLyric,
    getSongDetailData,
    getSingerDetailData,
    getSingerData,
    getRecommendData,
    getRecommendDetailData,
} = require("./src/api/api.config");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "dist")));

app.all("*", function (req, res, next) {//解决跨域请求问题
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        // 'Access-Control-Allow-Headers': 'X-Requested-with',
        'Access-Control-Allow-Headers': 'Content-Type',
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

app.listen(9527);
