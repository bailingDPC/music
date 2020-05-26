const request = require("request");
// const fs = require("fs");
const { singerTable } = require("./singerTable");

request({
    method: "GET",
    url:"https://u.y.qq.com/cgi-bin/musicu.fcg",
    qs:{
        _ : "getUCGI36296772536464306",
        g_tk: 803236908,
        longinUin: 1954968288,
        hostUin: 0,
        format: "json",
        inCharset: "utf8",
        outCharset: "utf-8",
        notice: 0,
        platform: "y11.json",
        needNewCode: 0,
        data: `{"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}`
    }
}, function(err, res, body){
    let singerList = JSON.parse(body).singerList.data.singerlist;
    // eslint-disable-next-line no-console
    console.log(singerList);
    // fs.writeFile(`${__dirname}/demo.json`, JSON.stringify(singerList), {
    //     encoding: "utf8"
    // }, (err) => {
    //    if(err) throw err;
    //    // eslint-disable-next-line no-console
    //    console.log("写入成功");
    // })

    singerList.forEach((item) => { //数据写入数据库
        singerTable.create({
            "singer_id": item.singer_id,
            "singer_mid": item.singer_mid,
            "singer_name": item.singer_name,
            "singer_pic": item.singer_pic
        })
    })
});

