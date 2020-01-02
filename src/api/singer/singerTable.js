const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/music", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // eslint-disable-next-line no-console
    console.log("连接成功");
}).catch((err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log("连接失败");
});

let singerSchema = new Schema({
    "singer_id": String, //歌手的id
    "singer_mid": String, //方便后期获取歌手的详细信息
    "singer_name": String,
    "singer_pic": String
});

let singer = mongoose.model("singer", singerSchema);

module.exports = {
    singerTable: singer
}