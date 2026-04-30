<template>
  <div class="data-block-container">
    <div class="data-block-header">
      <p class="header-title">{{ title }}</p>
    </div>

    <div class="data-block-content">
      <template v-if="!loading">
        <slot> </slot>
      </template>

      <img v-else class="loading-icon" src="../../assets/load.gif" alt="加载中" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'container',
  props: {
    title: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.data-block-container {
  width: 100%;
  height: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  // background: #061736;
  background: #1a277a;
  position: relative;
  border-radius: 10px;
  .data-block-header {
    width: 100%;
    height: 52px;
    background: url('../../assets/blockBg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .header-title {
      margin-left: 70px;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 0px 0px 6px #016dff;
    }
  }

  .data-block-content {
    width: 100%;
    height: 83%;
    display: flex;
    justify-content: center;
    align-content: flex-start;

    .loading-icon {
      width: 257px;
      height: 257px;
    }
  }
}
</style>
