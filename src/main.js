import Vue from 'vue'
import App from './App.vue'
import Router from "./router/index.js"
import attachFastClick from "fastclick" //引入fastclick 解决移动端300ms延迟问题
import "./common/stylus/index.styl" //引入主stylus文件

attachFastClick.attach(document.body) //把该插件作用于整个body上
Vue.config.productionTip = false //阻止启动产生消息

new Vue({
  render: h => h(App),
  router: Router
}).$mount('#app')
