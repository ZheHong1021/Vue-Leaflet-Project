<template>

    <loading v-model:active="loading_Config.isLoading"
      :is-full-page="loading_Config.isFullPage"
      :loader="loading_Config.loader"
      :color="loading_Config.color"
      />

  <section id="Total_City" class="w-full flex flex-wrap justify-evenly" v-show = "goToSingleCity === false">
        <div  class="my-3 flex justify-center text-lg font-bold" v-for="(city, index) in citys" :key="city">
            <div class="w-40 h-40 p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer"
              @click="Search_Bus_Route(index)" :class="city.isActive === true ? 'bg-yellow-600' : 'bg-yellow-200'">
                <i class="fas fa-bus-alt text-5xl"></i>
                <h1 class="mt-4 text-xl">{{city.name}}</h1>
            </div>
        </div>
  </section>



  <section id="Single_City" class="w-full flex flex-col justify-center items-center" v-show = "goToSingleCity === true">
    <h1 class="text-xl font-bold my-2">{{ choose_Info.city }}</h1>
      <Button type="button" class="p-button-outlined p-button-success my-4" @click="goBackTotalCity">
          <i class="fas fa-reply-all text-black mr-3"></i>
          <span class="p-ml-2 p-text-bold font-bold">回上一頁</span>
      </Button>

    <div class="my-3" v-if="api_Response.total_Routes.length > 0">
        <Accordion class="w-full" @tab-open="open_Route" @tab-close="close_Route">
            <AccordionTab v-for="(_,index) in currentPageRow" :key="index">
              <!-- Header -->
              <template #header>
                <i class="fas fa-bus"></i>
                <label id="routeName" class="mx-2 mr-6"> {{ api_Response.total_Routes[currentPage * 10 + index].RouteName.Zh_tw  }} </label>
                <span>
                  <label >{{api_Response.total_Routes[currentPage * 10 + index].DepartureStopNameZh }}</label>
                  <i class="fas fa-arrow-circle-right text-lg"></i>
                  <label >{{api_Response.total_Routes[currentPage * 10 + index].DestinationStopNameZh }}</label>
                </span>
              </template>
                        
              <!-- Body -->
                <div v-show="api_Response.bus_stop.length !== 0">
                    <div class="w-full flex justify-center mb-4 mt-2">
                      <Button @click="refresh_Route_Info(0)" :label="'往' + api_Response.total_Routes[currentPage * 10 + index].DestinationStopNameZh" class="font-bold p-button-raised"
                        :class="choose_Info.direction !== 0 ? 'p-button-text' : ''" />
                      <Button @click="refresh_Route_Info(1)" :label="'往' + api_Response.total_Routes[currentPage * 10 + index].DepartureStopNameZh" class="font-bold p-button-raised"
                        :class="choose_Info.direction !== 1 ? 'p-button-text' : ''" />
                    </div>

                    <!-- 一定要有該Object才能顯示，否則會 Error -->
                    <div v-if="!object_isEmpty(esimate_Info)">
                      <span class="rounded p-2 bg-purple-700 text-white font-bold sticky text-lg" style="top: 0">下次更新時間: {{update_Count}}</span>
                      
                      <div v-for="(stop, index) in api_Response.bus_stop" :key="index">
                          <!-- 預估到站時間( 1 min > : 進站中； 3 min >: 準備進站； 3 min<: 正常顯示時間； 沒有預估時間: 顯示目前站點狀況 ) -->
                          <h1 class="my-4">
                              <span 
                                  v-if="esimate_Info[stop.StopUID].estimateTime >= 0 && Math.ceil(esimate_Info[stop.StopUID].estimateTime / 60) <= 3"
                                  class="px-4 py-1 rounded text-white"
                                  :class="Math.ceil(esimate_Info[stop.StopUID].estimateTime / 60) <= 1 ? 'bg-red-500' : 'bg-yellow-500'"
                                  v-text="Math.ceil(esimate_Info[stop.StopUID].estimateTime / 60) <= 1 ? '進站中' : '準備進站'">
                              </span>
                              <span 
                                  v-else-if="Math.ceil(esimate_Info[stop.StopUID].estimateTime / 60)"
                                  class="px-4 py-1 rounded text-white bg-green-500">
                                  {{Math.ceil(esimate_Info[stop.StopUID].estimateTime / 60) + '分' }}
                              </span>
                              <span 
                                  v-else
                                  class="px-4 py-1 rounded text-white bg-gray-500">
                                  {{ StopStatus[esimate_Info[stop.StopUID].stopStatus]}}
                              </span>

                              <label class="ml-2">{{ stop.StopName.Zh_tw }}</label>
                          </h1>
                      </div>
                    </div>
                </div>
              </AccordionTab>
        </Accordion>

      <Paginator :rows="10" :totalRecords="api_Response.total_Routes.length" :rowsPerPageOptions="[10,20,30]" @page="onPage($event)"></Paginator>
      </div>

  </section>



</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { get_Bus_Route, get_Bus_StopOfRoute, get_Bus_EstimatedTimeOfArrival } from "../api/api.js"; 
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Paginator from 'primevue/paginator';

export default {
  components: {
    Loading: Loading,
    Button: Button,
    Accordion: Accordion,
    AccordionTab: AccordionTab,
    Paginator: Paginator,
  },
  setup(){
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
    

      // 選擇查詢的資訊(城市、路線)
      const choose_Info = reactive({
        city: '',
        city_en: '',
        route: '',
        direction: 0,
      })

      // 是否點選進入該縣市路線
      const goToSingleCity = ref(false);


      // API Respones
      const api_Response = reactive({
        total_Routes: [],
        total_Stops: [],
        bus_stop: [],
      })

      // Page
      const currentPage = ref( 0 );
      const currentPageRow = ref( 10 );
      const esimate_Info = reactive({})
      
      // Interval Config
      const updateInterval = ref('');
      const updateInterval_Count = ref('');
      const update_Count = ref(15);  // 15秒更新


      // Loading Config
      const loading_Config = reactive({
        isLoading: false, // 啟動/關閉
        isFullPage: true, // 全螢幕
        color: "#000",
        loader: 'dots', // Loading icon:  spineer / dots / bars,
        time: 1500 // 動畫時間: 1.5s
      })
      

      // Loading Animation
      const Show_Loading = (goTo)=>{
        loading_Config.isLoading = true;
          setTimeout(() => {
              loading_Config.isLoading = false;
              goToSingleCity.value = goTo === 'Single' ? true : false;
          }, loading_Config.time);
      }


      const Search_Bus_Route = async(index) =>{
          const city_name = citys[index].name;
          const city_name_en = citys[index].en;
          citys[index].isActive = true;
          
          Show_Loading('Single')

          await get_Bus_Route(city_name_en)
            .then( (res)=>{
              api_Response.total_Routes = res.data;
              choose_Info.city = city_name;
              choose_Info.city_en = city_name_en;
          }).catch( (err)=>{
              console.log('連線異常:' + err);
              clearCityActive()
              error_Request()
          })        
      }


      const goBackTotalCity = ()=>{
          Show_Loading('Total');
          choose_Info.city = '';
          choose_Info.city_en = '';
          api_Response.total_Routes = [];
          clearCityActive()
      }

      
      const clearCityActive = ()=>{
          citys.forEach((city)=>{
            city.isActive = false;
          })
      }

      // [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運']   
      const StopStatus  = reactive(['正常', '尚未發車', '暫不停靠', '末班車已過', '今日停駛'])

      // 開啟 Accordion，匯入該路線API資訊(之後就不用一直呼叫)
      const open_Route = async (event)=>{
        // 目前 uid為 頁數*10 + 該頁的第幾個
        const uid = api_Response.total_Routes[currentPage.value*10 + event.index].RouteUID
        // 紀錄選擇的路線
        choose_Info.route = uid 
            const request = {city: choose_Info.city_en, routeUid: choose_Info.route}
              await get_Bus_StopOfRoute(request)
              .then( (res)=>{
                // 用一個 reactive來保存
                api_Response.total_Stops = res.data;

                // 起始載入，行駛方向為順向
                refresh_Route_Info(0);

            }).catch( (err)=>{
                console.log('連線異常:' + err);
                error_Request()
            })
      }

      // 關閉 Accordion
      const close_Route = () =>{
        choose_Info.route = "";
        clearInterval(updateInterval.value)
        clearInterval(updateInterval_Count.value)
      }

     


        // 這邊因為每個路線都會有數個子路線，而我們要將每個子路線的行駛方向所經過的站點都抓近來
      const get_StopOfRoute = (direction)=>{
            choose_Info.direction = direction;
            let maxStopLength = 0;
            let max_index = 0
            // 子路線數量
            let SubRouteNum = Object.keys(api_Response.total_Stops).length;

            // 預估時間
            for(let index = 0; index< SubRouteNum ; index++){
              // 且這子路線的行駛方向要跟 direction相同
                if(api_Response.total_Stops[index].Direction === direction){
                  const stop = api_Response.total_Stops[index].Stops;
                  const stop_Length = stop.length;
                  // 如果路線長度大於最大，則記錄起來
                  if(stop_Length > maxStopLength){
                    maxStopLength = stop_Length
                    max_index = index  // 紀錄哪一個是站點最多的子路線
                }
              }
            }
            // 最後將站點最多的留下來(而這邊還有部分班次的特殊站點需要去做處理)
            api_Response.bus_stop = api_Response.total_Stops[max_index].Stops

            // 這邊設定 1s再去 get_EstimatedTimeOfArrival函式處理資料，否則會有 error
            setTimeout(()=>{
              const request = {city: choose_Info.city_en, routeUid: choose_Info.route}
              get_EstimatedTimeOfArrival(request);
            }, 1000)
      }

      const refresh_Route_Info = (direction)=>{
        loading_Config.isLoading = true;
        setTimeout(()=>{
          loading_Config.isLoading = false;
          // 一開始都先打開並刷新計時
          get_StopOfRoute(direction);
          clearInterval(updateInterval.value)
          clearInterval(updateInterval_Count.value)
          update_Count.value = 15

          updateInterval_Count.value = setInterval(()=>{
              update_Count.value--;
              if(update_Count.value === 0 ){
                update_Count.value = 15
              }
            }, 1000)

          updateInterval.value = setInterval(() => {
              get_StopOfRoute(direction);
          }, 15000)
        }, 500)


      }



      // 將得到的 API新建成一個物件，利用站點的StopUID來去呼叫該站點的資訊(估計時間、車班號)
      const get_EstimatedTimeOfArrival = async(uid)=>{
          await get_Bus_EstimatedTimeOfArrival(uid)
              .then( (res)=>{
                Object.entries(res.data).forEach(([, value]) => {
                  
                  // 這邊提供的資料中，會有重複(多個子路線)站點資訊，而我們要抓目前最快到達車站的時間
                  // 如果目前該站點資訊以記錄在 Object中，則必須以估計時間最短的為優先
                  
                  if( Object.prototype.hasOwnProperty.call(esimate_Info, value.StopUID) ){
                    if(esimate_Info[value.StopUID] == 'underfined'){
                      return;
                    }
                  }
                    esimate_Info[value.StopUID] = {
                      plateNumb: value.PlateNumb, 
                      estimateTime: value.EstimateTime,
                      stopStatus: value.StopStatus
                    };
                });
            }).catch( (err)=>{
                console.log('連線異常:' + err);
                error_Request();
          });
      }

        // Page Event
        const onPage = (event)=>{
            currentPage.value = event.page;
            currentPageRow.value = event.rows;
        }

        const object_isEmpty = (object)=>{
          if (Object.keys(object).length === 0) {
              return true // 如果為空,返回true
          }
          return false // 如果不為空，則會執行到這一步，返回false
        }


         const error_Request = ()=>{
          let click = confirm('連線異常，請重新整理，造成不便十分抱歉😥')
          if(click) location.reload()
        }


        



    return {citys, loading_Config, goToSingleCity, choose_Info, api_Response, currentPage, currentPageRow, StopStatus, esimate_Info, updateInterval, update_Count, 
             Search_Bus_Route, goBackTotalCity, open_Route, close_Route, get_StopOfRoute, onPage, object_isEmpty, refresh_Route_Info}
  }

}
</script>

<style>
/* p-datatable-row-expansion */
</style>