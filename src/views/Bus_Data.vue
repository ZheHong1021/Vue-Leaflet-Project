<template>


    <loading v-model:active="loading_Config.isLoading"
      :is-full-page="loading_Config.isFullPage"
      :loader="loading_Config.loader"
      :color="loading_Config.color"
      />

  <section id="Total_City" class="w-full flex flex-wrap justify-evenly" v-show = "is_Search === false">
        <div 
            class="my-3 flex justify-center text-lg font-bold" 
            v-for="(city, index) in citys" 
            :key="city">
            <div 
              class="w-40 h-40 p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer"
              @click="Search_Bus_Route(index)"
              :class="city.isActive === true ? 'bg-yellow-600' : 'bg-yellow-200'"
              :id="city.en">
                <i class="fas fa-bus-alt text-5xl"></i>
                <h1 class="mt-4 text-xl">{{city.name}}</h1>
            </div>
        </div>
  </section>



  <section id="Single_City" class="w-full flex flex-col justify-center items-center" v-show = "is_Search === true">
    <h1 class="text-xl font-bold my-2">{{ choose_Info.city }}</h1>
    <Button type="button" class="p-button-outlined p-button-success my-4"
          @click="goBackTotal">
        <i class="fas fa-reply-all text-black mr-3"></i>
        <span class="p-ml-2 p-text-bold font-bold">回上一頁</span>
    </Button>

        <DataTable 
          class="w-full"
          :value="result.total_Routes" 
          responsiveLayout="scroll"
          v-model:filters="filters1"
          :globalFilterFields="['DepartureStopNameZh', 'DestinationStopNameZh', 'RouteName.Zh_tw']">
               <template #header>
                        <span class="p-input-icon-left ">
                            <i class="pi pi-search" />
                            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
                        </span>
                </template>

               <template #empty>
                    找不到所搜尋的資訊
                </template>

              <Column header="路線名稱">
                 <template #body="slotProps">
                      <div class="mx-2 mr-6">{{slotProps.data.RouteName.Zh_tw}}

                            <Accordion class="w-full" @tab-open="toggle_Route(slotProps.data.RouteUID)">
                          <AccordionTab>
                            <template #header>
                              <i class="fas fa-bus"></i>
                              <span class="mx-2 mr-6">{{slotProps.data.RouteName.Zh_tw}}</span>
                              <span>
                                {{slotProps.data.DepartureStopNameZh }}  
                                <i class="fas fa-arrow-circle-right text-lg"></i>
                                {{slotProps.data.DestinationStopNameZh  }}
                              </span>
                            </template>
                            
                            <!-- Body -->
                            <div v-show="result.bus_stop.length !== 0">
                                <div class="w-full flex justify-center mb-4 mt-2">
                                  <Button @click="get_StopOfRoute(0)" label="順行" class="font-bold p-button-raised"
                                    :class="choose_Info.direction !== 0 ? 'p-button-text' : ''" />
                                  <Button @click="get_StopOfRoute(1)" label="逆行" class="font-bold p-button-raised"
                                    :class="choose_Info.direction !== 1 ? 'p-button-text' : ''" />
                                </div>

                              <div v-for="(stop, index) in result.bus_stop" :key="index">
                                  <h1>{{ stop.StopName.Zh_tw }}</h1>
                              </div>

                            </div>

                          </AccordionTab>
                    </Accordion>

                      </div>
                </template>
              </Column>
        </DataTable>

  </section>



</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { get_Bus_Route, get_Bus_StopOfRoute } from "../api/api.js"; 
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import {FilterMatchMode, FilterOperator} from 'primevue/api';
import InputText from 'primevue/inputtext';

export default {
  components: {
    Loading: Loading,
    Button: Button,
    Accordion: Accordion,
    AccordionTab: AccordionTab,
    DataTable: DataTable,
    Column: Column,
    InputText: InputText,
  },
  setup(){
      const citys = reactive([
        {name:'臺北市', en:'Taipei', isActive: false},
        {name:'新北市', en:'NewTaipei', isActive: false},
        {name:'桃園市', en:'Taoyuan', isActive: false},
        {name:'臺中市', en:'Taichung', isActive: false},
        {name:'臺南市', en:'Tainan', isActive: false},
        {name:'高雄市', en:'Kaohsiung', isActive: false},
        {name:'基隆市', en:'Keelung', isActive: false},
        {name:'新竹市', en:'Hsinchu', isActive: false},
        {name:'新竹縣', en:'HsinchuCounty', isActive: false},
        {name:'苗栗縣', en:'MiaoliCounty', isActive: false},
        {name:'彰化縣', en:'ChanghuaCounty', isActive: false},
        {name:'南投縣', en:'NantouCounty', isActive: false},
        {name:'雲林縣', en:'YunlinCounty', isActive: false},
        {name:'嘉義縣', en:'ChiayiCounty', isActive: false},
        {name:'嘉義市', en:'Chiayi', isActive: false},
        {name:'屏東縣', en:'PingtungCounty', isActive: false},
        {name:'宜蘭縣', en:'YilanCounty', isActive: false},
        {name:'花蓮縣', en:'HualienCounty', isActive: false},
        {name:'臺東縣', en:'TaitungCounty', isActive: false},
        {name:'金門縣', en:'KinmenCounty', isActive: false},
        {name:'澎湖縣', en:'PenghuCounty', isActive: false},
        {name:'連江縣', en:'LienchiangCounty', isActive: false},
      ])
    

      // 選擇查詢的資訊(城市、路線)
      const choose_Info = reactive({
        city: '',
        city_en: '',
        route: '',
        direction: 0,
      })

      const is_Search = ref(false);

      // API Respones
      const result = reactive({
        total_Routes: [],
        total_Stops: [],
        bus_stop: [],
      })

  

      
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
          // simulate AJAX
          setTimeout(() => {
              loading_Config.isLoading = false;
              is_Search.value = goTo === 'Single' ? true : false;
          }, loading_Config.time);
      }


      const Search_Bus_Route = async(index) =>{
          const city_name = citys[index].name;
          const city_name_en = citys[index].en;
          citys[index].isActive = true;
          
          Show_Loading('Single')

          await get_Bus_Route(city_name_en)
            .then( (res)=>{
              result.total_Routes = res.data;
              choose_Info.city = city_name;
              choose_Info.city_en = city_name_en;
          }).catch( (err)=>{
              console.log('連線異常:' + err);
              clearActive()
              // alert('連線失敗，請重新整理後再使用')
              const refresh = confirm('連線失敗，請重新整理後再使用');
              if(refresh) location.reload();
          })        
      }


      const goBackTotal = ()=>{
          Show_Loading('Total');
          choose_Info.city = '';
          choose_Info.city_en = '';
          result.total_Routes = [];
          clearActive()
      }

      const clearActive = ()=>{
          citys.forEach((city)=>{
            city.isActive = false;
          })
      }

        const filters1 = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            'DepartureStopNameZh': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            'DestinationStopNameZh': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            'RouteName.Zh_tw': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.EQUALS}]},
        });

  

      // 匯入該路線API資訊
      const toggle_Route = async (uid)=>{
        console.log('uid=' + uid);
        // 確認是否重複點選，重複: ""(代表關閉目前 Accordion)，不重複: uid(代表開啟了新的 Accordion)
          choose_Info.route = choose_Info.route !== uid ? uid : "";
          // 重複點選就不用再呼叫API了
          if(choose_Info.route !== ""){
              const request = {city: choose_Info.city_en, routeUid: choose_Info.route}
               await get_Bus_StopOfRoute(request)
              .then( (res)=>{
                // 用一個 reactive來保存
                result.total_Stops = res.data;

                // 起始載入，行駛方向為順向
                get_StopOfRoute(0);
            }).catch( (err)=>{
                console.log('連線異常:' + err);
                let click = confirm('連線異常，請重新整理，造成不便十分抱歉😥')
                if(click){
                  location.reload()
                }
            })
          }
      }


        // 這邊因為每個路線都會有數個子路線，而我們要將每個子路線的行駛方向所經過的站點都抓近來
      const get_StopOfRoute = (direction)=>{
          choose_Info.direction = direction;
          let maxStopLength = 0;
          let max_index = 0
          // 子路線數量
          let SubRouteNum = Object.keys(result.total_Stops).length;
          for(let index = 0; index< SubRouteNum ; index++){
              // 且這子路線的行駛方向要跟 direction相同
              if(result.total_Stops[index].Direction === direction){
                const stop = result.total_Stops[index].Stops;
                const stop_Length = stop.length;
                // 如果路線長度大於最大，則記錄起來
                if(stop_Length > maxStopLength){
                  maxStopLength = stop_Length
                  max_index = index  // 紀錄哪一個是站點最多的子路線
                }
            }
          }
          // 最後將站點最多的留下來(而這邊還有部分班次的特殊站點需要去做處理)
          result.bus_stop = result.total_Stops[max_index].Stops
      }



    return {citys, loading_Config, is_Search, choose_Info, result, filters1,
             Search_Bus_Route, goBackTotal, toggle_Route, get_StopOfRoute}
  }

}
</script>

<style>
/* p-datatable-row-expansion */
</style>