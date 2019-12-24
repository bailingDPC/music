import Vue from "vue"
import Router from "vue-router"
import Rank from "../components/rank/rank.vue"
import Search from "../components/search/search.vue"
import Singer from "../components/singer/singer.vue"
import Recommend from "../components/recommend/recommend.vue"
//引入基本子组件

Vue.use(Router) //引入Router中间件

export default new Router({
    routes:[{
        path: "/",
        redirect: "/recommend" //默认跳转到推荐页面
    },{
        path: "/rank",
        component: Rank,
    },{
        path: "/search",
        component: Search
    },{
        path: "/singer",
        component: Singer
    },{
        path: "/recommend",
        component: Recommend
    }]
})