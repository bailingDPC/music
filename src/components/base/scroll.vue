<template>
    <div ref="wrapper">
        <slot></slot>
        </div>    
</template>

<script>
import BScroll from "better-scroll"
export default {
    props:{
        probeType:{
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        listenScroll: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: null
        },
        pullup: {
            type: Boolean,
            default: false
        },
        beforeScroll: {
            type: Boolean,
            default: false
        },
        refreshDelay: {
            type: Number,
            default: 20
        }
    },
    mounted(){
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll(){ //初始化
            if(!this.$refs.wrapper){ //没有值就直接return
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper,{
                probeType: this.probeType,
                click: this.click
            })

            if(this.listenScroll){
                
                this.scroll.on("scroll", (pos) => {
                    this.$emit("scroll", pos)
                })
            }
            
            if(this.pullup) {
                this.scroll.on("scrollEnd", () => {
                    if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
                        this.$emit("scrollToEnd")
                    }
                })
            }
            
            if(this.beforeScroll) {
                this.scroll.on("beforeScrollStart", () => {
                    this.$emit("beforeScroll")
                })
            }
        },
        disable(){
            this.scroll && this.scroll.disable()
        },
        enable(){
            this.scroll && this.scroll.enable()
        },
        refresh(){ //重新计算高度
            this.scroll && this.scroll.refresh()
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch: { //监听数据的变化
        data(){ //数据变化之后， 重新设置scroll高度， 延迟设置
            setTimeout(()=>{
                this.refresh()
            }, this.refreshDelay)
        }
    }
}
</script>

<style lang="stylus" scoped>

</style>