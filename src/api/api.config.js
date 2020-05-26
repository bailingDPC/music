const {getRecommendData} = require("./recommend/getrecommendData");
const {getRecommendDetailData} = require("./recommendDetail/getdetailData");
const {getSingerData} = require("./singer/getSingerData");
const {getSingerDetailData} = require("./singerDetails/getSingerDetailData");
const {getSongDetailData} = require("./songDetail/getSongDetail");
const {getLyric} = require("./lyric/getlyric");
const {getRankData} = require("./rank/getRankData");
const {getRankDetailData} = require("./rankDetail/getRankDetail");
const {getSearchResult} = require("./search/getSearchData");
const {getHotKey} = require("./hotKey/getHotKey");

module.exports = {
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
};
