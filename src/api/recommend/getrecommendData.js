const { recommendTable } = require("./recommendTable")

function getRecommendData (req, res) {
    recommendTable
        .find({}, {
            __v: false,
            _id: false
        })
        .then((data) => {
            // eslint-disable-next-line no-console
            console.log("查询成功");
            res.send(JSON.stringify(data));
        })
        .catch(() => {
            // eslint-disable-next-line no-console
            console.log("查询失败");
        })
}

module.exports = {
    getRecommendData
}