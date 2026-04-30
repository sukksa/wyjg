<template>
  <div v-if="visible" class="modal-overlay">
    <!-- @click.self="handleClose" -->
    <div class="modal-container">
      <div class="modal-header">
        <div class="title-box">
          <img class="icon-arrow" src="@/assets/popupicon.png" />
          <span class="title-text">{{ main.mainName }}</span>
        </div>
        <div class="close-btn" @click="handleClose">×</div>
      </div>

      <div class="modal-body">
        <div class="modal-left">
          <div class="info-stats-bar">
            <p>
              联系人：<span class="highlight-cyan">{{ main.contacts }}</span>
            </p>
            <p>
              联系方式：<span class="highlight-cyan">{{ main.phone }}</span>
            </p>
            <p>
              地址：<span>{{ main.addr }}</span>
            </p>
          </div>
          <div class="machinery-tags" v-if="info.list?.length > 0">
            <div class="machine-tag" v-for="item in info.list">
              <img v-if="item.itemCode.includes('Demand')" src="../../assets/buy.png" class="tag-icon" />
              <img v-else src="../../assets/price.png" class="tag-icon" />
              <p>
                {{ item.itemName }}：<span class="highlight-cyan">{{ item.itemValue }}</span>
              </p>
            </div>
          </div>
          <div class="section-title">简介：</div>
          <p class="intro-text">
            {{ main.intro }}
          </p>
        </div>
        <div class="modal-right">
          <div class="mainI" v-for="(item, index) in mainOther" :key="index" @click="change(item)">
            <p :class="main.id == item.id ? 'onclick' : ''">
              {{ item.mainName }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMainExtById } from '../../api/dataService'
export default {
  name: 'StoragePointDetail',
  props: {
    visible: { type: Boolean, default: false },
    mainInfo: { type: Object, default: '' },
    mainOther: { type: Array, default: true },
  },
  data() {
    return {
      machinery: [],
      main: {},
      info: {},
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    change(item) {
      console.log(item)

      this.main = item
      this.getMainById()
    },
    getMainById() {
      let param = {
        id: this.main.id,
      }
      getMainExtById(param).then(res => {
        console.log(res.data)
        this.info = {
          ...res.data,
          list: res.data?.extJson?.filter(item => item.itemValue),
        }
      })
    },
  },
  watch: {
    mainInfo(newVal) {
      this.main = newVal
      this.getMainById()
    },
  },
}
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
.modal-body {
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
}
.modal-container {
  width: 1000px;
  background: #021132;
  border: 1px solid #0757db;
  box-shadow: 0 0 20px rgba(7, 87, 219, 0.5);
  padding: 12px 30px;
  position: relative;
  max-height: 800px;
  overflow-y: auto;
}
.modal-left {
  width: 75%;
  border-right: 1px solid #17e1ff;
  min-height: 600px;
}
.modal-right {
  width: 24%;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  max-height: 700px;
  overflow-y: scroll;
  .mainI {
    width: 90%;
    height: 40px;
    border-bottom: 1px solid #17e1ff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    p {
      width: 100%;
      color: #fff;
      // line-height: 1.8;
      font-size: 16px;
      opacity: 0.9;
      // text-align: justify;
      // text-indent: 2em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .mainI:last-child {
    border: none !important;
  }
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
  gap: 12px;
  padding-right: 16px;
  align-items: center;
  // justify-content: space-between;
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
  padding-right: 12px;
}

.photo-gallery {
  margin-top: 15px;
  .site-img {
    height: 280px;
    max-width: 45%;
  }
}
.onclick {
  color: #17e1ff !important;
}
</style>
