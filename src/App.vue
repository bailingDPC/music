<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Mheader from "./components/m-header/m-header.vue";
import Tab from "./components/tab/tab.vue";
import player from "./components/player/player";

export default {
  components: {
    Mheader,
    Tab,
    player
  }
};
</script>

<style lang="stylus" scoped></style>
