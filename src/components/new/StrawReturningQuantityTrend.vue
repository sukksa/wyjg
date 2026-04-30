<template>
  <container title="秸杆收集量数据走势" :loading="loading">
    <div ref="trendChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import utils from '../../utils/utils'
import { getData } from '../../api/dataService'
export default {
  name: 'StrawReturningQuantityTrend',
  components: { container },
  props: {
    townId: { type: String, default: '' },
  },
  data() {
    return {
      loading: true,
      chart: null,
      rawList: [],
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.trendChart)

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c} 吨',
          // axisPointer: {
          //   type: 'line',
          //   lineStyle: { color: 'rgba(255, 255, 255, 0.3)' },
          // },
          // backgroundColor: 'rgba(0, 20, 50, 0.8)',
          // borderColor: '#016dff',
          // textStyle: { color: '#fff' },
        },
        graphic: [
          {
            type: 'text',
            right: '5%',
            top: '3%',
            style: {
              fill: '#fff',
              text: '单位：吨',
              font: '12px Source Han Sans CN',
            },
          },
        ],
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.rawList.map(item => item.date),
          axisLabel: { color: '#fff', fontSize: 12 },
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'solid' },
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          // max: 30,
          // interval: 5,
          axisLabel: {
            color: '#fff',
            fontSize: 12,
            formatter: '{value}',
          },
          axisLine: {
            show: true,
            lineStyle: { color: 'rgba(255, 255, 255, 0.5)' },
          },
          splitLine: {
            lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'dashed' },
          },
        },
        series: [
          {
            name: '可收集量',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle: {
              color: '#00ccfe',
              width: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 204, 254, 0.6)' },
                { offset: 1, color: 'rgba(0, 204, 254, 0.1)' },
              ]),
            },
            data: this.rawList.map(item => item.ke_shou_ji_liang),
          },
        ],
      }

      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    },
    async fetchData() {
      return new Promise((resolve, reject) => {
        let param = {
          templateCode: ['mrjgsjl'],
          areaId: this.townId,
          isPreciseArea: false,
          startDate: utils.getDay(-7),
          endDate: utils.getDay(0),
          resFiled: ['zuo_wu_ming_cheng', 'ke_shou_ji_liang'],
        }

        getData(param).then(res => {
          this.rawList = res.data.map(item => ({ ...item, date: item.report_date.substring(5, 10) }))
          this.loading = false
          this.$nextTick(() => {
            this.initChart()
          })
        })
      })
    },
  },
  watch: {
    townId(newVal) {
      this.fetchData()
    },
  },
}
</script>
