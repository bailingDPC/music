const request = require("request");
const { JSDOM } = require("jsdom");
const { songTable } = require("./songTable");

function getSongDetailData(req, res, err) {
    let body = JSON.parse(Object.keys(req.body)[0]); //s 数据格式转化
    songTable.find({
        songMid: body.mid
    }).then((data) => {
        if (Number(data) === 0) {
            // eslint-disable-next-line no-console
            console.log("此时数据库中---->歌曲数据----->没有数据");
            // eslint-disable-next-line no-console
            console.log(body.mid);
            request({
                method: "GET",
                url: "https://i.y.qq.com/v8/playsong.html",
                qs: {
                    songmid: body.mid
                },
                headers: {
                    "user-agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1`
                }
            }, function (err, response, body) {
                let dom = new JSDOM(body, { runScripts: "dangerously" });
                let songData = dom.window.songlist[0];
                let finalData = {
                    songMid: songData.songmid,
                    m4aUrl: songData.m4aUrl,
                    songName: songData.songname,
                    playTime: songData.playTime,
                    songPic: songData.pic
                };
                // eslint-disable-next-line no-console
                console.log("歌曲数据------>请求成功");
                res.send(finalData);
                songTable.create(finalData);
            });
        } else {
            // eslint-disable-next-line no-console
            console.log("数据库中已有---->歌曲数据---->且获取成功");
            res.send(data);
        }
    })
}

module.exports = {
    getSongDetailData
};
