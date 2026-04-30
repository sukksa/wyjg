<template>
  <container :loading="loading" title="秸杆产量数据统计">
    <div class="chart-container">
      <div ref="pieChart" style="width: 100%; height: 100%"></div>
      <div class="chart-center-text">
        <p>{{ areaName }}</p>
      </div>
    </div>

    <div class="legend-container">
      <div v-for="(item, index) in chartData" :key="index" class="legend-item">
        <div class="legend-left">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <span class="label-name">{{ item.name }}</span>
        </div>
        <span class="label-value">{{ item.value }}吨</span>
        <span class="label-percent">{{ item.percent }}%</span>
      </div>
    </div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import mock_town from '@/utils/mock_town'
import { getData } from '@/api/dataService'
const colors = ['#EB3E8D', '#B4E027', '#6A48D7', '#27E08C', '#2B96F1']
const categoryMap = new Map([
  ['shui_dao', '水稻'],
  ['yu_mi', '玉米'],
  ['xiao_mai', '小麦'],
  ['you_cai', '油菜'],
  ['qi_ta', '其他'],
])
export default {
  name: 'StatisticsOfStrawYield',
  components: { container },
  props: {
    areaId: { type: String, default: '' },
    areaName: { type: String, default: '' },
  },
  data() {
    return {
      chart: null,
      loading: true,
      chartData: [
        { name: '水稻', value: 9601.8, percent: 37, color: '#68c691' },
        { name: '小麦', value: 216.73, percent: 16, color: '#2b6fce' },
        { name: '玉米', value: 12365.8, percent: 17, color: '#a05cd1' },
        { name: '油菜', value: 7841.23, percent: 15, color: '#c55252' },
        { name: '其它', value: 3808.34, percent: 15, color: '#56b8c7' },
      ],
    }
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['jgclsjtj'],
          areaId: this.areaId,
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
          resFiled: ['xiao_mai', 'yu_mi', 'shui_dao', 'you_cai', 'qi_ta'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.pieChart)
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: params => `${params.marker} ${params.name}: ${params.data.value} 吨`,
          position: (point, params, dom, rect, size) => [point[0], point[1]],
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '85%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: { show: false },
            emphasis: {
              scale: true,
              scaleSize: 10,
            },
            data: this.chartData.map(item => ({
              name: item.name,
              value: item.value,
              itemStyle: { color: item.color },
            })),
          },
        ],
      }
      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    },
  },
  watch: {
    async areaId(val) {
      try {
        const res = await this.fetchData()
        this.chartData = []
        let i = 0
        for (const [key, value] of categoryMap) {
          this.chartData.push({
            name: value,
            value: parseFloat(res[0][key] || '0'),
            color: colors[i],
          })
          i++
        }
        const total = this.chartData.reduce((sum, item) => sum + item.value, 0)
        console.log(total)
        if (total > 0) {
          this.chartData.forEach(item => {
            item.percent = parseFloat(((item.value / total) * 100).toFixed(2))
            item.value = item.value
          })

          if (this.chartData.length > 0) {
            const totalPercent = this.chartData.reduce((sum, item) => sum + item.percent, 0)
            const diff = 100 - totalPercent
            if (Math.abs(diff) > 0.005) {
              const lastItem = this.chartData[this.chartData.length - 1]
              lastItem.percent = parseFloat((lastItem.percent + diff).toFixed(2))
            }
          }
        } else {
          this.chartData.forEach(item => {
            item.percent = 0
            item.value = item.value
          })
        }
        this.loading = false
        this.$nextTick(() => {
          this.initChart()
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 42%;
  height: 100%;
  position: relative;

  .chart-center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    pointer-events: none;

    p {
      color: #fff;
      font-size: 24px;
      font-weight: bold;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  }
}

.legend-container {
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;

  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    color: #fff;
    font-size: 16px;

    .legend-left {
      display: flex;
      align-items: center;
      width: 72px;

      .dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .label-name {
        font-weight: 500;
      }
    }

    .label-value {
      flex: 1;
      text-align: right;
      padding-right: 12px;
      font-family: 'Source Han Sans CN';
    }

    .label-percent {
      width: 50px;
      text-align: right;
      font-weight: bold;
    }
  }
}
</style>
