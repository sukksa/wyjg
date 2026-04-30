<template>
  <div class="home">
    <ViewHeader />
    <div class="map-box">
      <ul class="info-list">
        <li><img src="@/assets/icon4.png" alt="" /> 加工销售中心</li>
      </ul>
      <div class="map" id="myMap" style="display: block"></div>
    </div>
    <div class="leftBox">
      <StrawIncorporation3DPie />
      <StrawProduction />
      <ProductionOverTheYears />
    </div>
    <div class="rightBox">
      <!-- <StrawIncorporation /> -->
      <StrawDistrict @handleDistrictClick="handleDistrictClick"></StrawDistrict>
      <TownshipsStrawIncorporation />
      <StrawUtilizationUnit />
    </div>
    <DistrictDetails :visibles="visibles" :code="currentDistrictCode" @close="visibles = false" />
    <img src="../assets/left.png" alt="" class="left" />
    <img src="../assets/right.png" alt="" class="right" />
    <img src="../assets/bottom.png" alt="" class="bottom" />
  </div>
</template>

<script>
import { getArea, getHoggery, getTownList, getHoggeryReport, getAllChildrenRegionTree } from '../api/dataService'
import pigImg from '../assets/pig.png'
import yzc from '../assets/yzc.png'
import moment from 'moment'
import utils from '../utils/utils'
import ViewHeader from '@/components/new/ViewHeader.vue'
import StrawProduction from '@/components/new/StrawProduction.vue'
import StrawIncorporation3DPie from '@/components/new/StrawIncorporation3DPie.vue'
import ProductionOverTheYears from '@/components/new/ProductionOverTheYears.vue'
import StrawIncorporation from '@/components/new/StrawIncorporation.vue'
import TownshipsStrawIncorporation from '@/components/new/TownshipsStrawIncorporation.vue'
import StrawUtilizationUnit from '@/components/new/StrawUtilizationUnit.vue'
import DistrictDetails from '@/components/new/DistrictDetails.vue'
import StrawDistrict from '@/components/new/StrawDistrict.vue'
import icon4 from '@/assets/icon4.png'
import router from '@/router'
import { districtGetDistrictList } from '@/api/homeApi'
const SIZENUM = utils.getSizeNum4()
const NEWSIZE = utils.getSizeNum()
const colors = [
  { name: 'xc', color: '#2FEF2F' },
  { name: 'gs', color: '#407DFA' },
  { color: '#FAD731' },
  { color: '#1335E1' },
  { color: '#2AD79C' },
]
const colorsMap = new Map([
  ['511024114', '#2fef2f'],
  ['511024105', '#fad731'],
  ['511024102', '#1335e1'],
  ['511024106', '#407dfa'],
  ['511024115', '#2ad79c'],
])
export default {
  name: 'HomeView',
  components: {
    StrawProduction,
    ProductionOverTheYears,
    StrawIncorporation3DPie,
    StrawIncorporation,
    TownshipsStrawIncorporation,
    StrawUtilizationUnit,
    ViewHeader,
    DistrictDetails,
    StrawDistrict,
  },
  data() {
    return {
      pigImg,
      yzc,
      options: [],
      value: 0,
      map: {},
      townList: [],
      pigId: '',
      showPig: false,
      highlightCounty: {},
      countryPath: [],
      countryCenter: new BMapGL.Point(104.602815, 29.532482),
      towmMap: new Map(),
      townInfo: {},
      showInfoBox: false,
      isEarthMap: true,
      edition: 1,
      visibles: false,
      title: '',
      districtList: [],
      currentDistrictCode: '',
      currentDistrict: {},
      mapStyle: {
        height: '1074px',
        transform: 'scaleY(1)',
      },
      hoverLabel: null,
    }
  },
  methods: {
    adjustMapScale() {
      const sY = window.currentScaleY || 1
      const designHeight = 1074

      this.mapStyle = {
        height: `${designHeight * sY}px`,
        transform: `scaleY(${1 / sY})`,
      }

      const mapEl = document.getElementById('myMap')
      if (mapEl) {
        mapEl.style.height = this.mapStyle.height
        mapEl.style.transform = this.mapStyle.transform

        if (this.map && this.map.resize) {
          this.map.resize()
        }
      }
    },
    handleDistrictClick(e) {
      this.currentDistrictCode = e
      this.visibles = true
    },
    fetchDistrict() {
      return new Promise(resolve => {
        districtGetDistrictList().then(res => {
          this.districtList = res.data.map((item, index) => ({ ...item, color: colorsMap.get(item.districtCode) }))
          resolve()
        })
      })
    },
    getArea() {
      let param = {}
      getArea(param).then(res => {
        if (res.isSuccess) {
          let options = []
          options.push({
            value: 0,
            label: '中江县',
          })
          res.data.forEach(item => {
            options.push({
              value: item.itemCode,
              label: item.itemName,
            })
          })
          this.options = options
          // this.value = 0;
        }
      })
    },
    getTownList() {
      var date = new moment(new Date()).add(-1, 'months')
      var endMonth = new moment(new Date()).add(-1, 'months')
      let param = {
        page: 1,
        pageSize: 10000,
        searchDto: {
          areaId: null,
          startMonth: date.format('yyyy-MM-01'),
          endMonth: endMonth.format('yyyy-MM-01'),
        },
      }
      getTownList(param).then(res => {
        this.townList = res.data.dataList
        this.initTownData()
      })
    },
    getPigList() {
      let param = {}
      getHoggeryReport(param).then(res => {
        res.data.map((item, index) => {
          let myIcon = new BMapGL.Icon(this.yzc, new BMapGL.Size(30 * NEWSIZE, 60 * NEWSIZE), {
            anchor: new BMapGL.Size(15, 55 * NEWSIZE),
          })

          let pointItem = new BMapGL.Point(item.lng, item.lat)
          let marker = new BMapGL.Marker(pointItem, { icon: myIcon }) // 创建标注
          // marker.setIcon
          marker.hoggeryCode = item.hoggeryCode
          marker.hide()
          let that = this
          marker.addEventListener('click', function (evt) {
            that.showPigDetail(evt.currentTarget.hoggeryCode)
          })
          this.map.addOverlay(marker)

          let town = this.towmMap.get(item.areaName)

          town.markerArrData.push(marker)
        })
      })
    },
    //初始化地图
    async initMapData() {
      let param = {
        parentId: '511024',
        depth: 1,
      }
      const res = await getAllChildrenRegionTree(param)
      //
      for (const item of res.data) {
        // 从接口获取区域编码，动态加载地图文件
        const area = await import(`/public/dist/${item.id}.js`)
        this.towmMap.set(item.areaName, {
          code: item.id,
          path: area.path[0].map(val => {
            return new BMapGL.Point(val[0], val[1])
          }),
          geometryCenter: new BMapGL.Point(
            item.areaCenter ? item.areaCenter[1] : null,
            item.areaCenter ? item.areaCenter[0] : null,
          ),
          townCenter: new BMapGL.Point(
            item.areaCenter ? item.areaCenter[1] : null,
            item.areaCenter ? item.areaCenter[0] : null,
          ),
          markerArrData: [],
        })
      }

      await this.fetchDistrict()
      this.handleTownPoly()

      // const zjgeometryStr = localStorage.getItem('zjgeometryBD20')
      // const area=await import(`/public/dist/wy_zhen/${511024100}.js`)

      // if (zjgeometryStr != null) {
      //   let zjgeometry = JSON.parse(zjgeometryStr)
      //   zjgeometry.forEach(item => {

      //   })
      //
      //   this.getPigList()
      // } else {
      //   this.loadScript()
      // }
    },
    loadScript() {
      const script = document.createElement('script')
      script.src = './js/ZJ.BD09.20.2.json'
      script.async = true
      script.onload = this.initMapData // 加载完成后执行下面的方法
      document.body.appendChild(script)
    },
    //乡镇边界
    handleTownPoly() {
      this.towmMap.forEach((item, key) => {
        let path = item.path
        let townName = key

        //乡镇边界
        let fillColor = '#0078ff'

        this.districtList.forEach(d => {
          if (d.areas.findIndex(i => i === item.code) > -1) {
            fillColor = d.color
          }
        })

        const polygon = new BMapGL.Polygon(path, {
          strokeColor: '#90ff00',
          strokeWeight: 1.5,
          strokeOpacity: 0.5,
          fillColor,
          fillOpacity: 0.8,
        })

        const position = polygon.getBounds().getCenter()

        polygon.code = item.code
        polygon.name = key
        this.map.addOverlay(polygon)

        //3D棱柱
        // let prism = new BMapGL.Prism(path, 300, {
        //   topFillColor: "#017cf7",
        //   topFillOpacity: 0.1,
        //   sideFillColor: "#017cf7",
        //   sideFillOpacity: 0.9,
        // });
        // this.map.addOverlay(prism);

        //区域掩膜
        // const mapMask = new BMapGL.MapMask(path, {
        //   // isBuildingMask: true, // 楼块是否参与掩膜
        //   // isPoiMask: true, // poi标注是否参与掩膜
        //   // isMapMask: true, // 底图是否参与掩膜
        //   // showRegion: "inside", // 显示区域范围以内部分

        //   isBuildingMask: true,
        //   isPoiMask: true,
        //   isMapMask: true,
        //   showRegion: "inside", //outside
        //   topFillColor: "#5679ea",
        //   topFillOpacity: 0.5,
        //   sideFillColor: "#5679ea",
        //   sideFillOpacity: 0.9,
        // });
        // this.map.addOverlay(mapMask);

        //乡镇名称
        const opts = {
          position: position, // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(-28, -30), // 设置文本偏移量
        }

        // 创建文本标注对象
        const labelTownName = new BMapGL.Label(townName, opts)

        // 自定义文本标注样式
        labelTownName.setStyle({
          color: 'white',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '24px',
          fontFamily: '微软雅黑',
        })
        labelTownName.code = item.code
        labelTownName.name = key
        this.map.addOverlay(labelTownName)
        polygon.on('click', this.clickBEvent)
        labelTownName.on('click', this.clickBEvent)
        // polygon.on('mousemove', this.mouseoverEvent)
        // polygon.on('mouseout', this.mouseoutEvent)

        item.path = path
        item.polygon = polygon

        item.labelTownName = labelTownName
        item.center = position
      })
      this.tomark()
    },
    mouseoverEvent(e) {
      e.currentTarget.setFillColor('#33d127') // console.log(e);
      e.currentTarget.setFillOpacity('0.8')
      this.townList.forEach((item, index) => {
        if (item.areaName == e.currentTarget.name) {
          this.showInfoBox = true
          this.townInfo = item
        }
      })
    },
    mouseoutEvent(e) {
      let fillColor = '#0078ff'
      let code = e.currentTarget.code
      this.districtList.forEach(d => {
        if (d.areas.findIndex(i => i === code) > -1) {
          fillColor = d.color
        }
      })
      e.currentTarget.setFillColor(fillColor)
      e.currentTarget.setFillOpacity('0.8')
    },
    clickBEvent(e) {
      e.currentTarget.setFillColor('#0078ff')
      e.currentTarget.setFillOpacity('0.3')
      this.value = e.currentTarget.code
      this.showInfoBox = false
      const townName = e.currentTarget.name
      router.push({
        path: '/county',
        query: {
          id: e.currentTarget.code,
          name: e.currentTarget.name,
          latLng: e.latLng,
        },
      })
      // this.showTown(townName)
    },
    //初始化乡镇总数
    initTownData() {
      this.townList.forEach((item, idnex) => {
        let town = this.towmMap.get(item.areaName)
        const position = town.geometryCenter //获取中心点
        let num = item.stockNumAlpha
        //乡镇名称
        const opts = {
          position: position, // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(-28, 0), // 设置文本偏移量
        }
        // 创建文本标注对象
        const labelTownNum = new BMapGL.Label(num + '', opts)
        // 自定义文本标注样式
        labelTownNum.setStyle({
          color: 'white',
          border: 'none',
          backgroundColor: 'none',
          fontSize: '16px',
          fontFamily: '微软雅黑',
        })
        this.map.addOverlay(labelTownNum)

        town.labelTownNum = labelTownNum
      })
    },
    showPigDetail(id) {
      this.pigId = id
      this.showPig = true
    },
    closePigDetail() {
      this.showPig = false
    },
    //切换
    selectProductType(data) {
      this.showInfoBox = false
      if (data == 0) {
        this.showCountry()

        return
      }
      this.options.forEach(item => {
        if (item.value == data) {
          this.value = data[0]
          this.showTown(item.label)
        }
      })
    },
    //显示镇数据
    showTown(townName) {
      const town = this.towmMap.get(townName)
      this.towmMap.forEach((item, key) => {
        if (key != townName) {
          item.polygon.hide()
          // item.border.hide();
          // item.mapMask.hide();
          item.labelTownName.hide()
          if (item.labelTownNum) {
            item.labelTownNum.hide()
          }
          item.markerArrData.forEach(items => {
            items.hide()
          })
        } else {
          item.polygon.show()
          // item.border.show();
          // item.mapMask.show();
        }
      })
      this.map.centerAndZoom(town.townCenter, 14)
      if (town.labelTownNum) {
        town.labelTownNum.hide()
      }
      town.labelTownName.hide()
      town.polygon.off('click', this.clickBEvent)
      town.polygon.off('mousemove', this.mouseoverEvent)
      town.polygon.off('mouseout', this.mouseoutEvent)
      town.markerArrData.forEach(item => {
        item.show()
      })
      // this.highlightcounty.hide();
    },
    showCountry(res) {
      this.hidTown()

      this.map.centerAndZoom(this.countryCenter, 11.5)
      setTimeout(() => {
        this.map.setTilt(45)
      }, 1000)
      // this.highlightCounty.show();
    },
    hidTown() {
      this.towmMap.forEach((item, key) => {
        item.polygon.show()
        // item.border.show();
        // item.mapMask.show();
        item.labelTownName.show()
        if (item.labelTownNum) {
          item.labelTownNum.show()
        }

        item.polygon.on('click', this.clickBEvent)
        item.polygon.on('mousemove', this.mouseoverEvent)
        item.polygon.on('mouseout', this.mouseoutEvent)

        item.markerArrData.forEach(item1 => {
          item1.hide()
        })
      })
    },
    outlogin() {
      // window.localStorage.clear();
      // window.sessionStorage.clear();
      this.$router.push('/')
    },

    //加载球形地图
    loadEarthMap() {
      this.map.centerAndZoom(this.countryCenter, 4) // 初始化地图,设置中心点坐标和地图级别
      this.map.setMapType(BMAP_EARTH_MAP) //地球模式

      this.map.disableDoubleClickZoom()

      // 创建标注
      var iconTitle = '四川省内江市威远县'
      var myIcon = new BMapGL.Icon(this.yzc, new BMapGL.Size(30 * NEWSIZE, 60 * NEWSIZE), {
        anchor: new BMapGL.Size(15, 55 * NEWSIZE),
      })
      let baiduMarker = new BMapGL.Marker(new BMapGL.Point(this.countryCenter.lng, this.countryCenter.lat), {
        icon: myIcon,
      })
      this.map.addOverlay(baiduMarker)

      //创建label文本标注(地球模式无效)
      var labelopts = {
        position: new BMapGL.Point(this.countryCenter.lng, this.countryCenter.lat), // 指定文本标注所在的地理位置
        offset: new BMapGL.Size(-75, 10), // 设置文本偏移量
      }
      let label = new BMapGL.Label(iconTitle, labelopts)
      // 自定义文本标注样式
      label.setStyle({
        color: 'blue',
        borderRadius: '5px',
        borderColor: '#ccc',
        padding: '5px',
        fontSize: '14px',
        height: '30px',
        lineHeight: '30px',
        fontFamily: '微软雅黑',
      })
      this.map.addOverlay(label)

      //逐级放大地图显示
      setTimeout(() => {
        this.map.setMapType(BMAP_SATELLITE_MAP)
        this.map.centerAndZoom(this.countryCenter, 4)
        this.map.removeOverlay(baiduMarker)
      }, 3 * 1000)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 4.5);
      // }, 3100);
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 5);
      // }, 3200);
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 5.5);
      // }, 3300);
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 6)
      }, 3400)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 6.5);
      //   this.map.removeOverlay(label);
      // }, 3500);
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 7)
      }, 3600)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 7.5);
      // }, 3700);
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 8)
      }, 3800)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 8.5);
      // }, 3900);
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 9)
      }, 4000)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 9.5);
      // }, 4100);
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 10)
      }, 4200)
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 10.5);
      // }, 4300);
      // setTimeout(() => {
      //   this.map.centerAndZoom(this.countryCenter, 11);
      // }, 4400);
      setTimeout(() => {
        this.map.removeOverlay(label)
        this.map.centerAndZoom(this.countryCenter, 11.6)
      }, 4500)
    },
    scriptLoadeds() {
      console.log('缓存完成')
    },
    async draw() {
      let cmap = this.map
      var bd = new BMapGL.Boundary()

      //自定义区界
      const area = await import('/public/dist/511024.js')

      var path = []
      area.path[0].map(val => {
        path.push(new BMapGL.Point(val[0], val[1]))

        // return new BMapGL.Point(val[0], val[1]);
      })
      const mapMask = new BMapGL.MapMask(path, {
        // isBuildingMask: true, // 楼块是否参与掩膜
        // isPoiMask: true, // poi标注是否参与掩膜
        // isMapMask: true, // 底图是否参与掩膜
        // showRegion: "inside", // 显示区域范围以内部分

        isBuildingMask: true,
        isPoiMask: true,
        isMapMask: true,
        showRegion: 'inside', //outside
        topFillColor: '#5679ea',
        topFillOpacity: 0.2,
        sideFillColor: '#5679ea',
        sideFillOpacity: 0.9,
      })
      cmap.addOverlay(mapMask)

      //绘制线条;
      // var border = new BMapGL.Polyline(path, {
      //   strokeColor: "#022565",
      //   strokeWeight: 2,
      //   strokeOpacity: 1,
      // });
      // cmap.addOverlay(border);

      // 3D棱柱
      var prism = new BMapGL.Prism(path, 500, {
        topFillColor: '#39eabe',
        topFillOpacity: 0.1,
        sideFillColor: '#39eabe',
        sideFillOpacity: 0.6,
      })
      cmap.addOverlay(prism)

      setTimeout(() => {
        cmap.setTilt(25.5) //设置地图的倾斜角度
      }, 500)
    },
    tomark() {
      this.districtList.forEach((item, index) => {
        let myIcon = new BMapGL.Icon(icon4, new BMapGL.Size(40 * NEWSIZE, 40 * NEWSIZE), {
          anchor: new BMapGL.Size(20 * NEWSIZE, 20 * NEWSIZE),
        })
        // myIcon.setImageSize(new BMapGL.Size(44 * NEWSIZE, 88 * NEWSIZE)); //设置图标大小
        let pointItem = new BMapGL.Point(item.districtCenter[0], item.districtCenter[1])
        let marker = new BMapGL.Marker(pointItem, {
          icon: myIcon,
          zIndex: 9999,
        })
        marker.districtCode = item.districtCode
        marker.districtName = item.districtName
        const that = this
        marker.addEventListener('click', e => {
          if (e.domEvent) {
            e.domEvent.stopPropagation()
          }
          const clickedMarker = e.currentTarget
          this.currentDistrictCode = clickedMarker.districtCode
          this.currentDistrict = this.districtList.find(item => item.districtCode == clickedMarker.districtCode)
          this.visibles = true
        })
        marker.addEventListener('mouseover', function () {
          that.hoverLabel.setContent(item.districtName)
          that.hoverLabel.setPosition(this.getPosition())
          that.hoverLabel.show()
        })

        marker.addEventListener('mouseout', function () {
          that.hoverLabel.hide()
        })
        this.map.addOverlay(marker)
      })
      this.map.resize()
    },
    initHoverLabel() {
      this.hoverLabel = new BMapGL.Label('', {
        offset: new BMapGL.Size(0, -30),
      })

      this.hoverLabel.setStyle({
        color: '#fff',
        borderColor: 'transparent',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      })

      this.hoverLabel.hide()

      this.map.addOverlay(this.hoverLabel)
    },
  },
  created() {
    // this.$store.commit("save_show_loading", true);
  },
  mounted() {
    if (this.map) {
      //this.map.destroy();
    }
    // 初始化地图
    this.map = new BMapGL.Map('myMap')
    this.map.enableScrollWheelZoom(true)
    this.map.disableDoubleClickZoom()
    //3D视觉
    //加载区域数据
    // this.getArea()
    this.initMapData()

    var style_map = [
      {
        // 地图背景
        featureType: 'land',
        elementType: 'all',
        stylers: {
          color: '#05193a',
          lightness: -1,
        },
      },
    ] //将样式加载到地图中
    this.map.setMapStyleV2({ styleJson: eval('style_map') })

    if (!this.isEarthMap) {
      this.map.centerAndZoom(this.countryCenter, 12) // 初始化地图,设置中心点坐标和地图级别
      this.map.setMapType(BMAP_SATELLITE_MAP) // 设置地图类型为普通卫星地图模式

      this.map.setTilt(35.5) //设置地图的倾斜角度
    } else {
      this.loadEarthMap()
    }

    //路网
    this.map.setDisplayOptions({
      street: false, //是否显示路网（只对卫星图和地球模式有效）
      poi: false,
      poiText: false,
      poiIcon: false,
      // overlay: false,
    })
    setTimeout(() => {
      this.draw()
    }, 6000)
    this.initHoverLabel()
    this.adjustMapScale()
    window.addEventListener('scale-change', this.adjustMapScale)
  },
  watch: {},
}
</script>
<style lang="scss">
.home {
  width: 100vw;
  height: 1080px;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-wrap: wrap;
  background-color: black;
  position: relative;
  .main {
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-content: flex-start;
  }
}

.leftBox {
  width: 500px;
  height: 960px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  z-index: 10;
}
.rightBox {
  width: 500px;
  height: 960px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  z-index: 10;
}
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
}
.left {
  position: absolute;
  left: 0;
  top: 80px;
  z-index: 10;
}
.right {
  position: absolute;
  right: 0;
  top: 80px;
  z-index: 10;
}
.selectBox {
  width: 140px;
  height: 40px;
  position: absolute;
  top: 100px;
  left: 550px;
  z-index: 10;
}
.map {
  width: 100%;
  height: 1074px;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
}
.map > div:nth-child(2) {
  z-index: 0 !important;
}
.map > div:nth-child(2) > div:nth-child(2) > div {
  display: none !important;
}
.map > div:nth-child(4) > div:nth-child(2) > div {
  display: none !important;
}
.el-input__inner {
  background-color: #008aff !important;
  border: 1px solid #16f7ff !important;
  color: white !important;
}
.el-scrollbar {
  background-color: #008aff !important;
}
.el-select-dropdown__item {
  color: white !important;
}
.selected {
  color: white !important;
}
.hover {
  color: #a7c8ff !important;
}

.infoBox {
  width: 200px;
  // height: 260px;
  background: rgba(4, 48, 161, 0.6);
  position: absolute;
  top: 101px;
  right: 535px;
  z-index: 12;
  border: 1px solid #16f7ff;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
  padding-bottom: 20px;
}
.infoBox > p {
  width: 90%;
  color: white;
  font-size: 16px;
  font-family: Source Han Sans CN;
  margin-top: 15px;
}
.el-popper {
  width: 140px !important;
}
.el-scrollbar {
  min-width: 140px !important;
}
.is-active {
  color: white !important;
}
.el-cascader-menu {
  color: white !important;
}
.el-cascader-node:hover {
  background: #1666de !important;
}
.map > div:nth-child(3) > img {
  display: none !important;
}
.map > div:nth-child(6) > span {
  display: none !important;
}
.map-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  .town {
    cursor: pointer;
    position: absolute;
    z-index: 10;
    top: 100px;
    left: 540px;
    font-size: 18px;
    line-height: 50px;
    color: #ffffff;
    z-index: 20;
    padding: 0 6px;
    background-image: url('@/assets/town-btn.png');
    background-size: 100% 100%;
    min-width: 150px;
    height: 42px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 24px;
      height: 30px;
      cursor: pointer;
    }
  }
  .info-list {
    position: absolute;
    z-index: 10;
    top: 100px;
    right: 540px;
    background-color: #12175c;
    padding: 12px 16px;
    color: #fff;
    width: 120px;

    & > li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      .img-icon {
        width: 20px;
        height: 20px;
        border-radius: 6px;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
