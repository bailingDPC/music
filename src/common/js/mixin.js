import { mapGetters } from "vuex"

export const playlistMixin = {
    computed: {
        ...mapGetters([
            "playlist" // 获取播放列表
        ])
    },
    mounted(){
        this.handlePlaylist(this.playlist)
    },
    activated(){
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal){
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist(){
            // 如果再引用组件的组件中实现了handlePlaylist的方法， 这个函数就不会被执行
            //若此函数没有执行就直接报错
            throw new Error("组件中需要实现handlePlaylist方法")
        }
    }
}