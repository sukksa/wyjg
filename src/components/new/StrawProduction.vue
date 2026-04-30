<template>
  <container title="县域历年秸杆产生量汇总统计" :loading="loading">
    <div ref="chart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import { getData } from '@/api/dataService'
import { categoryMap, labels } from '@/utils/common'
const colorList = ['#00f58a', '#00ccfe', '#e161f3', '#ffca00', '#ffffff']

export default {
  components: { container },
  data() {
    return {
      seriesData: [],
      loading: true,
      years: [],
      labels: [],
    }
  },
  async mounted() {
    try {
      const res = await this.fetchData()
      const data = res
        .map(item => ({ ...item, date: item.report_date.substring(0, 4) }))
        .sort((a, b) => Number(a.date) - Number(b.date))

      this.years = data.map(item => item.date)
      this.seriesData = []
      for (const [key, value] of categoryMap) {
        this.seriesData.push({
          name: value,
          data: data.map(item => Math.round(parseFloat(item[key] || '0') / 100) / 100),
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
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['xylnjgcslhztj'],
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
          resFiled: labels,
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      const myChart = echarts.init(this.$refs.chart)
      const chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: params => {
            return (
              `${params[0].axisValue}<br/>` +
              params.map(item => `${item.marker} ${item.seriesName}: ${item.value} 万吨`).join('<br/>')
            )
          },
        },
        legend: {
          data: this.labels,
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
        graphic: [
          {
            type: 'text',
            z: 100,
            right: '5%',
            top: '0%',
            style: {
              fill: '#fff',
              text: '单位：万吨',
              font: '12px Source Han Sans CN',
            },
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.years,
          axisLine: { lineStyle: { color: '#016dff' } },
          axisLabel: { color: '#fff', fontSize: 12, margin: 15 },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          // max: 30,
          // interval: 5,
          splitLine: { lineStyle: { color: 'rgba(1, 109, 255, 0.2)', type: 'dashed' } },
          axisLabel: { color: '#fff', fontSize: 12 },
          axisLine: { show: true, lineStyle: { color: '#016dff' } },
        },
        // series: this.seriesData.map((item, index) => ({
        //   name: item.name,
        //   type: 'line',
        //   barWidth: 12, // 柱子宽度
        //   itemStyle: {
        //     borderRadius: [6, 6, 0, 0],
        //     borderColor: colorList[index][0],
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [
        //       { offset: 0, color: colorList[index][0] },
        //       { offset: 1, color: colorList[index][0] + '30' },
        //     ]),
        //   },
        //   data: item.data,
        // })),
        series: this.seriesData.map((item, index) => ({
          name: item.name,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: colorList[index] },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: this.hexToRgba(colorList[index], 0.8) },
              { offset: 1, color: this.hexToRgba(colorList[index], 0.3) },
            ]),
          },
          data: item.data,
        })),
      }

      myChart.setOption(chartOption)

      window.addEventListener('resize', () => myChart.resize())
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
