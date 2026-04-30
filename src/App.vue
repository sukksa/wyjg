<template>
  <div class="screen-content" :style="contentStyle">
    <router-view></router-view>
  </div>
</template>

<script>
import VScaleScreen from 'v-scale-screen'
export default {
  components: { VScaleScreen },
  data() {
    return {
      baseWidth: 1920,
      baseHeight: 1080,
      contentStyle: {
        // width: `1920px`,
        // height: `1080px`,
        transform: 'scale(1, 1)',
        transformOrigin: 'left top',
      },
    }
  },
  mounted() {
    this.updateScale()
    window.addEventListener('resize', this.updateScale)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateScale)
  },
  // App.vue
  methods: {
    updateScale() {
      const currentHeight = window.innerHeight
      const scaleY = currentHeight / this.baseHeight
      this.contentStyle.transform = `scaleY(${scaleY})`

      window.currentScaleY = scaleY
      window.dispatchEvent(new CustomEvent('scale-change', { detail: { scaleY } }))
      document.documentElement.style.setProperty('--screen-scale-y', scaleY)
    },
  },
}
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
* {
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}
.screen-content {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.screen-content {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
