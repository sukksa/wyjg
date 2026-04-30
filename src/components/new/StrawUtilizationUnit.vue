<template>
  <container title="村级秸杆收集点汇总" :loading="loading">
    <div class="scroll-wrapper" @mouseenter="stopScroll" @mouseleave="startScroll">
      <ul class="scroll-list" :style="scrollStyle">
        <li v-for="(item, index) in scrollData" :key="index" class="list-item">
          <div class="item-icon"></div>
          <span class="item-text">{{ item.name }}</span>
          <span class="item-text" style="text-align: end">{{ item.value }}个乡村收集点</span>
        </li>
      </ul>
    </div>
  </container>
</template>

<script>
import { getData } from '@/api/dataService'
import container from './container.vue'
export default {
  name: 'StrawUtilizationUnit',
  components: { container },
  data() {
    return {
      loading: true,
      rawList: [],
      offset: 0,
      timer: null,
      itemHeight: 56,
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
  async mounted() {
    this.loading = true
    try {
      const res = await this.fetchData()
      this.rawList = res.map(item => ({
        name: item.area_name,
        value: item.cun_ji_jie_gan_shou_ji_dian,
      }))
      this.loading = false
      this.$nextTick(() => {
        this.startScroll()
      })
    } catch (error) {
      console.log(error)
    }
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    this.stopScroll()
  },
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['cjjgsjdhz'],
          // areaId: '511024',
          isPreciseArea: true,
          startDate: '',
          endDate: '',
          filedCondition: [
            {
              filedName: '',
              option: '',
              filedValue: {},
              dataType: '',
            },
          ],
          resFiled: ['cun_ji_jie_gan_shou_ji_dian'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
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
  height: 46px;
  margin-bottom: 10px;
  background: #4d77a6;
  border-radius: 4px;
  align-items: center;
  display: grid;
  gap: 12px;
  grid-template-columns: 24px 80px 1fr;
  padding: 0 15px;
  transition: background 0.3s;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #5380b3;
  }

  .item-icon {
    width: 24px;
    height: 24px;
    margin-right: 15px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('@/assets/house.png');
    &.icon-farm {
      background-image: url('@/assets/icon1.png');
    }
    &.icon-plant {
      background-image: url('@/assets/icon2.png');
    }
    &.icon-company {
      background-image: url('@/assets/icon3.png');
    }
    &.icon-star {
      background-image: url('@/assets/icon4.png');
    }
  }

  .item-text {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
