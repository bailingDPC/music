const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // eslint-disable-next-line no-console
    console.log("连接成功")
}).catch((err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log("连接失败");
});

let recommendSchema = new Schema({
    category: {
        required: true,
        type: String
    },
    categoryList: [
        {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            cover: {
                type: String,
                required: true
            }
        }
    ]
});

let recommendData = mongoose.model("recommendData", recommendSchema);
module.exports = { //导出表
    recommendTable: recommendData
};
