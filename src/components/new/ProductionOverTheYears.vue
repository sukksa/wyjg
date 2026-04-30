<template>
  <container title="历年产生量及利用量汇总" :loading="loading">
    <div ref="stackedBarChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import { years } from '@/utils/mock'
import mock_array from '@/utils/mock_array'
import { getData } from '@/api/dataService'
export default {
  name: 'ProductionOverTheYears',
  components: { container },
  data() {
    return {
      loading: true,
      chart: null,
      years: [],
      labels: [],
      seriesData: { ly: [], cs: [] },
    }
  },
  async mounted() {
    try {
      const res = await this.fetchData()
      const wy = res
        .filter(item => item.area_id === '511024')
        .map(item => ({
          ...item,
          report_date: item.report_date.substring(0, 4),
        }))
      this.years = Array.from(new Set(wy.map(item => item.report_date))).sort((a, b) => parseFloat(a) - parseFloat(b))
      this.loading = false
      this.seriesData.ly = this.years
        .map(y => wy.filter(item => item.report_date === y).reduce((a, b) => a + parseFloat(b.li_yong_liang), 0))
        .map(item => Math.round(item / 100) / 100)
      this.seriesData.cs = this.years
        .map(y =>
          wy.filter(item => item.report_date === y).reduce((a, b) => a + parseFloat(b.jie_gan_chan_sheng_liang), 0),
        )
        .map(item => Math.round(item / 100) / 100)

      console.log(this.seriesData)
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
          templateCode: ['lncsljlylhz'],
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
          resFiled: ['li_yong_liang', 'jie_gan_chan_sheng_liang'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.stackedBarChart)
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
          // axisPointer: { type: 'shadow' },
          // backgroundColor: 'rgba(0, 20, 50, 0.8)',
          // borderColor: '#016dff',
          // textStyle: { color: '#fff' },
        },
        legend: {
          data: ['产生量', '利用量'],
          top: '5%',
          left: '10%',
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: { color: '#fff', fontSize: 12 },
        },
        graphic: [
          {
            type: 'text',
            right: '5%',
            top: '5%',
            style: {
              fill: '#fff',
              text: '单位：万吨',
              font: '12px Source Han Sans CN',
            },
          },
        ],
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
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#016dff' } },
          axisLabel: { color: '#fff', fontSize: 12, margin: 15 },
        },
        yAxis: {
          type: 'value',
          // max: 30,
          // interval: 5,
          splitLine: {
            lineStyle: { color: 'rgba(1, 109, 255, 0.2)', type: 'dashed' },
          },
          axisLine: { show: true, lineStyle: { color: '#016dff' } },
          axisLabel: { color: '#fff', fontSize: 12 },
        },
        series: [
          {
            name: '产生量',
            type: 'bar',
            // stack: 'total',
            barWidth: 20,
            itemStyle: {
              borderColor: '#ffea00',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ffea00' },
                { offset: 1, color: '#a48400' },
              ]),
            },
            data: this.seriesData.cs,
          },
          {
            name: '利用量',
            type: 'bar',
            // stack: 'total',
            barWidth: 20,
            itemStyle: {
              borderColor: '#38D3FF',
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#38D3FF' },
                { offset: 1, color: '#0c59b7' },
              ]),
            },
            data: this.seriesData.ly,
          },
        ],
      }
      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    },
  },
}
</script>

<style lang="scss" scoped></style>
