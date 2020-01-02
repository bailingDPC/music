const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { detailTable } = require("./detailTable");

function getDetailData(req, res) {
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
        detailTable.find({
            id: req.params.id
        }).then((data) => {
            if (data.length === 0) {
                // eslint-disable-next-line no-console
                console.log("当前数据库里没数据");
                let finalData = {};//存储待添加到数据库的数据
                finalData.id = songlist.taogeData.id;//设置歌单的id
                finalData.cover = songlist.taogeData.picurl;//设置歌单封面
                finalData.title = songlist.taogeData.title;//设置歌单的名称
                finalData.tag = [];//
                finalData.songlist = [];//
                finalData.tag = songlist.taogeData.tag;
                songlist.taogeData.songlist.forEach((item) => {
                    let singer = item.singer;
                    finalData.songlist.push({
                        singer: singer,
                        mid: item.mid,
                        name: item.name
                    })
                });
                res.send(JSON.stringify(finalData));
                detailTable.create(finalData);
            } else {
                // eslint-disable-next-line no-console
                console.log("当前数据库内有数据");
                res.send(JSON.stringify(data));
            }
        })
        // res.send(songlist);
    })
}

module.exports = {
    getDetailData
}