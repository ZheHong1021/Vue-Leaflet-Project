<template>
  <section class="w-full flex flex-col justify-center items-center">
    <h1 class="text-xl font-bold my-2">{{ city_name.city }}</h1>
      <Button type="button" class="p-button-outlined p-button-success my-4" @click="goBackTotalCity">
          <i class="fas fa-reply-all text-black mr-3"></i>
          <span class="p-ml-2 p-text-bold font-bold">回上一頁</span>
      </Button>
    
    <!-- 顯示路線條件： 路線API已經載入到 Vuex中 -->
    <div class="my-3 w-full" v-if="routes">
        <div class="w-full my-4 p-1 rounded-full border-2 border-gray-700 flex items-center">
          <label for="searchBar"><i class="fas fa-search p-1 text-lg cursor-pointer w-1/12 hover:text-blue-400"></i></label>
          <input id="searchBar" v-model="search_Val" type="text" placeholder="查詢路線" class="w-10/12 mx-2 bg-transparent text-black outline-none h-full text-lg"/>
          <i class="fas fa-times p-1 text-lg cursor-pointer w-1/12 hover:text-blue-400" v-if="search_Val !== ''" @click="search_Val = ''"></i>
        </div>
        <span v-if="filter_Result.length === 0" class="text-base font-bold mb-4">目前找不到您所搜尋的路線，請重新搜尋。</span>

        <Accordion class="w-full" @tab-open="open_Route" @tab-close="close_Route"  v-model:activeIndex="activeIndex">
            <!-- Page逐一顯示，透過總頁數 % 目前一次顯示的數量，=> 假設共138頁，最後一頁 index只會跑到 8 -->
            <AccordionTab v-for="(_,index) in currentPageRoute" :key="index">
              <!-- Header -->
              <template #header>
                <i class="fas fa-bus"></i>
                <!-- 透共目前頁數去抓取json資料 -->
                <label id="routeName" class="mx-2 mr-6"> {{ filter_Result[PageNumRow + index].RouteName.Zh_tw  }} </label>
                <span>
                  <label >{{ filter_Result[PageNumRow + index].DepartureStopNameZh }}</label>
                  <i class="fas fa-arrow-circle-right text-lg"></i>
                  <label >{{filter_Result[PageNumRow + index].DestinationStopNameZh }}</label>
                </span>
              </template>
                        
                <!-- Body (操作 DOM元素 -> v-if) -->
                <BusRoute v-if="filter_Result[PageNumRow + index].RouteUID === $route.query.id"/>
              </AccordionTab>
        </Accordion>

      <Paginator :pageLinkSize="4" :rows="10" :totalRecords="filter_Result.length" :rowsPerPageOptions="[10,20,30]" @page="onPage($event)"
          template="PrevPageLink PageLinks  NextPageLink RowsPerPageDropdown">
           <template #right="slotProps">
             <h1 class="mt-3">單頁顯示數量: {{slotProps.state.rows}}，總路線數量: {{ filter_Result.length }}</h1>
          </template>
      </Paginator>
    </div>
  </section>

</template>

<script>
import Button from 'primevue/button';
import {useRouter, useRoute} from 'vue-router';
import {useStore} from 'vuex';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Paginator from 'primevue/paginator';
import { reactive, ref } from '@vue/reactivity';
import BusRoute from '@/views/BusRoute';

// API
import { API_Bus_Route } from '@/api/api'; 
import { computed, onMounted } from '@vue/runtime-core';

export default {
    components: {
        Button: Button,
        Accordion: Accordion,
        AccordionTab: AccordionTab,
        Paginator: Paginator,
        BusRoute: BusRoute,
    },
    name: 'BusCity',
    //离开守卫：通过路由规则，离开该组件时被调用
    beforeRouteLeave (to, from, next) {
      if(to.path === '/bus') sessionStorage.removeItem("bus_City");
      next();   
    },
    setup(){
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const city_name = computed(()=> store.state.module_Bus.city_name);

      // 搜尋 filter
        const search_Val = ref('');
      
      // page設定
        const page = reactive({
          num: 0,
          row: 10
        });

        const PageNumRow = computed(()=> page.num * page.row);
        
        // Accordion設定 預設所有 Tab關掉
        const activeIndex = ref(-1); 

        const route_Uid = ref('');

        const routes = ref();

        onMounted(async ()=>{
          const city_Obj = {};
          // 如果 Session有儲存 city資料，則直接讀取Session資料；反之，如果沒有則讀取 params就好
          const sessionCity = JSON.parse(sessionStorage.getItem("bus_City"));
          city_Obj.city =  sessionCity ? sessionCity.city : route.params.city;
          city_Obj.city_en = sessionCity ? sessionCity.city_en : route.params.city_en;

          // 將當前市區公車的縣市記錄到 vuex中
          store.commit('module_Bus/setCityName', city_Obj);

          await API_Bus_Route(city_name.value.city_en)
              .then( (res)=>{
                routes.value = res.data;
                store.dispatch('module_Bus/setApiRoute', res.data); // 將路線紀錄到 vuex中並轉換成 map型態
            }).catch( (err)=>{
                console.log('連線異常:' + err);
            })        
        });

        const goBackTotalCity = ()=>{
          router.push({name: 'Bus'});
          store.commit('module_Bus/clearApiRoute'); 
        }

        // filter Search (只要搜尋文字有包含在路線名稱、起站、迄站則都會顯示)，特別注意：高雄、桃園有問題(少起站或者是迄站)
        const filter_Result = computed(()=> {
            return routes.value.filter(
            (route)=> {
              if('RouteName' in route && 'DepartureStopNameZh' in route && 'DestinationStopNameZh' in route){
                return route.RouteName.Zh_tw.includes(search_Val.value) ||  route.DepartureStopNameZh.includes(search_Val.value)||  route.DestinationStopNameZh.includes(search_Val.value);
              }else{
                return route.RouteName.Zh_tw.includes(search_Val.value);
              }
          });
        });
        
        // PageRow設定: 到最後一頁則顯示 總路線數量 - ( 第幾頁n * 單頁數量m )，其他都以單頁數量顯示
        const currentPageRoute = computed(()=> {
            if( filter_Result.value.length - PageNumRow.value > page.row) return page.row;
            else return filter_Result.value.length - PageNumRow.value
            
        })

          // Page Event
          const onPage = (event)=>{
              page.num = event.page;
              page.row = event.rows;
              activeIndex.value = -1;  // 把所有 tab關掉
              router.push({
                name: 'bus_City',
                query: {
                  page: page.num + 1, // 第一頁為 0
                }
              });
          }
          // 開啟 Accordion，匯入該路線API資訊(預設開啟 Direction為 0)
          const open_Route = (event)=>{
            route_Uid.value = filter_Result.value[PageNumRow.value + event.index]['RouteUID'];
            router.replace({
              name: 'bus_City',
              query: {
                id: route_Uid.value,
                direct: 0,
              }
            });
          }
          const close_Route = (event)=>{
            console.log(event);
          }
        return {city_name, routes, search_Val, page, route_Uid, activeIndex, filter_Result, currentPageRoute, PageNumRow, goBackTotalCity, open_Route, close_Route, onPage}
    }
  }
</script>
