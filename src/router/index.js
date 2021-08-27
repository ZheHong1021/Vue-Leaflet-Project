import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TRA from '../views/TRA.vue'
import THSR from '../views/THSR.vue'
import Bus from '../views/Bus.vue'
import Bike from '../views/Bike.vue'
import Travel from '../views/Travel.vue'
import Food from '../views/Food.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/tra',
    name: 'TRA',
    component: TRA,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/thsr',
    name: 'THSR',
    component: THSR,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/bus',
    name: 'Bus',
    component: Bus,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/bike',
    name: 'Bike',
    component: Bike,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/travel',
    name: 'Travel',
    component: Travel,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
  {
    path: '/food',
    name: 'Food',
    component: Food,
    meta: {
      title: '台灣安心旅遊通',
    }
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) =>{
  document.title = `${to.meta.title}`
  next()
})

export default router
