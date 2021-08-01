<template>

    <section class="flex flex-col w-full items-center">
      <form 
        class="flex flex-col w-full items-center"  
        @submit.prevent='Search_Info'>

      <div class="w-1/2 my-4">
        <h1 class="text-xl font-bold w-full flex justify-between">
          起站點
          <small class="text-red-500 text-right" v-if="info.origin_Station_id === '' && is_Search">
            ★ 請確實填寫
          </small>
        </h1>

          <Dropdown 
            class="w-full"
            :class="(info.origin_Station_id === '' && is_Search) ? 'is_empty' : ''"
            :filter="true"
            filterPlaceholder="選擇車站"
            v-model="info.origin_Station_id" 
            :options="$store.state.module_Station.new_train" 
            optionLabel="station" 
            optionValue="id"
            emptyFilterMessage="找不到該車站，請重新搜尋"
            placeholder="選擇起站點" />
      </div>

      <div class="w-1/2 my-4">
         <h1 class="text-xl font-bold w-full flex justify-between">
          迄站點
          <small class="text-red-500 text-right" v-if="info.destinate_Station_id === '' && is_Search">
            ★ 請確實填寫
          </small>
        </h1>

          <Dropdown 
            class="w-full"
            :class="(info.destinate_Station_id === '' && is_Search) ? 'is_empty' : ''"
            :filter="true"
            filterPlaceholder="選擇車站"
            v-model="info.destinate_Station_id" 
            :options="$store.state.module_Station.new_train" 
            optionLabel="station" 
            optionValue="id"
            emptyFilterMessage="找不到該車站，請重新搜尋"
            placeholder="選擇迄站點" />
      </div>


      <div class="w-1/2 my-4">
        <h1 class="text-xl font-bold w-full flex justify-between">
            日期
            <small class="text-red-500 text-right" v-if="info.choose_Date === '' && is_Search">
              ★ 請確實填寫
            </small>
          </h1>
        <Calendar 
            class="w-full" 
            :showIcon= "true" 
            :showButtonBar="true" 
            dateFormat="yy.mm.dd" 
            v-model="info.choose_Date"
            @date-select = "dateSelect"
            />
      </div>


      <div class="w-1/2 my-4">
        <Button 
            type="submit" 
            label="Search" 
            icon="pi pi-search" 
            iconPos="right" 
            class="p-button-text p-button-text w-full text-lg py-2 px-4 font-semibold rounded-lg shadow-md" 
            :loading="isLoading" />
      </div>

      </form>


      <!-- <div class="w-3/4 h-auto p-4 my-2 rounded border bg-yellow-200">
        <div class="text-lg font-bold text-center w-full">
          <div v-if="!object_isEmpty(result.odfare) && !object_isEmpty(result.timeTable)  && isLoading === false" >
            </div>
          <div v-else-if="isLoading === true">載入中</div>
          <div v-else>歡迎查詢~!!</div>
        </div>
      </div> -->

      <div v-if="!object_isEmpty(result.odfare) && !object_isEmpty(result.timeTable)  && isLoading === false" >

       <div class="w-full">
        <DataTable :value="result.timeTable" :paginator="true" :rows="10"
              currentPageReportTemplate="目前顯示 {first} / {last} ，查詢總車班量: {totalRecords}"
              paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink"
              responsiveLayout="scroll"
              
            >
            <Column header="車次編號">
              <template #body="slotProps">
                  <h1>{{slotProps.data.DailyTrainInfo.TrainNo}}</h1>
                <!-- 透過下面所定義的reactive來去抓取相對應的車種名稱 -->
                  <h1>{{ trainType[slotProps.data.DailyTrainInfo.TrainTypeCode] }}</h1>
              </template>
            </Column>
            <Column field="OriginStopTime.DepartureTime" header="出發時間"></Column>
            <Column field="DestinationStopTime.ArrivalTime" header="到站時間"></Column>
            <Column header="行駛時間">
                <template #body="slotProps">
                  <h1>{{ diff_DriveTime(slotProps.data.OriginStopTime.DepartureTime, slotProps.data.DestinationStopTime.ArrivalTime) }}</h1>                  
                </template>
            </Column>
           
        </DataTable>    
      </div>
      </div>

      </section>

</template>
<script>
import {onMounted, reactive, ref} from '@vue/runtime-core'
import { useStore } from 'vuex' // Composition API
import { get_Train_Odfare, get_Train_TimeTable } from "../api/api.js"; 
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
   components: {
     Dropdown: Dropdown,
     Button: Button,
    Calendar: Calendar,
    DataTable: DataTable,
    Column: Column,
    },

    setup(){
      const info = reactive({
        'origin_Station_id' : "",
        'destinate_Station_id' : "",
        'choose_Date': "",
      });

      const result = reactive({
        odfare: {},
        timeTable: {},
      })

      const trainType = reactive({
        1: '太魯閣', 2: '普悠瑪', 3: '自強', 4: '莒光', 5: '復興', 6: '區間', 7: '普快', 10: '區間快'
      })

      const isLoading = ref(false)
      const is_Search = ref(false) // 是否查詢
      const store = useStore()

    // 讀取 API
    onMounted(()=>{
      // 如果 store的 new_arr是空的話，則透過 commit去更新(新增)
      // 下次進入該 page時，則不會再執行該下方指令
      const is_Arr_empty = store.getters['module_Station/get_NewTrainArr_Length']
      if(is_Arr_empty){
        setTimeout(() => {
            store.commit('module_Station/setNewStation', 'train');
        }, 1500);
      }
    })


    const Search_Info = async ()=>{
      // 確定是否點擊查詢
      is_Search.value = true

      if(info.origin_Station_id !== '' && info.destinate_Station_id !== '' && info.choose_Date !== ''){
        //  傳送起站、迄站的ID給 API(透過 Promise.all將 多個API同時執行)
        Promise.all([
          get_Train_Odfare({
              OriginStationID : info.origin_Station_id, 
              DestinationStationID : info.destinate_Station_id,
          }),
          get_Train_TimeTable({
              OriginStationID : info.origin_Station_id, 
              DestinationStationID : info.destinate_Station_id,
              choose_Date: info.choose_Date})
        ])
        .then( (response) => {
            result.odfare = response[0].data.ODFares;
            result.timeTable = response[1].data;
        })
          //  Loading Animation
          isLoading.value = true
          if( result.odfare && result.timeTable ){
            setTimeout(() => {
              isLoading.value = false
            }, 1000);
          }
      }
    }


     const dateSelect = (date)=>{
      const new_date = new Date(date);
      const year = new_date.getFullYear()
      // 月份跟日期必須以 [mm-dd]的方式呈現
      const month = (new_date.getMonth() + 1) < 10 ? `0${new_date.getMonth() + 1}` : new_date.getMonth() + 1;
      const day = (new_date.getDate()) < 10 ? `0${new_date.getDate()}` : new_date.getDate();
      info.choose_Date = `${year}-${month}-${day}`
    }


    const object_isEmpty = (object)=>{
      if (Object.keys(object).length === 0) {
          return true // 如果為空,返回true
      }
      return false // 如果不為空，則會執行到這一步，返回false
    }


    const diff_DriveTime = (O_Time, D_Time)=>{
      const _startTime = O_Time.split(":");
      const _endTime = D_Time.split(":");
      let startDate = new Date(0, 0, 0, _startTime[0], _startTime[1], 0);
      let EndDate = new Date(0, 0, 0, _endTime[0], _endTime[1], 0);
      EndDate.setHours(EndDate.getHours() - startDate.getHours());
      EndDate.setMinutes(EndDate.getMinutes() - startDate.getMinutes());
      return EndDate.getHours() + "小時" + EndDate.getMinutes() + "分鐘";
    }


      return {info, result, trainType, is_Search, isLoading, object_isEmpty, Search_Info, dateSelect, diff_DriveTime}
    }
}



</script>

<style scoped>
  .is_empty{
    border: 2px solid red;
  }
</style>