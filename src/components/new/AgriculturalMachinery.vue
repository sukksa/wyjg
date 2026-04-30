<template>
  <container :title="agricultural.mainName" :loading="loading">
    <div class="machinery-list">
      <div v-for="(item, index) in machineryData" :key="index" class="machinery-item">
        <div class="info-prefix">
          <img :src="item.icon" class="machine-icon" alt="icon" />
          <span class="machine-name">{{ item.name }}</span>
        </div>

        <div class="progress-wrapper">
          <div class="progress-bar"></div>
        </div>

        <div class="info-suffix">
          <span>总共{{ item.total }}</span>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import container from './container.vue'
import { getMainExtById } from '../../api/dataService'
import claw from '@/assets/icons/claw.png'
import feeder from '@/assets/icons/feeder.png'
import loader from '@/assets/icons/loader.png'
import grinder from '@/assets/icons/grinder.png'
import tractor from '@/assets/icons/tractor.png'
export default {
  name: 'AgriculturalMachinery',
  components: { container },
  props: {
    agricultural: { type: Object, default: '' },
  },
  data() {
    return {
      claw,
      feeder,
      loader,
      grinder,
      tractor,
      machineryData: [],
      loading: true,
    }
  },
  mounted() {
    this.loading = false
    this.$nextTick(() => {
      this.machineryDataInit()
    })
  },
  methods: {
    machineryDataInit() {
      let param = {
        id: this.agricultural.id,
      }
      getMainExtById(param).then(res => {
        console.log(res)
        let machinery = []
        res.data?.extJson?.forEach((item, index) => {
          if (
            item.itemCode == 'YearProcess' ||
            item.itemCode == 'Area' ||
            item.itemCode == 'Demand' ||
            item.itemCode == 'AcquisitionPrice'
          ) {
          } else {
            if (item.itemValue != '') {
              let icon = ''
              if (item.itemCode == 'ExtBigCrusher' || item.itemCode == 'ExtCrusher') {
                icon = this.claw
              } else if (item.itemCode == 'ExtShearingSectionFeeder') {
                icon = this.feeder
              } else if (item.itemCode == 'ExtConveyorBelt' || item.itemCode == 'ExtPartitionedHopper') {
                icon = this.loader
              } else if (item.itemCode == 'ExtBalerMachine') {
                icon = this.grinder
              } else if (item.itemCode == 'ExtBigPackingMachine' || item.itemCode == 'ExtMediumPackingMachine') {
                icon = this.tractor
              }
              item.icon = icon
              machinery.push({
                name: item.itemName,
                total: item.itemValue,
                icon: item.icon,
              })
            }
          }
        })

        this.machineryData = machinery
        //   this.machineryData = [
        //   { name: '粉碎机', total: 1, icon: require('@/assets/icons/grinder.png') },
        //   { name: '运输带', total: 2, icon: require('@/assets/icons/loader.png') },
        //   { name: '侧段上料机', total: 1, icon: require('@/assets/icons/feeder.png') },
        //   { name: '打捆机', total: 2, icon: require('@/assets/icons/tractor.png') },
        //   { name: '打包机', total: 1, icon: require('@/assets/icons/claw.png') },
        // ]
      })
    },
  },
  watch: {
    agricultural(newVal) {
      this.machineryDataInit()
    },
  },
}
</script>

<style lang="scss" scoped>
.machinery-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 5px;
  width: 100%;
  padding: 0 24px;
  .machinery-item {
    display: grid;
    align-items: center;
    grid-template-columns: max-content 1fr 80px;
    height: 36px;
    color: #fff;
    .info-prefix {
      display: flex;
      align-items: center;
      .machine-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
      }
      .machine-name {
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .progress-wrapper {
      flex: 1;
      padding: 0 15px;

      .progress-bar {
        height: 100%;
        width: 100%;
        height: 10px;
        background: #26edff;
        border-radius: 5px;
      }
    }

    .info-suffix {
      text-align: left;
      font-size: 16px;
      font-family: 'Source Han Sans CN';
    }
  }
}
</style>
