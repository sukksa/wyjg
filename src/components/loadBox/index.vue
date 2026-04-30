<template>
  <div class="control-wrapper-out" v-if="showLoading">
    <!-- <i class="el-icon-loading icon-loading c-white fz28"></i>
    <div class="c-white mt15 fz16">数据加载中...</div> -->
    <img :src="loadImg" class="load-img"  />
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>