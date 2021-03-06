<template>
    <div class= "player" v-show= "playlist.length>0">

        <transition name= "normal"
                    @enter = "enter"
                    @after-enter = "afterEnter"
                    @leave = "leave"
                    @after-leave = "afterLeave">
        <div class= "normal-player" v-show = "fullScreen"> <!-- 全屏播放器 -->
            <div class= "background">
                <!-- 大的背景图 占据所有 -->
                <img :src = "songData.songPic" alt= "" width= "100%" height= "100%">
            </div>
            <div class= "top">
                <div class= "back" @click = "back"> <!-- 返回按钮 -->
                    <i class= "icon-back"></i>
                </div>
                <h1 class= "title" v-html = "songData.songName"></h1> <!-- 歌曲名称 -->
                <h2 class= "subtitle" v-html = "singer.singer_name"></h2> <!-- 歌手名称 -->
            </div>
            <div class= "middle"
                @touchstart.prevent = "middleTouchStart"
                @touchmove.prevent= "middleTouchMove"
                @touchend = "middleTouchEnd">
                <!-- 增加touch事件， 使得歌曲cd的部分和歌词部分可以滑动切换 -->
                <div class= "middle-l" ref = "middleL">
                    <div class= "cd-wrapper" ref= "cdWrapper"> <!-- 歌曲唱片设计 -->
                        <div class= "cd" :class = "cdClass">
                            <img :src = "songData.songPic" alt= "" class= "image">
                        </div>
                    </div>
                    <!-- CD主界面下方的主题歌词 -->
                    <div class="playing-lyric-wrapper">
                        <div class="playing-lyric">{{ playingLyric }}</div>
                    </div>
                </div>
                <!-- 歌词模块 -->
                <scroll class="middle-r"
                        ref="lyricList"
                        :data = "currentLyric && currentLyric.lines">
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p  ref="lyricLine"
                                class="text"
                                :class="{'current': currentLineNum === index}"
                                v-for = "(line, index) in currentLyric.lines"
                                :key = "index"
                                >{{ line.txt }}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class= "bottom">
                <div class= "progress-wrapper">
                    <span class= "time time-l"> {{ format(currentTime) }} </span>
                    <div class= "progress-bar-wrapper">
                        <progressbar :percent = "percent" @percentChange = "onProgressBarChange"></progressbar> <!-- 调用进度条组件 -->
                    </div>
                    <span class= "time time-r"> {{ songData.playTime }} </span>
                </div>
                <div class= "operators"><!-- 控制按钮区 -->
                    <div class= "icon i-left">
                        <i :class= "iconMode" @click = "changeMode"></i><!-- 顺序播放 -->
                    </div>
                    <div class= "icon i-left" :class = "disableCls">
                        <i class= "icon-prev" @click = "prev"></i><!-- 上一首 -->
                    </div>
                    <div class= "icon i-center" :class = "disableCls">
                        <i :class= "playIcon" @click = "togglePlaying"></i><!-- 播放按钮 -->
                    </div>
                    <div class= "icon i-right" :class = "disableCls">
                        <i class= "icon-next" @click = "next"></i><!-- 下一首 -->
                    </div>
                    <div class= "icon i-right">
                        <i class= "icon icon-not-favorite"></i><!-- love -->
                    </div>
                </div>
            </div>
        </div>
        </transition>

        <transition name= "mini">
        <div class= "mini-player" v-show= "!fullScreen" @click = "open"> <!-- 迷你播放器 -->
            <div class= "icon">
                <img :src= "songData.songPic" :class= "cdClass" alt= "" width= "40" height= "40"> <!-- 小型唱片 -->
            </div>
            <div class= "text">
                <h2 class= "name" v-html= "songData.songName" ></h2>
                <p class= "desc" v-html= "singer.singer_name" ></p>
            </div>
            <div class= "control">
                <progressCircle :radius = "radius" :percent = "percent">
                    <i :class= "miniIcon" @click.stop = "togglePlaying" class= "icon-mini"></i> <!-- 迷你播放器的播放按钮 阻止冒泡 -->
                </progressCircle>
            </div>
            <div class= "control">
                <div class= "icon-playlist"></div>
            </div>
        </div>
        </transition>
        <audio :src= "songData.m4aUrl" ref= "audio" @canplay = "ready" @error = "error" @timeupdate = "updateTime" @ended= "end"></audio>
    </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import animations from "create-keyframe-animation"; // 引入动画库
import progressbar  from "../base/progress-bar"; //导入进度条组件
import progressCircle from "../base/progress-circle"; //导入圆型进度条组件
import Scroll from "../base/scroll"; //导入滚动组件

import Lyric from "lyric-parser";  //导入歌词解析模块
import { playMode } from "../../common/js/config"; //导入播放模式的基本参数， 避免出错
import { shuffle } from "../../common/js/util";

import { prefixStyle } from "../../common/js/dom"; //样式的兼容性处理


const transform = prefixStyle('transform'); //样式的兼容性处理
const transitionDuration = prefixStyle('transitionDuration'); //样式的兼容性处理

export default {
    name: "player",
    computed: {
        ...mapGetters([
            "fullScreen",
            "playlist",
            "currentSong", //获取当前歌曲数据
            "singer",
            "playing",
            "currentIndex", //获取当前歌曲的索引值
            "playMode", // 歌曲的播放模式
            "sequenceList", //获取默认的顺序列表
        ]),
        playIcon(){ //更改播放按钮的logo图,每次playing的值发生变化， 就返回一个新的字符串， 改变元素的类名
            return this.playing?"icon-pause": "icon-play"
        },
        miniIcon(){
            return this.playing?"icon-pause-mini": "icon-play-mini"
        },
        cdClass(){  //通过控制类名 来控制cd图的旋转， 全屏播放器和迷你播放器都要旋转起来
            return this.playing? "play": "play pause"
        },
        disableCls(){
            return this.songReady ? "" : "disable";
        },
        percent(){
            return this.currentTime / this.totalTime;
        },
        iconMode(){
            return this.playMode === playMode.sequence ? "icon-sequence" : this.playMode === playMode.loop ? "icon-loop" : "icon-random";
            //判断返回值
        }
    },
    data(){
        return {
            songData: {},
            songReady: false, //歌曲是否可以开始播放， 默认为 false
            currentTime: 0, // 默认的播放时间
            totalTime: 0, //歌曲总时间
            radius: 32, //定义圆型的进度条组件的基本尺寸
            currentLyric: null,//定义变量， 存储当前歌曲的歌词信息
            currentLineNum: 0, //歌词所在行
            currentShow: "cd", //当前显示专辑cd还是歌词， 默认就是cd
            touch:{}, //存储后期手指滑动时的位置等参数
            playingLyric: "", //CD主界面的 单条歌词
        }
    },
    methods: {
        ...mapMutations({
            setFullScreen: "SET_FULL_SCREEN",
            setPlayingState: "SET_PLAYING_STATE",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAYLIST"
        }),
        end(){
            //歌曲播放完成
            if(this.playMode===playMode.loop){
                //如果是循环模式
                this.loop();//
            }else {
                //非循环模式
                this.next();//下一首
            }
        },
        loop(){
                this.$refs.audio.currentTime=0;//播放时间归零
                this.$refs.audio.play();//重新播放
        },
        changeMode(){
            // eslint-disable-next-line no-console
            console.log("点击切换模式");
            let nowMode = (this.playMode+1) % 3;// 每点击一次, 值加一, 然后求模3
            this.setPlayMode(nowMode); // 设置播放模式的值
            let list = null;//定义一个空列表, 用来存储根据播放模式不同设置的不同的列表顺序数据
            // eslint-disable-next-line no-console
            console.log("nowMode",nowMode);
            if(nowMode===playMode.random){
                //打乱数组, 这个打乱的功能咱们专门定义一个函数来实现,我们统一写在 common>js的里面
                list=shuffle(this.sequenceList);
            }else {
                list = this.sequenceList;//顺序播不用设置
            }
            this.resetCurrentIndex(list,this.currentSong);
            //但是重新设置之后, 咱们当前的歌曲的索引值
            this.setPlayList(list);
        },
        resetCurrentIndex(list,song){
            // eslint-disable-next-line no-console
            console.log(list);
            // eslint-disable-next-line no-console
            console.log(song);
            let index = list.findIndex((item)=>{
                return item.songMid===song.songMid;// 匹配songMid一致的值
            });
            // eslint-disable-next-line no-console
            console.log(index);
            this.setCurrentIndex(index);
            //但是这里会有一些问题, 我们改变了index的值, 随之而来的currentsong也会重新激活, 那么就要重新播放
            // 所以我们监听一下, 当currenSong发现值变化了,但是songMid一致的情况下, 那么就不用变了
            // 所以就在watch里面修改一下currentSong的逻辑
        },
        onProgressBarChange(percent) {
            //子组件传递过来的数据
            // eslint-disable-next-line no-console
            console.log("player组件的百分比", percent)
            // eslint-disable-next-line no-console

            this.$refs.audio.currentTime = Math.floor(this.totalTime * percent);
            if (!this.playing) { // 如果我们拉动进度的条的时候歌曲没有在播放, 那么就把它设置为播放
                this.togglePlaying()
            }
            if(this.currentLyric){
                //歌词开始实现歌曲的跳转,单位是毫秒
                this.currentLyric.seek(this.$refs.audio.currentTime*1000);
            }
        },
        format(time){
            let min = Math.floor(time / 60);
            let second = Math.floor(time % 60);
            if( min < 10){
                min = '0' + min
            }
            if( second < 10){
                second = '0' + second
            }
            return `${min}:${second}`;
        },
        updateTime(ev){
            this.currentTime = ev.target.currentTime; //获取当前音乐的播放时间， 这个时间一直都是秒数
        },
        open(){
            this.setFullScreen(true);
        },
        back(){
            this.setFullScreen(false);
        },
        _getPosAndScale(){
            //获取基本位置
            //定义小图元素的尺寸参数数据
            const targetWidth = 40;
            //定义小图元素的位置参数
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;

            //定义大图尺寸
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width; //计算大小图缩放比例
            const x = - (window.innerWidth / 2 - paddingLeft); // x 偏移量 大图到小图， 移动负值
            const y = window.innerHeight - paddingTop - width/2 - paddingBottom;// 向下移动， 为正值， 因为图形是原型， 所以高的一半也是宽的一半
            return {
                x,
                y,
                scale
            }
        },
        enter(el, done){
            //el: 绑定的元素
            //done: 执行下一个钩子， 和express中间件的 next 逻辑一致
            // eslint-disable-next-line no-console
            console.log(el,done);
            //获取基本参数
            const { x, y, scale } = this._getPosAndScale();

            //定义动画
            let animation = {
                // 从小图的位置， 挪动到大图的值;
                0: {
                    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0, 0, 0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0, 0, 0) scale(1)`
                }
            };

            animations.registerAnimation({
                name: "move", //动画名称
                animation, //动画内容
                prosets: {
                    duration: 400, //动画时间
                    easing: "linear" //动画速度
                }
            });
            animations.runAnimation(this.$refs.cdWrapper, "move", done);
            // 激活动画 cdWrapper 是 middle元素里面的class名称为 cd-wrapper 的元素
        },
        afterEnter(){
            animations.unregisterAnimation("move"); //执行完成动画后， 解除注册动画
            this.$refs.cdWrapper.style.animation = '' //清除动画内容
        },
        leave(el, done){
            this.$refs.cdWrapper.style.transition = "all 0.4s"; //设置基本的动画过渡时间
            const {x, y, scale} = this._getPosAndScale(); //获取基本参数
            this.$refs.cdWrapper.style["transform"] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`; //从小到大
            this.$refs.cdWrapper.addEventListener('transitionend', done); //监听动画是否结束， 结束之后执行下一步骤
        },
        afterLeave(){
            this.$refs.cdWrapper.style.transition = ""; //清除过渡时间
            this.$refs.cdWrapper.style["transform"] = ""; //清空动画
        },
        togglePlaying(){
            this.setPlayingState(!this.playing); //点击一次变更播放状态
            if(this.currentLyric){
                //当歌词存在的时候， 一起切换状态
                this.currentLyric.togglePlay();
            }
        },
        prev(){
            if(!this.songReady){ //当歌曲没有加载好的时候， 点击直接返回，使之无效化
                return ;
            }

            if(this.playlist.length === 1){
                //只有一首歌就循环播放
                this.loop();
            } else {
                let nowIndex = this.currentIndex - 1;
                if(nowIndex < 0) {
                    nowIndex = this.playlist.length - 1; //播放到第一首歌，就会到最后一首歌
                }
                this.setCurrentIndex(nowIndex); //设置当前索引值
                if(!this.playing){
                    this.togglePlaying();
                    // 当我们的播放器处于暂停的时候, 我们点击下一首的时候,也把音乐设置为暂停的状态
                    // 因为在默认的情况下我们更改了currentIndex,那么currentSong也会变
                    // currentSong的变化就会触发新的请求,接着就是播放新的歌
                    // 这种情况就会变成, 无论当前的播放是啥, 下一首都是播放, 但是这个没有触发playing的值,自然播放按钮的logo就不会变
                }
            }
            this.songReady = false; //复位
        },
        next(){
            if(!this.songReady){ //当歌曲没有加载好的时候， 点击直接返回，使之无效化
                return ;
            }
            if(this.playlist.length === 1){
                //只有一首歌就循环播放
                this.loop();
            }else {
                let nowIndex = this.currentIndex + 1;
                if (nowIndex > this.playlist.length) {
                    nowIndex = 0;//播放到最后一首了,就回到第一首歌
                }
                this.setCurrentIndex(nowIndex);//设置当前索引值
                if(!this.playing){
                    this.togglePlaying();
                    // 当我们的播放器处于暂停的时候, 我们点击下一首的时候,也把音乐设置为暂停的状态
                    // 因为在默认的情况下我们更改了currentIndex,那么currentSong也会变
                    // currentSong的变化就会触发新的请求,接着就是播放新的歌
                    // 这种情况就会变成, 无论当前的播放是啥, 下一首都是播放, 但是这个没有触发playing的值,自然播放按钮的logo就不会变
                }
            }
            this.songReady = false; //复位
        },
        ready(){
            this.songReady = true; //当audio元素激活了 canplay 之后， 自动把songReady 设置为true
        },
        error(){
            //如果播放歌曲加载失败， 手动将this.songReady 也设置为true, 方便继续点击下一首
            this.songReady = true;
        },
        handleLyric({lineNum, txt}){
            this.currentLineNum = lineNum; //设置当前的歌词行数， 在歌词模块实现当前行高亮的效果
            // eslint-disable-next-line no-console
            console.log(txt);
            if(lineNum > 5){
                let lineEl = this.$refs.lyricLine[lineNum-5]; //滚动到第5行时， 获取第一行的元素
                this.$refs.lyricList.scrollToElement(lineEl, 1000); //向上滚动， 滚动到把lineEl遮住的位置
            }else{
                this.$refs.lyricList.scrollTo(0, 0, 1000); //往上滚动几行
            }
            this.playingLyric = txt; //把当前行数的歌词, 设置为CD主界面的歌词
        },
        middleTouchStart(e){
                this.touch.initiated = true; //打开开关
                //获取手指触摸位置
                const touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
        },
        middleTouchMove(e){
            if (!this.touch.initiated) { //判断开关是否打开
                return
            }
            //获取手指滑动位置
            const touch = e.touches[0];
            //获取手指滑动的 偏移量
            const deltaX = touch.pageX - this.touch.startX;
            const deltaY = touch.pageY - this.touch.startY;

            //判断用户是水平还是垂直滑动, 垂直滑动则啥也不干
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }

            // 确定是水平滑动的时候, 就判断当前是啥状态, 如果是cd的话, 说明没有移动,
            // 如果是歌词的话, 那么就是已经移动了负的屏幕宽度
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;

            // 计算默认偏移量, 最小是不偏移, 最多偏移整个屏幕的宽度
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));

            //计算偏移的百分比, 用来设置CD模块的透明度, 并存储起来
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
            this.$refs.middleL.style.opacity = 1 - this.touch.percent;
            this.$refs.middleL.style[transitionDuration] = 0;

            //设置歌词部分的偏移量
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
            this.$refs.lyricList.$el.style[transitionDuration] = 0;

        },
        middleTouchEnd(){
            let offsetWidth;
            let opacity;
            if (this.currentShow === 'cd') {
                if (this.touch.percent > 0.1) { //偏移超过10%, 则进行切换
                    offsetWidth = -window.innerWidth;
                    opacity = 0;
                    this.currentShow = 'lyric';
                } else { // 不超过, 则不切换
                    offsetWidth = 0;
                    opacity = 1;
                }
            } else {
                if (this.touch.percent < 0.9) {//偏移超过10%, 则进行切换, 这是向右滑动, 实际偏移是变少了
                    offsetWidth = 0;
                    this.currentShow = 'cd';
                    opacity = 1;
                } else {// 不超过, 则不切换
                    offsetWidth = -window.innerWidth;
                    opacity = 0;
                }
            }
            //设置动画过渡时间
            const time = 300;
            //设置歌词部分的偏移量
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
            //设置CD部分的透明度和动画效果
            this.$refs.middleL.style.opacity = opacity;
            this.$refs.middleL.style[transitionDuration] = `${time}ms`;
            this.touch.initiated = false;
        }
    },
    watch:{
        currentSong(newSong, oldSong){
            //当currentSong数据更新之后， 利用当前的song里面的数据， 来发送进一步的请求， 得到具体的歌曲数据
            // eslint-disable-next-line no-console
            // console.log(this.currentSong.songMid);
            if(newSong.songMid === oldSong.songMid){
                return ;//如果改变后
            }
            if(this.currentLyric){
                // 如果， 已经存在了歌词对象， 就把之前存在的歌词定时器全部停掉
                this.currentLyric.stop();
            }
            let data = {
                mid: this.currentSong.songMid
            };
            axios.post("http://localhost:9527/api/songDetailData", JSON.stringify(data)).then((data) => {
                if(data) {
                    // eslint-disable-next-line no-console
                    console.log("歌曲信息获取成功");
                }
                // eslint-disable-next-line no-console
                console.log(data);
                // eslint-disable-next-line no-console
                console.log(Array.isArray(data.data));
                if(Array.isArray(data.data)){ //部分接口返回的是一个数组，表示有多个版本
                    this.songData = data.data[0];
                }else{
                    this.songData = data.data; //单独版本直接设置值;
                }
            })
        },
        songData(){
            // eslint-disable-next-line no-console
            console.log("songData数据已更新");
            // eslint-disable-next-line no-console
            console.log(this.songData.m4aUrl);

            //组合数据，向后端发送请求，获取歌词数据
            let data = {
                songMid: this.songData.songMid
            };

            // eslint-disable-next-line no-console
            console.log(data);
            axios.post("http://localhost:9527/api/lyric", JSON.stringify(data)).then((data) => {
                let lyric = data.data; //获取歌词数据
                // eslint-disable-next-line no-console
                // console.log(lyric);
                this.currentLyric = new Lyric(lyric, this.handleLyric); //获取Lyric的解析后的数据， 并设置一个回调函数
                // eslint-disable-next-line no-console
                console.log(this.currentLyric);
                if(this.playing){ //当歌曲处于播放状态时播放歌词
                    this.currentLyric.play(); //滚动歌词
                }
            }).catch(() => {
                //如果获取不到歌词数据
                // eslint-disable-next-line no-console
                console.log("歌词数据获取失败");
                this.currentLyric = null;
                this.currentLineNum = 0;
                this.playingLyric = ""
            });

            this.$nextTick(() => { //设置audio元素的src的瞬间， 资源还没加载好,贸然直接播放会出现问题
                this.$refs.audio.play();
            });

            // eslint-disable-next-line no-console
            console.log("歌曲总时间的字符串值:", this.songData.playTime);
            this.totalTime = Number(this.songData.playTime.split(":")[0]) * 60 + Number(this.songData.playTime.split(":")[1]);
            // eslint-disable-next-line no-console
            console.log("歌曲的总时间", this.totalTime);
        },
        playing(newPlaying){
            let audio = this.$refs.audio;
            newPlaying?audio.play(): audio.pause(); //根据播放状态改变播放情况
        }
    },
    components: {
        progressbar,
        progressCircle,
        Scroll
    }
}
</script>

<style lang= "stylus" scoped>
    @import "../../common/stylus/variable.styl"
    @import "../../common/stylus/mixin.styl"
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background

            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)

            .top
                position: relative
                margin-bottom: 25px

                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50

                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)

                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text

                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text

            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0

                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%

                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        height: 100%

                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%

                            &.play
                                animation: rotate 20s linear infinite

                            &.pause
                                animation-play-state: paused

                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center

                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l

                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden

                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center

                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium

                            &.current
                                color: $color-text

            .bottom
                position: absolute
                bottom: 50px
                width: 100%

                .dot-wrapper
                    text-align: center
                    font-size: 0

                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l

                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll

                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0

                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px

                        &.time-l
                            text-align: left

                        &.time-r
                            text-align: right

                    .progress-bar-wrapper
                        flex: 1

                .operators
                    display: flex
                    align-items: center

                    .icon
                        flex: 1
                        color: $color-theme

                        &.disable
                            color: $color-theme-d

                        i
                            font-size: 30px

                    .i-left
                        text-align: right

                    .i-center
                        padding: 0 20px
                        text-align: center

                        i
                            font-size: 40px

                    .i-right
                        text-align: left

                    .icon-favorite
                        color: $color-sub-theme

            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s

                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

            &.normal-enter, &.normal-leave-to
                opacity: 0

                .top
                    transform: translate3d(0, -100px, 0)

                .bottom
                    transform: translate3d(0, 100px, 0)

        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background

            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s

            &.mini-enter, &.mini-leave-to
                opacity: 0

            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px

                img
                    border-radius: 50%

                    &.play
                        animation: rotate 10s linear infinite

                    &.pause
                        animation-play-state: paused

            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden

                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text

                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d

            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px

                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d

                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>