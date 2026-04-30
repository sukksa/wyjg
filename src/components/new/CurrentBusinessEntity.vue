<template>
  <container title="当前经营主体" :loading="loading">
    <vue-seamless-scroll :data="scrollData" :class-option="classOption" class="scroll-wrapper">
      <ul class="scroll-list">
        <li v-for="(item, index) in scrollData" :key="index" class="list-item">
          <div class="mainT">
            <div class="item-icon" :class="item.iconClass"></div>
            <div class="list-title">{{ item.name }}</div>
          </div>
          <div class="list-line"></div>
          <div class="list-content">
            <span class="list-content-text">联系人：{{ item.contacts }} </span>
            <span class="list-content-text">联系方式：{{ item.phone }} </span>
            <span class="list-content-text" v-for="i in item.list" :key="i.itemCode">
              {{ i.itemName }}：{{ i.itemValue }}
            </span>
          </div>
        </li>
      </ul>
    </vue-seamless-scroll>
  </container>
</template>

<script>
import container from './container.vue'
import { getMainNList } from '../../api/dataService'
import vueSeamlessScroll from 'vue-seamless-scroll'

export default {
  name: 'CurrentBusinessEntity',
  components: {
    container,
    vueSeamlessScroll,
  },
  props: {
    townId: { type: String, default: '' },
  },
  data() {
    return {
      loading: true,
      scrollData: [],
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.5, // 数值越大速度越快
        limitMoveNum: 3, // 开始无缝滚动的数据量阈值
        hoverStop: true, // 是否开启鼠标悬停停止
        direction: 1, // 0下 1上 2左 3右
        openWatch: true, // 开启数据实时监控刷新view
        // singleHeight: 0,
        // waitTime: 0,
      }
    },
  },
  mounted() {},
  watch: {
    townId(newVal) {
      this.fetchData()
    },
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const res = await getMainNList({
          isAll: true,
          mainType: 'MAIN_TYPE_ANIMAL',
          areaId: this.townId,
        })
        if (res.isSuccess) {
          this.scrollData = res.data
            .filter(item => item.mainType !== 'MAIN_TYPE_STORAGE')
            .map(item => ({
              name: item.mainName,
              iconClass: 'icon-company',
              contacts: item.contacts,
              phone: item.phone,
              list: item.extJson?.filter(i => i.itemValue),
            }))
        }
      } catch (error) {
        console.error('获取经营主体失败:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin-top: 10px;
}

.scroll-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  width: 100%;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 8px 15px;
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
    margin: 8px 0;
  }
  .list-content {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 8px;
    align-items: center;
    // span:nth-child(even) {
    //   text-align: right;
    // }
  }
}
</style>
