import * as types from "./mutation-type"; //这样后期可以通过对象属性的方式访问，简单明了

const mutations = {
    [types.SET_SINGER](state, singerData){
        state.singer = singerData;
    },
    [types.SET_PLAYING_STATE](state, flag){
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag){
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list){
        state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state, list){
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode){
        state.playMode = mode;
    },
    [types.SET_CURRENT_INDEX](state, index){
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc;
    },
    [types.SET_TOPLIST](state, toplist){
        state.topList = toplist;
    }
};

export default mutations;