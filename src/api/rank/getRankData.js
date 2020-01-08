const { rankTable } = require("./rankTables");

module.exports = {
    getRankData: function(req, res, err){
        rankTable.find({

        }).then((data) => {
            res.send(data);
        })
    }
};