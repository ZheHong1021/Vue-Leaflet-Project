<template>
    <loading v-model:active="isLoading"
      :is-full-page="true"
      loader= "dots"
      />

  <!-- 顯示情況： 一、還沒切換路由前 、 二、要切換路由等待 Loading動畫 -->
  <section v-show="$route.path === '/bus' || isLoading === true"  class="w-full flex flex-wrap justify-evenly">
        <div  class="my-3 flex justify-center text-lg font-bold" v-for="city in citys" :key="city.en">
            <div class="w-40 h-40 p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-500 transition duration-400"
              @click="Search_Bus_Route(city.name, city.en)" :class="city.isActive === true ? 'bg-yellow-500' : 'bg-yellow-200'">
                <i class="fas fa-bus-alt text-5xl"></i>
                <h1 class="mt-4 text-xl">{{city.name}}</h1>
            </div>
        </div>
  </section>

  <!-- 顯示情況： 一、已經切換路由前 且 Loading動畫結束 -->
  <router-view v-show="$route.path !== '/bus'"></router-view>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';
import {useRouter} from 'vue-router';


export default {
  components: {
    Loading: Loading,
  },
  setup(){
      const router = useRouter();
      const citys = reactive([
        {name:'臺北市', en:'Taipei', isActive: false}, {name:'新北市', en:'NewTaipei', isActive: false}, {name:'桃園市', en:'Taoyuan', isActive: false},
        {name:'臺中市', en:'Taichung', isActive: false},{name:'臺南市', en:'Tainan', isActive: false}, {name:'高雄市', en:'Kaohsiung', isActive: false}, 
        {name:'基隆市', en:'Keelung', isActive: false},{name:'新竹市', en:'Hsinchu', isActive: false},{name:'新竹縣', en:'HsinchuCounty', isActive: false},
        {name:'苗栗縣', en:'MiaoliCounty', isActive: false},{name:'彰化縣', en:'ChanghuaCounty', isActive: false},{name:'南投縣', en:'NantouCounty', isActive: false},
        {name:'雲林縣', en:'YunlinCounty', isActive: false}, {name:'嘉義縣', en:'ChiayiCounty', isActive: false},{name:'嘉義市', en:'Chiayi', isActive: false}, 
        {name:'屏東縣', en:'PingtungCounty', isActive: false}, {name:'宜蘭縣', en:'YilanCounty', isActive: false}, {name:'花蓮縣', en:'HualienCounty', isActive: false}, 
        {name:'臺東縣', en:'TaitungCounty', isActive: false}, {name:'金門縣', en:'KinmenCounty', isActive: false}, {name:'澎湖縣', en:'PenghuCounty', isActive: false}, 
        {name:'連江縣', en:'LienchiangCounty', isActive: false},
      ])
    
      const isLoading = ref(false);

      const Search_Bus_Route = (name, en)=>{
        isLoading.value = true;
        setTimeout(()=> {
          router.push({name: 'bus_City',
            params: {
              city_en: en,
              city: name
            }
          });
          isLoading.value = false;
        }, 1500);
      }
    return {citys, isLoading, Search_Bus_Route}
  },


}
</script>

<style>
.bus_polyline { 
	stroke: red;
}



</style>