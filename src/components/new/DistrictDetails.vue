<template>
  <div v-if="visibles" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <div class="title-box">
          <img class="icon-arrow" src="@/assets/popupicon.png" />
          <span class="title-text">{{ district.mainName }}</span>
        </div>
        <div class="close-btn" @click="handleClose">×</div>
      </div>

      <div
        class="modal-body"
        v-loading="loading"
        element-loading-background="rgba(2, 17, 50,1)"
      >
        <div class="info-stats-bar">
          <p>
            年均处理规模：<span class="highlight-cyan">{{
              info.YearProcess
            }}</span>
          </p>
          <!-- <p>
            占地面积：<span class="highlight-cyan">{{ info.Area }}</span>
          </p> -->
          <p>
            地址：<span>{{ district.addr }}</span>
          </p>
        </div>

        <div class="section-title">所属农机</div>
        <div class="machinery-tags">
          <div
            v-for="(item, index) in machinery"
            :key="index"
            class="machine-tag"
          >
            <img :src="item.icon" class="tag-icon" />
            <span class="tag-name">{{ item.name }}</span>
            <span class="tag-count">总共{{ item.count }}</span>
          </div>
        </div>

        <div class="section-title">简介：</div>
        <p class="intro-text">
          {{ district.intro || "暂无简介" }}
        </p>
        <template
          v-if="
            district.fileHost && district.filePath && district.enterpriseImg
          "
        >
          <div class="section-title">现场图片：</div>
          <div class="photo-gallery">
            <img
              :src="
                district.fileHost +
                '/' +
                district.filePath +
                '/' +
                district.enterpriseImg
              "
              class="site-img"
              alt="现场图片"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getMainExtById, getMainList } from "../../api/dataService";
import claw from "@/assets/icons/claw.png";
import feeder from "@/assets/icons/feeder.png";
import loader from "@/assets/icons/loader.png";
import grinder from "@/assets/icons/grinder.png";
import tractor from "@/assets/icons/tractor.png";
import { districtGetDistrictById } from "@/api/homeApi";
export default {
  name: "DistrictDetails",
  props: {
    visibles: { type: Boolean, default: false },
    code: { type: String, default: "51102401" },
  },
  data() {
    return {
      info: {},
      loading: true,
      claw,
      feeder,
      loader,
      grinder,
      tractor,
      machinery: [
        // { name: '粉碎机', count: 1, icon: require('@/assets/icons/claw.png') },
        // { name: '运输带', count: 2, icon: require('@/assets/icons/feeder.png') },
        // { name: '侧段上料机', count: 1, icon: require('@/assets/icons/loader.png') },
        // { name: '打捆机', count: 2, icon: require('@/assets/icons/loader.png') },
        // { name: '打包机', count: 1, icon: require('@/assets/icons/loader.png') },
      ],
      district: {},
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    getMainExtById() {
      let param = {
        id: this.district.id,
      };
      getMainExtById(param).then((res) => {
        this.loading = false;
        let info = {};
        let machinery = [];
        res.data?.extJson?.forEach((item, index) => {
          if (item.itemCode == "YearProcess" || item.itemCode == "Area") {
            info[item.itemCode] = item.itemValue;
          } else {
            if (item.itemValue != "") {
              let icon = "";
              if (
                item.itemCode == "ExtBigCrusher" ||
                item.itemCode == "ExtCrusher"
              ) {
                icon = this.claw;
              } else if (item.itemCode == "ExtShearingSectionFeeder") {
                icon = this.feeder;
              } else if (
                item.itemCode == "ExtConveyorBelt" ||
                item.itemCode == "ExtPartitionedHopper"
              ) {
                icon = this.loader;
              } else if (item.itemCode == "ExtBalerMachine") {
                icon = this.grinder;
              } else if (
                item.itemCode == "ExtBigPackingMachine" ||
                item.itemCode == "ExtMediumPackingMachine"
              ) {
                icon = this.tractor;
              }
              item.icon = icon;
              machinery.push({
                name: item.itemName,
                count: item.itemValue,
                icon: item.icon,
              });
            }
          }
        });
        this.info = info;
        this.machinery = machinery;
      });
    },
    fetchData() {
      this.loading = true;
      getMainList({
        mainType: "MAIN_TYPE_STORAGE",
        num: 20,
        isPreciseArea: true,
      }).then((res) => {
        this.district = res.data.find(
          (item) => item.areaId == this.$props.code,
        );
        this.getMainExtById();
      });
    },
  },
  watch: {
    visibles(newVal) {
      if (newVal) {
        this.fetchData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh / var(--screen-scale-y, 1));
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 1000px;
  background: #021132;
  border: 1px solid #0757db;
  box-shadow: 0 0 20px rgba(7, 87, 219, 0.5);
  padding: 12px 30px;
  position: relative;
  min-height: 600px;
  max-height: 800px;
  overflow-y: auto;
}

/* 头部样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid;
  border-color: #17e1ff;
  padding-bottom: 6px;
  margin-bottom: 20px;

  .title-box {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 24px;
    font-weight: normal;
    text-shadow: 0px 0px 8px #0a35d6;
    .icon-arrow {
      width: 20px;
      height: 22px;
      margin-right: 15px;
    }
  }

  .close-btn {
    color: #ffea00;
    font-size: 28px;
    cursor: pointer;
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.2);
    }
  }
}

/* 信息条样式 */
.info-stats-bar {
  display: flex;
  gap: 60px;
  color: #fff;
  font-size: 18px;
  margin-bottom: 25px;

  .highlight-cyan {
    // color: #17c3fc;
    font-weight: bold;
  }
}

.section-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 24px 0 15px 0;
}

.machinery-tags {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  .machine-tag {
    background: #1250cc;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 2px;
    color: #fff;

    .tag-icon {
      height: 20px;
      margin-right: 10px;
    }
    .tag-name {
      margin-right: 20px;
      font-size: 16px;
    }
    .tag-count {
      // color: #17c3fc;
    }
  }
}

.intro-text {
  color: #fff;
  line-height: 1.8;
  font-size: 16px;
  opacity: 0.9;
  text-align: justify;
  text-indent: 2em;
}

.photo-gallery {
  margin-top: 15px;
  .site-img {
    height: 280px;
    max-width: 45%;
  }
}
</style>
