<template>
  <div>
    <!-- 用 sticky滾動時會一直存在 -->
    <div id="route_Header" class="sticky" style="top: 20px">
        <span class="rounded p-2 bg-purple-700 text-white font-bold text-lg " >下次更新時間: {{timer}}</span>
        <span class="rounded p-2 bg-red-500 text-white font-bold text-lg ml-3 cursor-pointer" @click="refresh_Route_Info($route.query.direct)">刷新</span>
        <span class="rounded p-2 bg-green-400 text-white font-bold text-lg ml-3 cursor-pointer" @click="go_Position()">導引</span>
        <div class="w-full flex justify-center mb-6 mt-4">
            <Button @click="refresh_Route_Info(0)" :label="`往${route_info['DepartureStopNameZh']}`" class="font-bold p-button-raised"
                :class="$route.query.direct != 0 ? 'p-button-text' : ''" />
            <Button @click="refresh_Route_Info(1)" :label="`往${route_info['DestinationStopNameZh']}`" class="font-bold p-button-raised"
                :class="$route.query.direct != 1 ? 'p-button-text' : ''" />
        </div>
    </div>

    <div v-if="stopsOfRoute">
      <div v-for="stop in stopsOfRoute" :key="stop.StopUID">
        <h1 class="my-4" v-if="map_Time_Obj[stop.StopUID]">
            <span class="px-4 py-1 rounded text-white mr-2 bg-gray-500" v-if="!map_Time_Obj[stop.StopUID].estimateTime && !map_Time_Obj[stop.StopUID].nextBusTime">{{map_Time_Obj[stop.StopUID].stopStatus }}</span>
            <span class="px-4 py-1 rounded text-white mr-2 bg-gray-500" v-else-if="!map_Time_Obj[stop.StopUID].estimateTime">{{map_Time_Obj[stop.StopUID].nextBusTime}}</span>
            <span class="px-4 py-1 rounded text-white mr-2 bg-red-500" v-else-if="map_Time_Obj[stop.StopUID].estimateTime <= 1">進站中</span>
            <span class="px-4 py-1 rounded text-white mr-2 bg-yellow-500" v-else-if="map_Time_Obj[stop.StopUID].estimateTime <= 3">即將進站</span>
            <span class="px-4 py-1 rounded text-white mr-2 bg-green-500" v-else>{{map_Time_Obj[stop.StopUID].estimateTime}} 分</span>
            <label>{{ stop.StopName.Zh_tw }}</label>
        </h1>
      </div>
    </div>

  </div>
</template>

<script>
import Button from 'primevue/button';
import { computed, onMounted, onUnmounted, ref } from '@vue/runtime-core'
import {API_Bus_DisplayStopOfRoute, API_Bus_StopOfRoute, API_Bus_EstimatedTimeOfArrival} from "@/api/api.js";
import {useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
  components: {
    Button: Button,
  },
  name: "BusRoute",
    setup(){
      const route = useRoute();
      const router = useRouter();
      const store = useStore();
      const city = computed(() => store.state.module_Bus.city_name.city_en); // 抓取縣市
      const map_Route_Obj = computed(()=> store.state.module_Bus.map_Route);
      const map_Time_Obj =  computed(()=> store.state.module_Bus.map_EstimateTime);
      const route_info = ref(map_Route_Obj.value[route.query.id]);
      const stopsOfRoute = ref();
      const timer = ref(30); // 預設 30s

      onMounted(async()=>{
        await set_StopOfRoute();
        await set_EstimatedTime();
      })

      // Taipei, Tainan, NewTaipei, Taoyuan, Taichung較有複雜的路線，PTX特別製作一個API來對應
      const arr_DisplayFunc = ["Taipei", "Tainan", "NewTaipei", "Taoyuan", "Taichung"];

      const set_StopOfRoute = ()=>{
        const obj = {
          city: city.value, 
          routeUID: route.query.id, 
          direction: route.query.direct
        };
        if( arr_DisplayFunc.includes(city.value) ){
          API_Bus_DisplayStopOfRoute(obj)
            .then( (res)=>{
              stopsOfRoute.value = res.data[0].Stops; // 抓陣列的第一個
              // store.dispatch('module_Bus/setApiStop', res.data[0].Stops); // 將路線紀錄到 vuex中並轉換成 map型態
            }).catch( (err)=>{
              console.log('連線異常:' + err);
          })
        }else{
          API_Bus_StopOfRoute(obj)
            .then( (res)=>{
              stopsOfRoute.value = res.data[0].Stops; // 抓陣列的第一個
              // store.dispatch('module_Bus/setApiStop', res.data[0].Stops); // 將路線紀錄到 vuex中並轉換成 map型態
            }).catch( (err)=>{
              console.log('連線異常:' + err);
          })
        }
      }

      const set_EstimatedTime = ()=>{
        const obj = {
          city: city.value, 
          routeUID: route.query.id, 
          direction: route.query.direct, 
        };
        API_Bus_EstimatedTimeOfArrival(obj)
          .then( (res)=>{
            store.dispatch('module_Bus/setApiEstimateTime', res.data); // 將路線紀錄到 vuex中並轉換成 map型態
          }).catch( (err)=>{
            console.log('連線異常:' + err);
          })
      }

      // 30秒倒數
      const update_Timer = setInterval(()=> {
        timer.value = timer.value -= 1; // 計時器倒數
        if(timer.value === 0 ) refresh_Route_Info(route.query.direct); // 倒數到 0則刷新
      }, 1000);

      onUnmounted(()=>{
        clearInterval(update_Timer);
      })

      // 改變行駛方向 或是 更新時間到刷新時執行
      const refresh_Route_Info = async (direct)=>{
        timer.value = 30; // 更新時，重新倒數
        await router.push({ name: 'bus_City', query: { id: route.query.id, direct: direct}});
        await set_StopOfRoute();
        await set_EstimatedTime();
      }
      
      // const TimeConfig = (date) => `${new Date(date).getHours()} : ${ new Date(date).getMinutes() >= 10 ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes()}`
      
      const go_Position = ()=>{
        console.log(123);
      }
      return {stopsOfRoute, route_info, timer, map_Time_Obj, refresh_Route_Info, go_Position}
    },
}
</script>
