<template>
  <div class="head">
    <div v-if="back" class="back-btn" @click="$router.back()">返回上一级</div>
    <p>威远县秸秆资源数字化系统</p>
    <img src="@/assets/eixt.png" alt="" class="out" @click="$router.push('/')" />
    <img src="@/assets/refresh.png" alt="" class="refresh" @click="$router.go(0)" />
    <img class="full" v-if="!isfull" style="cursor: pointer" src="@/assets/full.png" @click="handleFullScreen" alt="" />
    <img class="full" v-else style="cursor: pointer" src="@/assets/nofull.png" @click="handleFullScreen" alt="" />
  </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
  name: 'ViewHeader',
  props: {
    back: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isfull: false,
    }
  },
  methods: {
    handleFullScreen() {
      if (!screenfull.isEnabled) {
        ElMessage.warning('您的浏览器不支持全屏功能')
        return
      }
      screenfull.toggle()
    },
    changeIcon() {
      this.isfull = screenfull.isFullscreen
    },
    keydownF11(event) {
      if (event.code === 'F11') {
        event.preventDefault() // 阻止F11原生全屏
        screenfull.toggle()
      }
    },
  },
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.changeIcon)
      this.isfull = screenfull.isFullscreen
    }
    window.addEventListener('keydown', event => this.keydownF11(event))
  },
  beforeMount() {
    window.removeEventListener('keydown', event => this.keydownF11(event))
  },
}
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  height: 100px;
  position: relative;
  background: url('@/assets/top.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 10;
  position: relative;
  .back-btn {
    position: absolute;
    top: 28px;
    left: 36px;
    font-size: 18px;
    width: 166px;
    height: 50px;
    line-height: 50px;
    text-align: right;
    padding-right: 20px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    background-image: url('@/assets/back-btn.png');
    background-size: 100% 100%;
    z-index: 20;
  }
  .out,
  .refresh,
  .full {
    position: absolute;
    top: 45px;
    right: 50px;
    cursor: pointer;
  }
  .full {
    right: 100px;
    width: 26px;
    height: 26px;
    padding: 5px;
  }
  .refresh {
    right: 150px;
    padding: 5px;
    width: 26px;
    height: 26px;
  }
}
.head > p {
  line-height: 36px;
  font-size: 36px;
  font-family: YouSheBiaoTiHei;
  // font-weight: bold;
  color: #ffffff;
  margin-top: 15px;
  text-shadow: 0px 0px 10px #333333;

  background: linear-gradient(#7ad6fc 0%, #ffffff 49.4384765625%);
  -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
}
</style>
