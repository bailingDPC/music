const { singerTable } = require("./singerTable");
function getSingerData(req, res){
    singerTable.find({}, {
        _id: false,
        __v: false
    }).then((data) => {
        res.send(JSON.stringify(data));
    })
}

module.exports = {
    getSingerData
}