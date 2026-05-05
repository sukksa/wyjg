<template>
  <div class="home">
    <ViewHeader :back="true" />
    <div class="map-box">
      <div
        class="town"
        @click="
          () => {
            showTownList = !showTownList
            showInfo = false
          }
        ">
        <img src="@/assets/arrow-left.png" alt="" />
        {{ townName }}
        <img src="@/assets/arrow-right.png" alt="" />
      </div>
      <div class="town-list" v-if="showTownList">
        <div class="town-list-item" v-for="(item, index) of countys">
          <div class="town-list-item-name" @click="handleTownListClick(index)">{{ item.areaName }}</div>
        </div>
      </div>
      <div
        class="town"
        @click="
          () => {
            showTownList = !showTownList
            showInfo = false
          }
        ">
        <img src="@/assets/arrow-left.png" alt="" />
        {{ townName }}
        <img src="@/assets/arrow-right.png" alt="" />
      </div>
      <div class="town-list" v-if="showTownList">
        <div class="town-list-item" v-for="(item, index) of countys">
          <div class="town-list-item-name" @click="handleTownListClick(index)">{{ item.areaName }}</div>
        </div>
      </div>
      <div class="townInfo" v-if="showInfo">
        <div class="infoT">
          <p>{{ farmInfo.name + farmInfo.type }}区</p>
          <img src="../assets/close.png" alt="" @click="closeInfo" />
        </div>
        <div class="infoC">
          <div class="infoL">
            <p>秸杆产量:{{ farmInfo.num }}吨</p>
            <p>种植面积:{{ farmInfo.areaN }}亩</p>
            <p>种植类型：{{ farmInfo.type }}</p>
          </div>
          <div class="infoR">
            <p class="infoM">辐射主体</p>
            <p class="infoN" v-if="newList.length == 0 ? true : false">暂无主体</p>
            <p
              class="infoN"
              v-for="(item, index) in newList"
              :key="index"
              @click="showMainInfoPopup(item)"
              style="cursor: pointer">
              {{ item.mainName }}
            </p>
          </div>
        </div>
      </div>
      <ul class="info-list">
        <li><img src="@/assets/mainL.png" alt="" /> 经营主体</li>
        <li><img src="@/assets/icon4.png" alt="" /> 转运压缩中心</li>
        <li v-for="(item, index) in color">
          <div class="img-icon" :style="{ backgroundColor: item }"></div>
          {{ category[index] }}
        </li>
      </ul>
      <div class="map" id="myMap" style="display: block"></div>
    </div>
    <div class="leftBox">
      <StatisticsOfStrawYield :areaId="townId" :areaName="townName" />
      <StrawYieldAreaData :townId="townId" />
      <CurrentBusinessEntity :townId="townId" />
    </div>
    <div class="rightBox">
      <StrawReturningQuantityTrend :townId="townId" />
      <StrawCollectableAmount :areaId="townId" />
      <AgriculturalMachinery :agricultural="agricultural" />
    </div>
    <StoragePointDetail :visible="visible" :mainOther="mainOther" :mainInfo="mainInfo" @close="visible = false" />
    <StoragePointDetails :visibles="visibles" :mainInfo="mainInfo" @close="visibles = false" />
    <img src="../assets/left.png" alt="" class="left" />
    <img src="../assets/right.png" alt="" class="right" />
    <img src="../assets/bottom.png" alt="" class="bottom" />
  </div>
</template>
<script>
import ViewHeader from '@/components/new/ViewHeader.vue'
import StrawYieldAreaData from '@/components/new/StrawYieldAreaData.vue'
import CurrentBusinessEntity from '@/components/new/CurrentBusinessEntity.vue'
import StatisticsOfStrawYield from '@/components/new/StatisticsOfStrawYield.vue'
import StrawReturningQuantityTrend from '@/components/new/StrawReturningQuantityTrend.vue'
import StrawCollectableAmount from '@/components/new/StrawCollectableAmount.vue'
import AgriculturalMachinery from '@/components/new/AgriculturalMachinery.vue'
import StoragePointDetail from '@/components/new/StoragePointDetail.vue'
import StoragePointDetails from '@/components/new/StoragePointDetails.vue'
import icon1 from '@/assets/mainL.png'
import icon2 from '@/assets/icon2.png'
import icon3 from '@/assets/icon3.png'
import icon4 from '@/assets/icon4.png'
import star from '@/assets/star.png'
import { getAllChildrenRegionTree } from '../api/dataService'
import utils from '../utils/utils'
const SIZENUM = utils.getSizeNum4()
const NEWSIZE = utils.getSizeNum()
import { getMainList, getData } from '../api/dataService'
export default {
  components: {
    StrawYieldAreaData,
    CurrentBusinessEntity,
    StatisticsOfStrawYield,
    StrawReturningQuantityTrend,
    StrawCollectableAmount,
    AgriculturalMachinery,
    StoragePointDetail,
    ViewHeader,
    StoragePointDetails,
  },
  name: 'CountyView',
  data() {
    return {
      icon1,
      icon2,
      icon3,
      icon4,
      star,
      townName: '',
      townId: '',
      visible: false,
      visibles: false,
      countryCenter: null,
      map: {},
      towmMap: new Map(),
      color: ['#EB3E8D', '#B4E027', '#6A48D7', '#27E08C', '#2B96F1'],
      category: ['水稻', '玉米', '小麦', '油菜', '其他'],
      mainList: [
        {
          lng: '104.523862',
          lat: '29.634214',
          icon: icon1,
          type: 'farm',
          areaId: '511024114',
        },
        {
          lng: '104.522079',
          lat: '29.621816',
          icon: icon2,
          type: 'farm',
          areaId: '511024114',
        },
        {
          lng: '104.536773',
          lat: '29.637873',
          icon: icon3,
          type: 'farm',
          areaId: '511024114',
        },
        {
          lng: '104.55814120105312',
          lat: '29.61756677137862',
          icon: icon4,
          type: 'start',
          areaId: '511024114',
          name: '新场镇',
        },
        {
          lng: '104.66146577572351',
          lat: '29.587702286342903',
          icon: icon4,
          type: 'start',
          areaId: '511024100',
          name: '严陵镇',
        },
        {
          lng: '104.68542998307409',
          lat: '29.459148313978687',
          icon: icon4,
          type: 'start',
          areaId: '511024102',
          name: '新店镇',
        },
        {
          lng: '104.72395354730642',
          lat: '29.41029717381025',
          icon: icon4,
          type: 'start',
          areaId: '511024103',
          name: '向义镇',
        },
        {
          lng: '104.71982905038965',
          lat: '29.444933097985345',
          icon: icon4,
          type: 'start',
          areaId: '511024104',
          name: '界牌镇',
        },
        {
          lng: '104.77354585225912',
          lat: '29.52641260036655',
          icon: icon4,
          type: 'start',
          areaId: '511024105',
          name: '龙会镇',
        },
        {
          lng: '104.73538653014768',
          lat: '29.597516444740712',
          icon: icon4,
          type: 'start',
          areaId: '511024106',
          name: '高石镇',
        },
        {
          lng: '104.81890580717378',
          lat: '29.524777076174388',
          icon: icon4,
          type: 'start',
          areaId: '511024107',
          name: '东联镇',
        },
        {
          lng: '104.59836135989329',
          lat: '29.4721502664545',
          icon: icon4,
          type: 'start',
          areaId: '511024109',
          name: '镇西镇',
        },
        {
          lng: '104.67512741463054',
          lat: '29.586453786932044',
          icon: icon4,
          type: 'start',
          areaId: '511024111',
          name: '山王镇',
        },
        {
          lng: '104.59041004150781',
          lat: '29.684457111105452',
          icon: icon4,
          type: 'start',
          areaId: '511024113',
          name: '观英滩镇',
        },
        {
          lng: '104.54353806989477',
          lat: '29.780131776989506',
          icon: icon4,
          type: 'start',
          areaId: '511024115',
          name: '连界镇',
        },
        {
          lng: '104.46419616862636',
          lat: '29.66652450094823',
          icon: icon4,
          type: 'start',
          areaId: '511024116',
          name: '越溪镇',
        },
        {
          lng: '104.30245047844319',
          lat: '29.63212276810757',
          icon: icon4,
          type: 'start',
          areaId: '511024119',
          name: '小河镇',
        },
      ],
      showfarm: false,
      farmInfo: {},
      title: '',
      showInfo: false,
      countys: [],
      countyIndex: 0,
      showMap: true,
      mainL: [
        '四川至邦润沣农业科技有限公司',
        '威远县丰源种植农民专业合作社',
        '威远县乾鸿种植有限公司',
        '威远县杨岗家庭农场',
        '威远县陈彬家庭农场',
        '威远新场镇石梁子家庭农场',
        '蒲加刚山羊养殖场',
        '唐刚山羊养殖场',
        '邓修才山羊养殖场',
        '罗香友山羊养殖场',
        '姚西山羊养殖场',
        '花千谷养殖农场',
        '侯仁兵家庭养殖农场',
        '万鑫种养殖家庭农场',
      ],
      newList: [],
      showTownList: false,
      clearMarkers: [],
      mainInfo: {},
      agricultural: {},
      mainOther: [],
      mapStyle: {
        height: '1074px',
        transform: 'scaleY(1)',
      },
      hoverLabel: null,
    }
  },
  methods: {
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
    handleLeftClick() {
      if (this.countyIndex <= 0) this.countyIndex = this.countys.length - 1
      else this.countyIndex--
      this.latLng = {
        lng: this.countys[this.countyIndex].areaCenter[0],
        lat: this.countys[this.countyIndex].areaCenter[1],
      }
      this.townId = this.countys[this.countyIndex].id
      this.townName = this.countys[this.countyIndex].areaName
      this.map.clearOverlays()
      this.towmMap = new Map()
      // this.map = null
      // this.showMap = false
      // this.showMap = true
      this.mountedMapData()

      const overlays = this.map.getOverlays() // 获取所有覆盖物
      for (let i = overlays.length - 1; i >= 0; i--) {
        if (overlays[i] instanceof BMapGL.Marker) {
          this.map.removeOverlay(overlays[i])
        }
      }
      this.tomark()
    },
    handleRightClick() {
      if (this.countyIndex >= this.countys.length - 1) this.countyIndex = 0
      else this.countyIndex++
      this.latLng = {
        lng: this.countys[this.countyIndex].areaCenter[0],
        lat: this.countys[this.countyIndex].areaCenter[1],
      }
      this.townId = this.countys[this.countyIndex].id
      this.townName = this.countys[this.countyIndex].areaName
      this.map.clearOverlays()
      this.towmMap = new Map()
      this.mountedMapData()
      const overlays = this.map.getOverlays() // 获取所有覆盖物
      for (let i = overlays.length - 1; i >= 0; i--) {
        if (overlays[i] instanceof BMapGL.Marker) {
          this.map.removeOverlay(overlays[i])
        }
      }
      this.tomark()
    },
    handleTownListClick(index) {
      this.countyIndex = index
      this.showTownList = false
      this.showInfo = false
      this.latLng = {
        lng: this.countys[this.countyIndex].areaCenter[0],
        lat: this.countys[this.countyIndex].areaCenter[1],
      }
      this.townId = this.countys[this.countyIndex].id
      this.townName = this.countys[this.countyIndex].areaName
      // this.map.clearOverlays()
      this.clearMarkers.forEach(item => this.map.removeOverlay(item))
      this.towmMap = new Map()
      this.countryCenter = new BMapGL.Point(this.latLng.lng, this.latLng.lat)
      this.map.centerAndZoom(this.countryCenter, 13)
      this.initMapData()
      const overlays = this.map.getOverlays() // 获取所有覆盖物
      for (let i = overlays.length - 1; i >= 0; i--) {
        if (overlays[i] instanceof BMapGL.Marker) {
          this.map.removeOverlay(overlays[i])
        }
      }
      this.tomark()
    },
    //初始化地图
    async initMapData() {
      let that = this
      let param = {
        templateCode: ['czzsj'],
        areaId: this.townId,
        isPreciseArea: false,
        startDate: '',
        endDate: '',
        resFiled: ['zuo_wu_ming_cheng', 'yu_ji_jie_gan_chan_liang', 'zhong_zhi_mian_ji', 'fu_she_shi_chang_zhu_ti'],
      }
      let param2 = {
        parentId: this.townId,
      }
      const ress = await getAllChildrenRegionTree(param2)
      const res = await getData(param)

      for (let index = 0; index < ress.data.length; index++) {
        const item = ress.data[index]

        try {
          const area = await import(`/public/dist/${item.id}.js`)

          let realColor = ''
          let type = ''
          let num = ''
          let areaN = ''
          res.data.forEach((items, indexs) => {
            if (items.zuo_wu_ming_cheng == '油菜') {
              realColor = '#27E08C'
            } else if (items.zuo_wu_ming_cheng == '水稻') {
              realColor = '#EB3E8D'
            } else if (items.zuo_wu_ming_cheng == '玉米') {
              realColor = '#B4E027'
            } else if (items.zuo_wu_ming_cheng == '小麦') {
              realColor = '#6A48D7'
            } else if (items.zuo_wu_ming_cheng == '其他') {
              realColor = '#2B96F1'
            }

            // type = items.zuo_wu_ming_cheng
            // num = items.yu_ji_jie_gan_chan_liang
            // areaN = items.zhong_zhi_mian_ji
          })
          that.towmMap.set(item.areaName, {
            code: item.id,
            path: area.path[0].map(val => {
              return new BMapGL.Point(val[0], val[1])
            }),
            color: realColor,
            type: res.data.find(r=> r.area_id == item.id)?.zuo_wu_ming_cheng,
            num:  res.data.find(r=> r.area_id == item.id)?.yu_ji_jie_gan_chan_liang,
            areaN:  res.data.find(r=> r.area_id == item.id)?.zhong_zhi_mian_ji,
            // geometryCenter: new BMapGL.Point(
            //   item.areaCenter ? item.areaCenter[1] : null,
            //   item.areaCenter ? item.areaCenter[0] : null,
            // ),
            // townCenter: new BMapGL.Point(
            //   item.areaCenter ? item.areaCenter[1] : null,
            //   item.areaCenter ? item.areaCenter[0] : null,
            // ),
            markerArrData: [],
          })
        } catch {}
      }
      //   for (const item of res.data) {
      //   // 从接口获取区域编码，动态加载地图文件

      //   // console.log(area.path)

      // }

      this.handleTownPoly()
    },
    loadEarthMap() {
      this.map.centerAndZoom(this.countryCenter, 4) // 初始化地图,设置中心点坐标和地图级别
      this.map.setMapType(BMAP_EARTH_MAP) //地球模式
      this.map.setDisplayOptions({
        street: false, //是否显示路网（只对卫星图和地球模式有效）
      })
      this.map.disableDoubleClickZoom()
      // 创建标注
      var iconTitle = '四川省内江市威远县'
      var myIcon = new BMapGL.Icon(this.yzc, new BMapGL.Size(30 * NEWSIZE, 54 * NEWSIZE), {
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
      setTimeout(() => {
        this.map.centerAndZoom(this.countryCenter, 11)
      }, 4400)
      setTimeout(() => {
        this.map.removeOverlay(label)
        this.map.centerAndZoom(this.countryCenter, 11.8)
      }, 4500)
    },
    //乡镇边界
    handleTownPoly() {
      // this.map.addEventListener('click', e => {
      //   if (e.overlay && e.overlay.clickType === 'polygon') {
      //     this.handleMapClick({ currentTarget: e.overlay })
      //   }
      // })
      this.towmMap.forEach((item, key, index) => {
        let path = item.path
        let townName = key
        // const position =new BMapGL.Point(item.geometryCenter.lat,item.geometryCenter.lng) //获取中心点
        //乡镇边界

        const polygon = new BMapGL.Polygon(path, {
          strokeColor: '#90ff00',
          // strokeColor: "darkred",
          strokeWeight: 3,
          strokeOpacity: 0.5,
          fillColor: item.color,
          fillOpacity: 0.5,
          zIndex: 1,
        })
        //获取中心点
        const position = polygon.getBounds().getCenter()
        polygon.code = item.code
        polygon.name = key
        polygon.originColor = item.color
        polygon.type = item.type
        polygon.num = item.num
        polygon.areaN = item.areaN
        polygon.clickType = 'polygon'
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
          fontSize: '16px',
          fontFamily: '微软雅黑',
        })
        labelTownName.code = item.code
        labelTownName.name = key
        labelTownName.originColor = item.color
        labelTownName.type = item.type
        labelTownName.num = item.num
        labelTownName.areaN = item.areaN
        labelTownName.clickType = 'label'
        this.map.addOverlay(labelTownName)
        labelTownName.addEventListener('click', this.clickBEvent)

        polygon.addEventListener('click', this.clickBEvent)
        // polygon.on('mousemove', this.mouseoverEvent)
        // polygon.on('mouseout', this.mouseoutEvent)

        item.path = path
        item.polygon = polygon
        item.labelTownName = labelTownName
        item.center = position
        this.clearMarkers.push(polygon)
        this.clearMarkers.push(labelTownName)
      })
      // this.getTownList()
    },
    scriptLoadeds() {
      console.log('缓存完成')
    },
    closeInfo() {
      this.showInfo = false
      this.farmInfo = {}
    },
    getRandomThree(arr) {
      // 复制一份，避免修改原数组
      let temp = [...arr]
      let result = []
      for (let i = 0; i < 3; i++) {
        // 随机下标
        let index = Math.floor(Math.random() * temp.length)
        // 取出并从临时数组删除
        result.push(temp.splice(index, 1)[0])
      }
      return result
    },
    clickBEvent(e) {
      this.showInfo = true
      // this.showfarm = false
      this.farmInfo = e.currentTarget
      let param = {
        areaId: e.currentTarget.code,
      }
      getMainList(param).then(res => {
        this.newList = res.data
      })
      // let list = this.getRandomThree(this.mainL)
      // this.newList = list

      // e.currentTarget.setFillColor("#0078ff");
      // e.currentTarget.setFillOpacity("0.3");
      // this.value = e.currentTarget.code;
      // this.showInfoBox = false;
      // const townName = e.currentTarget.name;
      // router.push({
      //   path: "/county",
      //   query: {
      //     id: e.currentTarget.code,
      //     name: e.currentTarget.name,
      //     latLng:e.latLng
      //   },
      // });
      // this.showTown(townName)
    },
    handleMapClick(e) {
      this.showInfo = true
      // this.showfarm = false
      this.farmInfo = e.currentTarget
      let param = {
        areaId: e.currentTarget.code,
      }
      getMainList(param).then(res => {
        this.newList = res.data
      })
    },
    mouseoverEvent(e) {
      e.currentTarget.setFillColor('#33d127') // console.log(e);
      e.currentTarget.setFillOpacity('0.8')
      // this.townList.forEach((item, index) => {
      //   if (item.areaName == e.currentTarget.name) {
      //     this.showInfoBox = true
      //     this.townInfo = item
      //   }
      // })
    },
    mouseoutEvent(e) {
      e.currentTarget.setFillColor(e.currentTarget.originColor)
      e.currentTarget.setFillOpacity('0.5')
    },
    async draw() {
      let cmap = this.map
      var bd = new BMapGL.Boundary()

      //使用百度区界
      // bd.get("中江县", function (rs) {
      // var count = rs.boundaries.length; // 行政区域的点有多少个
      // var count = zjxy20[0].path.length;
      // console.log(count);
      // var path = [];
      // for (var i = 0; i < count; i++) {
      //   path.push(
      //     new BMapGL.Point(zjxy20[0].path[i][0], zjxy20[0].path[i][1])
      //   );
      //   // var str = rs.boundaries[i].replace(" ", "");
      //   // var points = str.split(";");
      //   // for (var j = 0; j < points.length; j++) {
      //   //   var lng = points[j].split(",")[0];
      //   //   var lat = points[j].split(",")[1];
      //   //   path.push(new BMapGL.Point(lng, lat));
      //   // }
      // }

      //自定义区界
      // const zjxy20 = JSON.parse(localStorage.getItem('zjxy20'))
      const area = await import('/public/dist/511024.js')
      // console.log(area);

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
        sideFillOpacity: 1,
      })
      cmap.addOverlay(prism)

      // setTimeout(() => {
      //   cmap.setTilt(35.5) //设置地图的倾斜角度
      // }, 500)
    },
    tomark() {
      let param = {
        areaId: this.townId,
        isPreciseArea: false,
      }
      getMainList(param).then(res => {
        let mainOther = []
        res.data.forEach((item, index) => {
          if (item.mainType == 'MAIN_TYPE_STORAGE') {
            item.icon = this.star
            this.agricultural = item
          } else {
            item.icon = this.icon1
            mainOther.push(item)
          }
        })

        this.mainList = res.data
        this.mainOther = mainOther
        this.mainList.forEach((item, index) => {
          let myIcon = {}
          if (item.mainType == 'MAIN_TYPE_STORAGE') {
            myIcon = new BMapGL.Icon(item.icon, new BMapGL.Size(60 * NEWSIZE, 54 * NEWSIZE), {
              anchor: new BMapGL.Size(30 * NEWSIZE, 30 * NEWSIZE),
            })
          } else {
            myIcon = new BMapGL.Icon(item.icon, new BMapGL.Size(24 * NEWSIZE, 24 * NEWSIZE), {
              anchor: new BMapGL.Size(12 * NEWSIZE, 12 * NEWSIZE),
            })
          }
          var that = this
          // myIcon.setImageSize(new BMapGL.Size(44 * NEWSIZE, 88 * NEWSIZE)); //设置图标大小
          let pointItem = new BMapGL.Point(item.lng, item.lat)
          let marker = new BMapGL.Marker(pointItem, {
            icon: myIcon,
            zIndex: 9999,
          })
          marker.name = item.mainName
          // marker.type = item.type
          marker.addEventListener('click', function (e) {
            if (e.domEvent) {
              e.domEvent.stopPropagation()
            }
            if (item.mainType == 'MAIN_TYPE_STORAGE') {
              that.mainInfo = item
              that.visibles = true
            } else {
              that.mainInfo = item
              that.visible = true
            }
            that.showInfo = false
          })
          marker.addEventListener('mouseover', function () {
            that.hoverLabel.setContent(item.mainName)
            that.hoverLabel.setPosition(this.getPosition())
            that.hoverLabel.show()
          })

          marker.addEventListener('mouseout', function () {
            that.hoverLabel.hide()
          })
          this.map.addOverlay(marker)
        })
      })
    },
    showMainInfoPopup(item) {
      this.mainInfo = item
      this.visible = true
    },
    mountedMapData() {
      this.countryCenter = new BMapGL.Point(this.latLng.lng, this.latLng.lat)
      // 初始化地图
      this.map = new BMapGL.Map('myMap', {
        showVectorStreetLayer: false, // 设置是否加载POI
        showVectorLine: false,
      })

      this.map.enableScrollWheelZoom(true)
      this.map.centerAndZoom(this.countryCenter, 13) // 初始化地图,设置中心点坐标和地图级别
      this.map.setMapType(BMAP_SATELLITE_MAP) // 设置地图类型为普通卫星地图模式
      this.map.setTilt(35.5) //设置地图的倾斜角度
      this.map.disableDoubleClickZoom()
      this.tomark()
      var style_map = [
        {
          featureType: 'land',
          elementType: 'all',
          stylers: {
            color: '#05193a',
            lightness: -1,
          },
        },
      ]
      this.map.setMapStyleV2({ styleJson: style_map })

      this.map.setDisplayOptions({
        street: false, // 隐藏路网
        poi: false, // 隐藏兴趣点图标
        poiText: false, // 隐藏兴趣点文字
        poiIcon: false, // 隐藏兴趣点图标
      })
      this.initMapData()
      setTimeout(() => {
        this.draw()

        var mapDiv = document.getElementById('myMap')
        mapDiv.style.display = 'block'
      }, 1000)
    },
  },
  async mounted() {
    this.townName = this.$route.query.name
    this.townId = this.$route.query.id
    const res = await getAllChildrenRegionTree({
      parentId: '511024',
      depth: 1,
    })
    this.countys = res.data
    this.countyIndex = this.countys.findIndex(item => item.id === this.townId)
    this.latLng = {
      lng: this.countys[this.countyIndex].areaCenter[0],
      lat: this.countys[this.countyIndex].areaCenter[1],
    }

    this.mountedMapData()
    this.initHoverLabel()
    this.adjustMapScale()
    window.addEventListener('scale-change', this.adjustMapScale)
  },
}
</script>
<style lang="scss" scoped>
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
.townInfo {
  width: 400px;
  height: 278px;
  background-color: #1433a9;
  position: absolute;
  z-index: 10;
  top: 150px;
  left: 540px;
  border: 1px solid #28edff;
  display: flex;
  justify-content: center;
  align-content: flex-start;
  flex-wrap: wrap;
}
.infoT {
  width: 95%;
  height: 45px;
  border-bottom: 1px solid #28edff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 18px;
    color: #ffffff;
    margin-left: 6px;
  }
  img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
}
.infoC {
  width: 95%;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}
.infoL {
  width: 172px;
  height: 200px;
  border-right: 1px solid #28edff;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
}
.infoL > p {
  width: 100%;
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
  margin-top: 14px;
}
.infoR {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;
}
.infoM {
  width: 100%;
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  margin-top: 14px;
}
.infoN {
  width: 100%;
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  margin-top: 14px;
}
.town-list {
  position: absolute;
  z-index: 10;
  top: 150px;
  left: 540px;
  background-color: #0452a0;
  color: #fff;
  width: 160px;
  // max-height: 300px;
  overflow-y: auto;
  box-sizing: border-box;
  transition: transform 0.3s;
  .town-list-item {
    text-align: center;
    line-height: 42px;
    height: 42px;
    cursor: pointer;
    &:hover {
      background-color: rgb(33, 202, 218);
    }
  }
}
#myMap {
  touch-action: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
</style>
