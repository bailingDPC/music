const request = require("request")
const { recommendTable } = require("./recommendTable")

request({
    method: "GET",
    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
    qs: {
        "cgikey": "GetHomePate",
        "_": 1577118284482,
        data: `{"comm":{"g_tk":519993230,"uin":1954968288,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"MusicHallHomePage":{"module":"music.musicHall.MusicHallPlatform","method":"MobileWebHome","param":{"ShelfId":[101,102,161]}},"hotkey":{"module":"tencent_musicsoso_hotkey.HotkeyService","method":"GetHotkeyForQQMusicMobile","param":{"remoteplace":"txt.miniapp.wxada7aab80ba27074","searchid":"1559616839293"}}}`
    }
}, async (err, req, body) => {
    await recommendTable.deleteMany({});
    let data = JSON.parse(body).MusicHallHomePage.data.v_shelf;
    data.forEach((item) => {
        let category = item.title_template;
        let categoryList = item.v_niche[0].v_card;
        let arr = [];
        categoryList.forEach((list) => {
            // console.log("详细ID:"+ list.id);
            // console.log("歌单名词:"+ list.title);
            // console.log("歌单封面地址:"+ list.cover);
            if (list.time) {
                arr.push({
                    id: list.time,
                    title: list.title,
                    cover: list.corer
                })
            } else {
                arr.push({
                    id: list.id,
                    title: list.title,
                    cover: list.cover
                })
            }

        });
        recommendTable.create({
            category: category,
            categoryList: arr
        }).then(()=>{
            // eslint-disable-next-line no-console
            console.log("写入成功");
        }).catch((err)=>{
            if(err) throw err; 
            // eslint-disable-next-line no-console
            console.log("写入失败");
        })
    });
})