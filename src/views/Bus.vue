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
              :class="city.isActive === true ? 'bg-yellow-500' : 'bg-yellow-300'"
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
          :value="result.total_Route" 
          responsiveLayout="scroll"
          :paginator="true" 
          :rows="10"
          currentPageReportTemplate="目前顯示 {first} / {last}，共{totalRecords}條路線"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport">

              <Column :expander="true" headerStyle="width: 3rem" />
              <Column header="路線名稱" sortable>
                 <template #body="slotProps">
                    <h1 class="text-lg">
                    {{slotProps.data.RouteName.Zh_tw}}
                    </h1>
                </template>
              </Column>
              <Column header="行駛目標" field="DestinationStopNameZh" >
                  <template #body="slotProps" >
                    <h1 class="font-bold">{{slotProps.data.DepartureStopNameZh}}</h1>
                    <i class="fas fa-arrow-circle-down text-lg"></i>
                    <h1 class="font-bold">{{slotProps.data.DestinationStopNameZh}}</h1>
                </template>
              </Column>
        </DataTable>


  </section>



</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { get_Bus_Route } from "../api/api.js"; 
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


export default {
  components: {
    Loading: Loading,
    Button: Button,
    DataTable: DataTable,
    Column: Column,
  },
  setup(){
      const test = reactive({})


       // Loading Config
      const loading_Config = reactive({
        isLoading: false, // 啟動/關閉
        isFullPage: true, // 全螢幕
        color: "#000",
        loader: 'dots', // Loading icon:  spineer / dots / bars,
        time: 1500 // 動畫時間: 1.5s
      })

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

      // 選擇查詢的資訊
      const choose_Info = reactive({
        city: '',
        city_en: '',
      })

      // API Respones
      const result = reactive({
        total_Route: [],
      }) 

   

      const is_Search = ref(false);

      // const master_City = reactive([
      //   'Taipei', 'NewTaipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung'
      // ])

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
              result.total_Route = res.data;
              choose_Info.city = city_name;
              choose_Info.city_en = city_name_en;
          }).catch( (err)=>{
              console.log('連線異常:' + err);
              clearActive()
              alert('連線失敗，請重新再試')
          })        
      }


      const goBackTotal = ()=>{
          Show_Loading('Total');
          choose_Info.city = '';
          choose_Info.city_en = '';
          result.total_Route = [];
          clearActive()
      }


      const clearActive = ()=>{
          citys.forEach((city)=>{
            city.isActive = false;
          })
      }


    return {citys, loading_Config, is_Search, choose_Info, result,test,
             Search_Bus_Route, goBackTotal}
  }

}
</script>

<style>

</style>