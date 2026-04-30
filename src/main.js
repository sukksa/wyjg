import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.prototype.$axios = axios
// main.js
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
import ElementUI from 'element-ui' // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import scroll from 'vue-seamless-scroll'
import HighchartsVue from 'highcharts-vue'
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import VScaleScreen from 'v-scale-screen'

Vue.use(VScaleScreen)
Vue.use(HighchartsVue)
highcharts3d(highcharts)

Vue.use(scroll)
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
