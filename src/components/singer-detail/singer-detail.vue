<template>
  <!-- 增加个转场动画 -->
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songList="songList"></music-list>
  </transition>
</template>

<script>
import MusicList from "../music-list/music-list";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
    name: "singer-detail",
    computed: {
        title(){
            return this.singer.singer_name
        },
        bgImage(){
            return this.singer.singer_pic
        },
        mid(){
            return this.singer.singer_mid
        },
        ...mapGetters([
            "singer"  //与store里面的getter进行绑定
        ])
    },
    data(){
        return {
            songList: []//具体的歌曲信息
        }
    },
    created(){
        // eslint-disable-next-line no-console
        console.log(this.singer);
        this._getDetail(this.mid)
    },
    methods: {
        _getDetail(mid){
            // eslint-disable-next-line no-console
            console.log("激活请求", mid);
            let data = {
                mid: mid
            };
            axios.post(`http://localhost:9527/api/singerDetailData`, JSON.stringify(data)).then((data) => {

                this.songList = data.data.songList;
                // eslint-disable-next-line no-console
                console.log(data, "歌手详情数据请求成功"); //这个数据需要转一次包
            })
        }
    },
    components: {
        MusicList
    }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active 
        transition: all 0.3s;

    .slide-enter, .slide-leave-to 
        transform: translate3d(100%, 0, 0);
</style>