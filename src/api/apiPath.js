import global from "../config/global.config.js"

let apiPath = {
  getRecommendData: "/api/recommendData",
  getRecommendDetailData: "/api/recommendDetailData",
  getSingerData: "/api/singerData",
  getSingerDetailData: "/api/singerDetailData",
  getSongDetailData: "/api/songDetailData",
  getLyric: "/api/lyric",
  getRankData: "/api/rankData",
  getRankDetailData: "/api/rankDetailData",
  getSearchResult: "/api/searchResult",
  getHotKey: "/api/hotKey",
}

Object.keys(apiPath).forEach(key => {
  apiPath[key] = global.httpServer + apiPath[key]
});

export default apiPath