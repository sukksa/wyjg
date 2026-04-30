<template>
  <container title="播种面积及还田面积数据" :loading="loading">
    <div ref="horizontalBarChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import { labels, years } from '@/utils/mock'
import mock_array from '@/utils/mock_array'
import { getData } from '@/api/dataService'
export default {
  name: 'StrawIncorporation',
  components: { container },
  data() {
    return {
      loading: true,
      chart: null,
      years: [],
      labels: [],
      seriesData: { ht: [], bz: [] },
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
      this.seriesData.ht = this.years
        .map(y => wy.filter(item => item.report_date === y).reduce((a, b) => a + parseFloat(b.hai_tian_mian_ji), 0))
        .map(item => Math.round(item / 100) / 100)
      this.seriesData.bz = this.years
        .map(y => wy.filter(item => item.report_date === y).reduce((a, b) => a + parseFloat(b.bo_zhong_mian_ji), 0))
        .map(item => Math.round(item / 100) / 100)
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
          resFiled: ['hai_tian_mian_ji', 'bo_zhong_mian_ji'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.horizontalBarChart)
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            return (
              `${params[0].axisValue}<br/>` +
              params.map(item => `${item.marker} ${item.seriesName}: ${item.value} 万亩`).join('<br/>')
            )
          },
          // axisPointer: { type: 'shadow' },
          // backgroundColor: 'rgba(0, 20, 50, 0.8)',
          // borderColor: '#016dff',
          // textStyle: { color: '#fff' },
        },
        legend: {
          data: ['播种面积', '还田面积'],
          top: '0%',
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
            top: '0%',
            style: {
              fill: '#fff',
              text: '单位：万亩',
              font: '12px Source Han Sans CN',
            },
          },
        ],
        grid: {
          top: '10%',
          left: '5%',
          right: '8%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          min: 0,
          // max: 50,
          // interval: 5,
          axisLabel: { color: '#fff', fontSize: 12 },
          splitLine: {
            lineStyle: { color: 'rgba(255, 255, 255, 0.15)', type: 'solid' },
          },
          axisLine: { show: true, lineStyle: { color: '#fff' } },
        },
        yAxis: {
          type: 'category',
          data: labels(),
          inverse: true,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#fff' } },
          axisLabel: { color: '#fff', fontSize: 12 },
        },
        series: [
          {
            name: '播种面积',
            type: 'bar',
            barWidth: 12,
            itemStyle: { color: '#50fa3c' },
            data: this.seriesData.bz,
          },
          {
            name: '还田面积',
            type: 'bar',
            barWidth: 12,
            itemStyle: { color: '#3c8cfa' },
            data: this.seriesData.ht,
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
