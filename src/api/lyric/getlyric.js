const request = require("request");
module.exports={
    getLyric:function (req,res,err) {
        let body= JSON.parse(Object.keys(req.body)[0]);//s 数据格式转化


        // https://y.qq.com/portal/player.html   //获取歌词数据
        request({
            url:"https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
            qs:{
                "-": "MusicJsonCallback_lrc",
                pcachetime: 1578234685605,
                songmid: body.songMid,
                g_tk: 20789661,
                loginUin: 1954968288,
                hostUin: 0,
                format: "json",
                inCharset: "utf8",
                outCharset: "utf-8",
                notice: 0,
                platform: "yqq.json",
                needNewCode: 0,
            },
            headers:{
                referer: "https://y.qq.com/portal/player.html"
            }
        },function (error,response,body) {
            if(JSON.parse(body).lyric){
                res.send(new Buffer(JSON.parse(body).lyric, 'base64').toString());
            }
        })
    }
};