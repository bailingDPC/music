<template>
    <div class="singer">
        <listview :data="singerlist" v-on:select="selectSinger"></listview>
        <router-view></router-view>
    </div>
</template>
<script>

import axios from "axios";
import Listview  from "../base/listview.vue"
import { mapMutations } from "vuex" //取得工具函数

export default {
    name: "singer",
    data(){
        return {
            singerlist: []
        }
    },
    created(){
        //请求数据
        axios.get("http://localhost:9527/api/singerData").then( data => {
            this.singerlist = data.data;
        })
    },
    methods: {
        selectSinger(singerItem){ //由子组件的点击事件触发的父组件事件
            this.$router.push({
                path: `/singer/${singerItem.singer_mid}` //变更路由，触发子组件
            });
            this.setsinger(singerItem); //存储数据， 存储基本的歌手信息
        },
        ...mapMutations({ //绑定对应的方法
            setsinger: "SET_SINGER"
        })
    },
    components: {
        Listview
    }
}
</script>

<style lang="stylus" scoped>
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>