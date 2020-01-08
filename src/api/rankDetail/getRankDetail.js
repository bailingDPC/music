const request = require("request");
const { JSDOM } = require("jsdom");

module.exports = {
    getRankDetailData: function(req, res, err) {
        let topId = req.params.id;
        request({
            url: "https://i.y.qq.com/n2/m/share/details/toplist.html",
            qs: {
                ADTAG: "myqq",
                from: "myqq",
                channel: 10007100,
                id: topId,
            }
        }, function(err, response, body){
            let dom = new JSDOM(body, { runScripts: "dangerously" });

            let data = dom.window.firstPageData;
            let finalData = {};
            finalData.headPicUrl=data.toplistData.headPicUrl;//歌单封面
            finalData.titleDetail=data.toplistData.titleDetail;// 歌单,名称
            finalData.songlist=[];
            data.songInfoList.forEach((item)=>{
                finalData.songlist.push({
                    songAlbum:item.album.name,
                    songMid:item.mid,
                    songName:item.title
                })
            });
            res.send(finalData);
        })
    }
};

