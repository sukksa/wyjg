<template>
  <container title="县级秸秆收储运片区" :loading="false">
    <div class="region-container">
      <div class="row">
        <div
          v-for="(item, index) in topRegions"
          :key="item.name"
          :class="['block-item', { active: activeIndex === index }]"
          :style="{
            backgroundImage: `url('${item.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }"
          @click="handleSelect(index)"
        >
          <div class="block-content">{{ item.name }}</div>
        </div>
      </div>
      <div class="row bottom-row">
        <div
          v-for="(item, index) in bottomRegions"
          :key="item.name"
          :class="['block-item', { active: activeIndex === index + 3 }]"
          :style="{
            backgroundImage: `url('${item.backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }"
          @click="handleSelect(index + 3)"
        >
          <div class="block-content">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </container>
</template>

<script>
import { districtGetDistrictList } from "@/api/homeApi";
import container from "./container.vue";
import xc from "@/assets/icons/xc.png";
import xd from "@/assets/icons/xd.png";
import lh from "@/assets/icons/lh.png";
import gs from "@/assets/icons/gs.png";
import lj from "@/assets/icons/lj.png";
const colorsMap = new Map([
  ["511024114", xc],
  ["511024105", xd],
  ["511024102", lh],
  ["511024106", gs],
  ["511024115", lj],
]);
export default {
  name: "StrawDistrict",
  components: { container },
  data() {
    return {
      activeIndex: 0,
      regions: [
        { name: "新场片区" },
        { name: "高石片区" },
        { name: "龙会片区" },
        { name: "新店片区" },
        { name: "连界片区" },
      ],
    };
  },
  computed: {
    topRegions() {
      return this.regions.slice(0, 3);
    },
    bottomRegions() {
      return this.regions.slice(3);
    },
  },
  mounted() {
    districtGetDistrictList().then((res) => {
      this.regions = res.data.map((item) => {
        const match = item.districtName.match(/（(.*?)）/);
        return {
          name: match ? match[1] : item.districtName,
          code: item.districtCode,
          backgroundImage: colorsMap.get(item.districtCode),
        };
      });
      console.log(this.regions);
    });
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
      this.$emit("handleDistrictClick", this.regions[index].code);
    },
  },
};
</script>

<style lang="scss" scoped>
.region-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 20px 0;
}

.row {
  display: flex;
  justify-content: center;
  width: 100%;
  // margin-bottom: 20px;
}

.bottom-row {
  margin-bottom: 0;
}

.block-item {
  position: relative;
  width: 100px;
  height: 115px;
  margin: 0 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background-image: url('@/assets/six.png');
  background-size: 100% 100%;

  .block-content {
    z-index: 2;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.3s;
    padding-bottom: 24px;
  }

  // &.active {
  //   .block-content {
  //     color: #ffea00;
  //     transform: scale(1.1);
  //   }

  //   .block-base {
  //     background: rgba(23, 195, 252, 0.3);
  //     border-color: #17c3fc;
  //     box-shadow: 0 0 25px #17c3fc inset, 0 0 15px #17c3fc;
  //   }

  //   &::before {
  //     opacity: 1;
  //     background: linear-gradient(to top, #17c3fc, transparent);
  //   }
  // }

  // &:hover:not(.active) {
  //   transform: translateY(-5px);
  //   .block-base {
  //     border-color: rgba(23, 195, 252, 0.8);
  //   }
  // }
}
</style>
