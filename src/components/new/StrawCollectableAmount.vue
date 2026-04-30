<template>
  <container :loading="loading" title="秸杆可收集量数据">
    <div ref="collectChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import { labels } from '@/utils/mock'
import mock_town from '@/utils/mock_town'
import { getData } from '@/api/dataService'
const categoryMap = new Map([
  ['shui_dao', '水稻'],
  ['yu_mi', '玉米'],
  ['xiao_mai', '小麦'],
  ['you_cai', '油菜'],
  ['qi_ta', '其他'],
])
const colors = ['#EB3E8D', '#B4E027', '#6A48D7', '#27E08C', '#2B96F1']

export default {
  name: 'StrawCollectableAmount',
  components: { container },
  props: {
    areaId: { type: String, default: '' },
  },
  data() {
    return {
      loading: true,
      chart: null,
      years: [],
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['zjjgksjlsj'],
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
      this.chart = echarts.init(this.$refs.collectChart)

      const option = {
        backgroundColor: 'transparent',
        legend: {
          top: '2%',
          left: '8%',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: { color: '#fff', fontSize: 14 },
          data: Array.from(categoryMap.values()),
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: { type: 'shadow' },
          // backgroundColor: 'rgba(7, 87, 219, 0.9)',
          // borderColor: '#17c3fc',
          // borderWidth: 1,
          // textStyle: { color: '#fff', fontSize: 16 },
          formatter: params => {
            return (
              `${params[0].axisValue}年<br/>` +
              params.map(item => `${item.marker} ${item.seriesName}: ${item.value} 吨`).join('<br/>')
            )
          },
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
          data: this.years,
          axisLabel: { color: '#fff', fontSize: 12 },
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          // max: 30,
          // interval: 5,
          axisLabel: { color: '#fff', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'dashed' } },
        },
        series: (() => {
          const res = []
          let i = 0
          for (const [key, value] of categoryMap) {
            res.push({
              name: value,
              type: 'bar',
              barWidth: '30%',
              stack: 'total',
              itemStyle: { color: colors[i] },
              data: this.chartData[key],
            })
            i++
          }
          return res
        })(),
      }

      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    },
  },
  watch: {
    areaId: {
      async handler(val) {
        try {
          const res = await this.fetchData()
          const data = res
            .map(item => ({ ...item, date: item.report_date.substring(0, 4) }))
            .sort((a, b) => Number(a.date) - Number(b.date))

          this.years = data.map(item => item.date)
          this.chartData = []
          for (const [key, value] of categoryMap) {
            this.chartData[key] = data.map(item => parseFloat(item[key] || '0').toFixed(2))
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
  },
}
</script>
