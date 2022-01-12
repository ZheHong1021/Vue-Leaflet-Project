<template>
  <div>
<!-- 用 sticky滾動時會一直存在 -->
    <div id="route_Header" class="sticky" style="top: 20px; z-index: 1000;">
        <span class="rounded p-2 bg-purple-700 text-white font-bold text-lg " >下次更新時間: {{timer}}</span>
        <span class="rounded p-2 bg-red-500 text-white font-bold text-lg ml-3 cursor-pointer" @click="refresh_Route_Info($route.query.direct)">刷新</span>
        <span class="rounded p-2 bg-green-400 text-white font-bold text-lg ml-3 cursor-pointer" @click="go_Position()">導引</span>
        <div class="w-full flex justify-center mb-6 mt-4">
            <Button @click="refresh_Route_Info(0)" :label="`往${route_info['DestinationStopNameZh']}`" class="font-bold p-button-raised"
                :class="$route.query.direct != 0 ? 'p-button-text' : ''" />
            <Button @click="refresh_Route_Info(1)" :label="`往${route_info['DepartureStopNameZh']}`" class="font-bold p-button-raised"
                :class="$route.query.direct != 1 ? 'p-button-text' : ''" />
        </div>
    </div>
    <div v-if="stopsOfRoute" class="relative top-4" style="min-height: 10rem;">
      <loading 
          v-model:active="isLoading"
          :is-full-page="false"
          loader="bars"
        />
      <template v-if="!isLoading">
        <div v-for="stop in stopsOfRoute" :key="stop.StopUID">
          <h1 class="my-4" v-if="map_Time_Obj[stop.StopUID]">
              <span class="px-4 py-1 rounded text-white mr-2 bg-gray-500" v-if="!map_Time_Obj[stop.StopUID].estimateTime && !map_Time_Obj[stop.StopUID].nextBusTime">{{map_Time_Obj[stop.StopUID].stopStatus }}</span>
              <span class="px-4 py-1 rounded text-white mr-2 bg-gray-500" v-else-if="!map_Time_Obj[stop.StopUID].estimateTime">{{map_Time_Obj[stop.StopUID].nextBusTime}}</span>
              <span class="px-4 py-1 rounded text-white mr-2 bg-red-500" v-else-if="map_Time_Obj[stop.StopUID].estimateTime <= 1">進站中</span>
              <span class="px-4 py-1 rounded text-white mr-2 bg-yellow-500" v-else-if="map_Time_Obj[stop.StopUID].estimateTime <= 3">即將進站</span>
              <span class="px-4 py-1 rounded text-white mr-2 bg-green-500" v-else>{{map_Time_Obj[stop.StopUID].estimateTime}} 分</span>
              <label>{{ stop.StopName.Zh_tw }}</label>
              <span 
                class="px-2 py-1 ml-2 rounded text-white bg-pink-600" 
                v-if="Object.prototype.hasOwnProperty.call(map_NearStop_Obj, stop.StopUID)">
                  <i class="fas fa-bus"></i>
                  {{ map_NearStop_Obj[stop.StopUID].PlateNumb }}
                  {{ map_NearStop_Obj[stop.StopUID].A2EventType }}
              </span>
          </h1>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import { computed, onMounted, onUnmounted, ref } from '@vue/runtime-core'
import {API_Bus_DisplayStopOfRoute, API_Bus_StopOfRoute, API_Bus_EstimatedTimeOfArrival,
API_Bus_RealTimeByFrequency, API_Bus_RealTimeNearStop, API_BusRouteShape} from "@/api/api.js";
import {useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from 'vue-loading-overlay';

export default {
  components: {
    Button: Button,
    Loading: Loading,
  },
  name: "BusRoute",
    setup(){
      const route = useRoute();
      const router = useRouter();
      const store = useStore();
      const city = computed(() => store.state.module_Bus.city_name.city_en); // 抓取縣市
      const map_Route_Obj = computed(()=> store.state.module_Bus.map_Route);
      const map_Time_Obj =  computed(()=> store.state.module_Bus.map_EstimateTime);
      const map_NearStop_Obj =  computed(()=> store.state.module_Bus.map_RealTimeNearStop);
      const route_info = ref(map_Route_Obj.value[route.query.id]);
      const stopsOfRoute = ref();
      const timer = ref(30); // 預設 30s
      const isLoading = ref(false);

      onMounted(async()=>{
        console.log("mounted");
        await set_StopOfRoute();
        await set_EstimatedTime();
        await get_Current_Bus();
      });

      onUnmounted(()=>{
        console.log("unmounted");
        clearInterval(update_Timer);
        store.dispatch('module_Bus/removeStopMarker'); // 頁面轉換則清空地圖上的 marker
        store.dispatch('module_Bus/removeBusMarker'); // 頁面轉換則清空地圖上的 marker
        store.dispatch('module_Bus/removeRouteShape'); // 清除線
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
              store.dispatch('module_Bus/setApiStop', res.data[0].Stops); // 將路線紀錄到 vuex中並轉換成 map型態
            }).catch( (err)=>{
              console.log('連線異常:' + err);
          })
        }else{
          API_Bus_StopOfRoute(obj)
            .then( (res)=>{
              stopsOfRoute.value = res.data[0].Stops; // 抓陣列的第一個
              store.dispatch('module_Bus/setApiStop', res.data[0].Stops); // 將路線紀錄到 vuex中並轉換成 map型態
            }).catch( (err)=>{
              console.log('連線異常:' + err);
          })
        }

        API_BusRouteShape(obj)
          .then( (res)=>{
            const geometry = res.data[0].Geometry.replace('LINESTRING', '').replaceAll('(', '').replaceAll(')', '').replaceAll(',', ' ').split(' ');
            store.dispatch('module_Bus/setRouteShape', geometry); // 將路線紀錄到 vuex中並轉換成 map型態
          }).catch( (err)=>{
            console.log('連線異常:' + err);
        })

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

      const get_Current_Bus = ()=>{
        const obj = {
          city: city.value, 
          routeUID: route.query.id, 
          direction: route.query.direct, 
        };
        Promise.all([
          API_Bus_RealTimeByFrequency(obj),
          API_Bus_RealTimeNearStop(obj)
        ]).then( (response) => {
          store.dispatch('module_Bus/setApiBusNow', response[0].data); 
          store.dispatch('module_Bus/setApiNearStop', response[1].data); // 將路線紀錄到 vuex中並轉換成 map型態
        }).catch( (err)=>{
          console.log(err);
        })
      }

      // 30秒倒數計時器
      const update_Timer = setInterval(()=> {
        timer.value = timer.value -= 1; // 計時器倒數
        if(timer.value === 0 ) refresh_Route_Info(route.query.direct); // 倒數到 0則刷新
      }, 1000);

      const showLoading =()=>{
          isLoading.value = true;
          setTimeout(() => {
              isLoading.value = false
          },1500)
      }

      // 改變行駛方向 或是 更新時間到刷新時執行
      const refresh_Route_Info =  async(direct)=>{
          showLoading();
          // 只有改變 Direction才執行(避免效能花費)
          if (direct != route.query.direct){ 
            await router.push({ name: 'bus_City', query: { id: route.query.id, direct: direct}});
            store.dispatch('module_Bus/removeStopMarker'); // 頁面轉換則清空地圖上的 marker
            store.dispatch('module_Bus/removeRouteShape'); // 清除線
            await set_StopOfRoute(); 
          }
          store.dispatch('module_Bus/removeBusMarker'); // 動態更新公車位置
          await set_EstimatedTime();
          await get_Current_Bus();
          timer.value = 30; // 更新時，重新倒數
      }

      const go_Position = ()=>{
        const stop_Length = stopsOfRoute.value.length;
        const stopPos_Start = stopsOfRoute.value[0].StopPosition;
        const stopPos_End = stopsOfRoute.value[stop_Length-1].StopPosition;
        store.commit("module_Map/fitBound_Map", [ 
          [stopPos_Start.PositionLat, stopPos_Start.PositionLon], 
          [stopPos_End.PositionLat, stopPos_End.PositionLon]  
        ]);
      }

      return {stopsOfRoute, route_info, timer, map_Time_Obj, map_NearStop_Obj, isLoading,
            refresh_Route_Info, go_Position}
    },
}
</script>
