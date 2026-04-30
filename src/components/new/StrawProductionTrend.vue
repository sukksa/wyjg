<template>
  <container :loading="loading" title="县域历年秸杆可收集量趋势图">
    <!-- <div class="toggle-container">
      <div :class="['toggle-item', { active: activeType === 'production' }]" @click="handleSwitch('production')">
        产生量
      </div>
      <div :class="['toggle-item', { active: activeType === 'collection' }]" @click="handleSwitch('collection')">
        可收集量
      </div>
    </div> -->

    <div ref="trendChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import mock_array from '@/utils/mock_array'
import { labels, years } from '@/utils/mock'
import { getData } from '@/api/dataService'
const color = ['#00f58a', '#00ccfe', '#e161f3', '#ffca00', '#ffffff']
export default {
  name: 'StrawProductionTrend',
  components: { container },
  data() {
    return {
      loading: true,
      chart: null,
      activeType: 'collection', // production | collection
      productionData: [],
    }
  },
  async mounted() {
    // this.loading = false
    // for (const label of labels()) {
    //   this.productionData.push(mock_array.filter(i => i.作物类型 === label))
    // }
    // console.log(this.productionData)
    // this.$nextTick(() => {
    //   this.initChart()
    // })
    try {
      const res = await this.fetchData()
      const wy = res
        .filter(item => item.area_id === '511024')
        .map(item => ({
          ...item,
          report_date: item.report_date.substring(0, 4),
          zuo_wu_ming_cheng: item.zuo_wu_ming_cheng.replace(/^['"]|['"]$/g, ''),
        }))
      this.years = Array.from(new Set(wy.map(item => item.report_date))).sort((a, b) => parseFloat(a) - parseFloat(b))
      this.labels = Array.from(new Set(wy.map(item => item.zuo_wu_ming_cheng)))
      this.loading = false
      for (const label in this.labels) {
        this.productionData.push({
          name: this.labels[label],
          data: this.years.map(year => {
            const data = wy.find(item => item.report_date === year && item.zuo_wu_ming_cheng === this.labels[label])
            console.log(data, year)
            return data ? Math.round(data.ke_shou_ji_liang / 100) / 100 : 0
          }),
        })
      }
      this.$nextTick(() => {
        this.initChart()
      })
    } catch (error) {
      console.log(error)
    }
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['xyzzsj'],
          areaId: '511024',
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
          resFiled: ['zuo_wu_ming_cheng', 'ke_shou_ji_liang'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.trendChart)
      this.updateChart()
    },
    handleSwitch(type) {
      this.activeType = type
      this.updateChart()
    },
    handleResize() {
      this.chart && this.chart.resize()
    },
    updateChart() {
      const data = this.activeType === 'production' ? this.productionData : this.collectionData

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            return (
              `${params[0].axisValue}<br/>` +
              params.map(item => `${item.marker} ${item.seriesName}: ${item.value} 万吨`).join('<br/>')
            )
          },
          // backgroundColor: 'rgba(0, 20, 50, 0.8)',
          // borderColor: '#016dff',
          // textStyle: { color: '#fff' },
          // axisPointer: { lineStyle: { color: '#016dff', type: 'dashed' } },
        },
        legend: {
          data: labels(),
          top: '0%',
          left: '5%',
          itemWidth: 15,
          itemHeight: 2,
          textStyle: { color: '#fff', fontSize: 12 },
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2021', '2022', '2023', '2024', '2025'],
          axisLine: { lineStyle: { color: '#016dff' } },
          axisLabel: { color: '#fff', fontSize: 12, margin: 15 },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          // max: 30,
          interval: 5,
          splitLine: { lineStyle: { color: 'rgba(1, 109, 255, 0.2)', type: 'dashed' } },
          axisLabel: { color: '#fff', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#016dff' } },
        },
        series: this.productionData.map((item, index) => this.createSeries(item.name, item.data, color[index])),
        //  [
        //   this.createSeries('水稻', data.rice, '#00f58a'),
        //   this.createSeries('玉米', data.corn, '#00ccfe'),
        //   this.createSeries('大豆', data.soybean, '#e161f3'),
        //   this.createSeries('油菜', data.rapeseed, '#ffca00'),
        //   this.createSeries('其他', data.other, '#ffffff'),
        // ],
      }

      this.chart.setOption(option)
    },
    createSeries(name, data, color) {
      return {
        name: name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: color },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: this.hexToRgba(color, 0.8) },
            { offset: 1, color: this.hexToRgba(color, 0.3) },
          ]),
        },
        data: data,
      }
    },
    hexToRgba(hex, opacity) {
      let r = parseInt('0x' + hex.slice(1, 3))
      let g = parseInt('0x' + hex.slice(3, 5))
      let b = parseInt('0x' + hex.slice(5, 7))
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-container {
  display: flex;
  color: #fff;
  position: absolute;
  z-index: 99;
  right: 12px;
  .toggle-item {
    padding: 0px 12px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 18px;

    &.active {
      background: rgba(42, 255, 122, 0.4);
      font-weight: bold;
      border: 1px solid #2aff7a;
    }

    &:not(.active):hover {
      color: #fff;
    }
  }
}
</style>
