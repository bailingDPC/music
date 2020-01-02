const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// const { detailTable } = require("./detailTable");
const fs = require("fs");

request({
    method: "GET",
    // url: "https://y.qq.com/n/m/detail/taoge/index.html?ADTAG=myqq&from=myqq&channel=10007100&id=7256912512"
    url: "https://i.y.qq.com/n2/m/share/details/taoge.html?ADTAG=newyqq.taoge&id=7256912512"
}, function (err, res, body) {
    let dom = new JSDOM(body, { runScripts: "dangerously" });
    
    let songlist = JSON.stringify(dom.window.firstPageData);
    fs.writeFile(`${__dirname}/detail.json`, songlist, {
        encoding: "utf8"
    }, function (err) {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log("写入成功");
    })
})