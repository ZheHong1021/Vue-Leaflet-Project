import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/tra',
    name: 'TRA',
    component: () => import('../views/TRA.vue'),
   
  },
  {
    path: '/thsr',
    name: 'THSR',
    component: () => import('../views/THSR.vue'),
  },
  {
    path: '/bus',
    name: 'Bus',
    component: () => import('../views/Bus.vue'),
    beforeEnter(to, from, next){
      const city_Obj = JSON.parse(sessionStorage.getItem("bus_City"));
      if(city_Obj){
        next({name: 'bus_City', params: {
            city_en: city_Obj.city_en, 
            city: city_Obj.city
          }
        });
      }
        next();
    },
  },
  {
    path: '/bus/city/:city_en/route',
    name: 'bus_City',
    component: () => import('../views/BusCity.vue'),
  },
  {
    path: '/bike',
    name: 'Bike',
    component: () => import('../views/Bike.vue'),
  },
  {
    path: '/travel',
    name: 'Travel',
    component: () => import('../views/Travel.vue'),
    
  },
  {
    path: '/food',
    name: 'Food',
    component: () => import('../views/Food.vue'),
  
  },
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) =>{
  document.title = "台灣安心旅遊通"
  next()
})

export default router
