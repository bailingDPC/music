const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { detailTable } = require("./detailTable");

module.exports = {
    getRecommendDetailData: function (req, res) {
        // eslint-disable-next-line no-console
        console.log("getRecommendDetailData api 运行了 ---------");
        detailTable
            .find({
                id: req.params.id
            })
            .then(data => {
                if (Number(data) === 0) {
                    request({
                        method: "GET",
                        url: "https://i.y.qq.com/n2/m/share/details/taoge.html",
                        qs: {
                            ADTAG: "newyqq.taoge",
                            id: req.params.id
                        }
                    }, function (err, response, body) {
                        let dom = new JSDOM(body, { runScripts: "dangerously" });
                        let songlist = dom.window.firstPageData;

                        let finalData = {};//存储待添加到数据库的数据
                        finalData.id = req.params.id;
                        finalData.cover = songlist.taogeData.picurl || songlist.taogeData.headurl; //设置封面
                        finalData.title = songlist.taogeData.title; //设置专辑标体
                        finalData.tag = []; //预设一个空的数据,存储专辑类型
                        finalData.songlist = []; //预设一个空的数据,存储专辑歌曲列表
                        songlist.taogeData.tag.forEach(item => {
                            finalData.tag.push({
                                id: item.id,
                                name: item.name
                            });
                        });
                        songlist.taogeData.songlist.forEach(item => {
                            let singer = [];
                            item.singer.forEach(singerList => {
                                singer.push(singerList);
                            });
                            finalData.songlist.push({
                                songMid: item.mid,
                                songName: item.name,
                                songAlbum: songlist.taogeData.title,
                                singer: singer
                            });
                        });
                        res.send(JSON.stringify(finalData));
                        detailTable.create(finalData);
                        // eslint-disable-next-line no-console
                        console.log("推荐页详情数据-------请求成功------服务器请求后返回");
                    });
                } else {

                    res.send(data[0]);
                    // eslint-disable-next-line no-console
                    console.log("推荐页详情数据-------请求成功------从数据库中查询返回")
                }
            })
    }
};