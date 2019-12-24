<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import Mheader from "./components/m-header/m-header.vue"
import Tab from "./components/tab/tab.vue"
export default {
  components: {
    Mheader,
    Tab
  }
};
</script>

<style lang="stylus" scoped>

</style>
