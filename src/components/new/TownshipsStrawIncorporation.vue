<template>
  <container title="各镇秸杆还田量汇总数据" :loading="loading">
    <div ref="bubbleChart" style="width: 100%; height: 100%"></div>
  </container>
</template>

<script>
import * as echarts from 'echarts'
import container from './container.vue'
import { getData } from '@/api/dataService'
const colors = [
  '#e34d4d',
  '#e38a4d',
  '#e3c84d',
  '#a3e34d',
  '#4de380',
  '#4dd5e3',
  '#4d8ae3',
  '#6e4de3',
  '#c34de3',
  '#e34db5',
  '#e34d6e',
  '#e37f4d',
  '#d5e34d',
  '#4de3a3',
]
const area = ['511024114', '511024105', '511024102', '511024106', '511024115']
export default {
  name: 'TownshipsStrawIncorporation',
  components: { container },
  data() {
    return {
      chart: null,
      loading: true,
      townData: [],
    }
  },
  async mounted() {
    try {
      const res = await this.fetchData()
      this.loading = false
      const wy = res.filter(item => item.area_id !== '511024')
      const dataMap = new Map()
      for (const item of wy) {
        if (dataMap.has(item.area_name)) {
          dataMap.set(item.area_name, {
            value: dataMap.get(item.area_name).value + parseFloat(item.hai_tian_mian_ji),
            areaId: item.area_id,
          })
        } else {
          dataMap.set(item.area_name, {
            value: parseFloat(item.hai_tian_mian_ji),
            areaId: item.area_id,
          })
        }
      }

      this.townData = Array.from(dataMap).map((item, i) => ({
        name: item[0],
        value: Math.round(item[1].value / 100) / 100,
        color: colors[i % colors.length],
        areaId: item[1].areaId,
      }))
      this.townData = this.townData
        .filter(item => area.findIndex(a => a === item.areaId) == -1)
        .sort((a, b) => b.value - a.value)
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
          templateCode: ['gzjghtlhzsj'],
          areaId: '511024',
          isPreciseArea: false,
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
          resFiled: ['hai_tian_mian_ji'],
        })
        if (!res.isSuccess) reject(res.msg)
        else resolve(res.data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.bubbleChart)

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          show: true,
          formatter: params => `${params.marker} ${params.name}: ${params.data.value}万亩`,
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 130,
              gravity: 0.1,
              edgeLength: 20,
              layoutAnimation: true,
            },
            // top: '10%',
            // bottom: '10%',
            height: '50%',
            width: '400%',
            preserveAspect: 'true',
            symbolSize: (val, params) => {
              return Math.sqrt(params.data.value) * 64 + 24
            },
            zoom: 0.95,
            roam: false,
            label: {
              show: true,
              position: 'inside',
              formatter: params => {
                return `{name|${params.data.name}}\n{value|${params.data.value}}万亩`
              },
              rich: {
                name: { color: '#fff', fontSize: 14, lineHeight: 20 },
                value: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
              },
            },
            data: this.townData.map(item => ({
              name: item.name,
              value: item.value,
              itemStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.8, [
                  { offset: 0, color: 'rgba(0,0,0,0)' },
                  { offset: 0.5, color: this.hexToRgba(item.color, 0.3) },
                  { offset: 1, color: item.color },
                ]),
                borderColor: item.color,
                borderWidth: 2,
                shadowBlur: 15,
                shadowColor: item.color,
              },
            })),
          },
        ],
      }

      this.chart.setOption(option)
    },
    handleResize() {
      this.chart && this.chart.resize()
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
