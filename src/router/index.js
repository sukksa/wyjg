import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeViewBD.vue'
import CountyView from '@/views/CountyView.vue'
import LoginView from '@/views/LoginView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/county',
    name: 'county',
    component: CountyView,
  },
]

const router = new VueRouter({
  routes,
})

export default router
