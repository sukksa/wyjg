<template>
  <container title="作物播种面积数据统计" :loading="loading">
    <div ref="pieChart3D" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import Highcharts from 'highcharts'
import Highcharts3D from 'highcharts/highcharts-3d'
import container from './container.vue'
import { getData } from '@/api/dataService'
const categoryMap = new Map([
  ['shui_dao', '水稻'],
  ['yu_mi', '玉米'],
  ['xiao_mai', '小麦'],
  ['you_cai', '油菜'],
  ['qi_ta', '其他'],
])
Highcharts3D(Highcharts)
const colors = ['#50fa3c', '#17c3fc', '#c348f0', '#ffea00', '#e2694d']
export default {
  name: 'StrawIncorporation3DPie',
  components: { container },
  data() {
    return {
      loading: true,
      chart: null,
      labels: [],
    }
  },
  async mounted() {
    try {
      const res = await this.fetchData()
      this.seriesData = []
      for (const [key, value] of categoryMap) {
        this.seriesData.push({ name: value, data: res[0][key] })
      }
      this.seriesData = this.seriesData.map(item => ({ ...item, y: Math.round(item.data / 100) / 100 }))
      this.loading = false
      this.$nextTick(() => {
        this.initChart()
      })
    } catch (error) {
      console.error(error)
    }
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) this.chart.destroy()
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    async fetchData() {
      return new Promise(async (resolve, reject) => {
        const res = await getData({
          templateCode: ['zwbzmjsjtj'],
          areaId: '511024',
          isPreciseArea: true,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          resFiled: ['xiao_mai', 'yu_mi', 'shui_dao', 'you_cai', 'qi_ta'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      const chartData = this.seriesData
      console.log(chartData)
      this.chart = Highcharts.chart(this.$refs.pieChart3D, {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0,
          },
        },
        title: { text: null },
        tooltip: {
          headerFormat: '<span style="font-size:14px;color:#333;">{point.key}</span><br/><br/>',
          pointFormat:
            '<span style="color:{point.color}">\u25CF </span> {series.name}: <b>{point.y}</b> 万亩 ({point.percentage:.1f}%)',
          // backgroundColor: 'rgba(0, 20, 50, 0.8)',
          style: { color: '#666' },
          distance: 80,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 54,
            showInLegend: true,
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y} 万亩',
              style: { color: '#fff', textOutline: 'none' },
            },
            colors,
            states: {
              inactive: {
                opacity: 1,
              },
              hover: {
                halo: null,
              },
            },
          },
        },
        legend: {
          enabled: true,
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          itemDistance: 20,
          symbolRadius: 2,
          itemStyle: {
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'normal',
          },
          itemHoverStyle: {
            color: '#17c3fc',
          },
          labelFormat: '{name}',
        },
        series: [
          {
            name: '播种面积',
            data: chartData,
          },
        ],
        credits: { enabled: false },
      })
    },
    handleResize() {
      if (this.chart) this.chart.reflow()
    },
  },
}
</script>
