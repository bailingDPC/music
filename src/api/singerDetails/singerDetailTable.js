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

const singerDetailSchema = new Schema({
    singer_name: {
        type: String,
        required: true
    },
    singer_mid: {
        type: String,
        required: true
    },
    singer_pmid: {
        type: String,
        // required: true,
    },
    singer_id: {
        type: Number,
        required: true
    },
    singerDesc: {
        type: String,
        required: true
    },
    songTotalNumber: {
        type: Number,
        required: true
    },
    fansTotalNumber: {
        type: Number,
        required: true
    },
    songList: [
        {
            songName: {
                type: String,
                required: true
            },
            songMid: {
                type: String,
                required: true
            },
            songAlbum: {
                type: String,
                required: true
            }
        }
    ]
});

let singerDetailTable = mongoose.model("singerdetails", singerDetailSchema);


module.exports = {
    singerDetailTable
}