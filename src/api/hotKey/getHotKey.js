const request = require("request");

module.exports = {
    getHotKey: function(req, res, err){
        request({
            methods: "GET",
            url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
            qs:{
                cgiKey: "GetHomePage",
                _: 1578402452097,
                data: `{"comm":{"g_tk":1321685650,"uin":1954968288,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}`
            }
        }, function(req, response, body){
            let searchKey=[];
            let data = JSON.parse(body);

            data.hotkey.data.vec_hotkey.forEach((item) => {
                searchKey.push({
                    key: item.query,
                    score: item.score
                })
            });
            res.send(searchKey);
        });
    }
};