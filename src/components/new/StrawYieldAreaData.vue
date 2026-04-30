<template>
  <container title="种植片区种植面积及秸杆产量数据" :loading="loading">
    <div class="scroll-wrapper" @mouseenter="stopScroll" @mouseleave="startScroll">
      <ul class="scroll-list" :style="scrollStyle">
        <li v-for="(item, index) in scrollData" :key="index" class="list-item">
          <div class="list-title">{{ item.title }}</div>
          <div class="list-line"></div>
          <div class="list-content">
            <span class="list-content-text">种植面积：{{ item.return }} 亩</span>
            <span class="list-content-text">秸秆产量：{{ item.production }} 吨</span>
          </div>
        </li>
      </ul>
    </div>
  </container>
</template>

<script>
import container from './container.vue'
import { getData } from '../../api/dataService'
export default {
  name: 'StrawYieldAreaData',
  props: {
    townId: { type: String, default: '' },
  },
  components: { container },
  data() {
    return {
      loading: true,
      rawList: [
        // { title: '威远县新店镇游友种植家庭农场', production: '651.64', return: '325.04' },
        // { title: '威远县刘峰种植家庭农场', production: '986.40', return: '642.43' },
      ],
      offset: 0,
      timer: null,
      itemHeight: 90,
      speed: 1,
    }
  },
  computed: {
    scrollData() {
      return [...this.rawList, ...this.rawList]
    },
    scrollStyle() {
      return {
        transform: `translateY(-${this.offset}px)`,
        transition: this.offset === 0 ? 'none' : 'transform 0.05s linear',
      }
    },
  },
  mounted() {
    this.loading = false
  },
  beforeDestroy() {
    this.stopScroll()
  },
  methods: {
    startScroll() {
      if (this.timer) return
      const maxHeight = this.rawList.length * this.itemHeight

      this.timer = setInterval(() => {
        this.offset += this.speed
        if (this.offset >= maxHeight) {
          this.offset = 0
        }
      }, 30)
    },
    stopScroll() {
      clearInterval(this.timer)
      this.timer = null
    },
    getData() {
      let param = {
        templateCode: ['czzsj'],
        areaId: this.townId,
        isPreciseArea: false,
        startDate: '',
        endDate: '',
        resFiled: ['yu_ji_jie_gan_chan_liang', 'zhong_zhi_mian_ji'],
      }
      getData(param).then(res => {
        let rawList = []
        res.data.forEach((item, index) => {
          rawList.push({
            title: item.area_name,
            production: item.yu_ji_jie_gan_chan_liang,
            return: item.zhong_zhi_mian_ji,
          })
        })
        this.rawList = rawList
        this.$nextTick(() => {
          this.stopScroll()
          this.offset = 0
          this.startScroll()
        })
      })
    },
  },
  watch: {
    townId(newVal) {
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  padding: 4px 12px;
}

.scroll-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 0 15px;
  transition: background 0.3s;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  background: #17406d;
  border: 1px solid #43d3fd;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  &:hover {
    background: #1a4777;
  }
  .list-line {
    height: 1px;
    background-color: #43d3fd;
  }
  .list-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
