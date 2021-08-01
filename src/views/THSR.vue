<template>

    <section class="flex flex-col w-full items-center">
      <form 
        class="flex flex-col w-full items-center"  
        @submit.prevent='Search_Info'>

      <div class="w-1/2 my-4">
                <h1 class="text-xl font-bold w-full flex justify-between">
          起站點
          <small mall class="text-red-500 text-right" v-if="info.origin_Station_id === '' && is_Search">
            ★ 請確實填寫
          </small>
        </h1>

          <Dropdown 
            class="w-full"
            :class="(info.origin_Station_id === '' && is_Search) ? 'is_empty' : ''"
            :filter="true"
            filterPlaceholder="選擇車站"
            v-model="info.origin_Station_id" 
            :options="$store.state.module_Station.new_high_Speed_Rail" 
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
            :options="$store.state.module_Station.new_high_Speed_Rail" 
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
            class="p-button-text p-button-text w-full text-lg py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-green-500 hover:bg-green-700" 
            :loading="isLoading" />
      </div>

      </form>

      <div class="w-3/4 h-auto p-4 my-2 rounded border bg-yellow-200">
        <div class="text-lg font-bold text-center w-full">
          <div v-if="!object_isEmpty(result.odfare) && !object_isEmpty(result.timeTable)  && isLoading === false" >haha</div>
          <div v-else-if="isLoading === true">載入中</div>
          <div v-else>歡迎查詢~!!</div>
        </div>
      </div>

      </section>


   

</template>
<script>
import {onMounted, reactive, ref} from '@vue/runtime-core'
import { useStore } from 'vuex' // Composition API
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import { get_Thsr_Odfare, get_Thsr_TimeTable } from "../api/api.js"; 


export default {
   components: {
     Dropdown: Dropdown,
     Button: Button,
     Calendar: Calendar,
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



      const isLoading = ref(false)
      const is_Search = ref(false) // 是否查詢
      const store = useStore()

    onMounted(()=>{
      // 如果 store的 new_arr是空的話，則透過 commit去更新(新增)
      // 下次進入該 page時，則不會再執行該下方指令
      const is_empty = store.getters['module_Station/get_NewThsrArr_Length']
      if(is_empty){
        setTimeout(() => {
            store.commit('module_Station/setNewStation', 'thsr');
        }, 1500);
      }
    })



    const Search_Info = async ()=>{
          // 確定是否點擊查詢
          is_Search.value = true

          if(info.origin_Station_id !== '' && info.destinate_Station_id !== ''  && info.choose_Date !== ''){
            //  傳送起站、迄站的ID給 API(透過 Promise.all將 多個API同時執行)
            Promise.all([
              get_Thsr_Odfare({
                  OriginStationID : info.origin_Station_id, 
                  DestinationStationID : info.destinate_Station_id,
              }),
              get_Thsr_TimeTable({
                  OriginStationID : info.origin_Station_id, 
                  DestinationStationID : info.destinate_Station_id,
                  choose_Date: info.choose_Date})
            ])
            .then( (response) => {
                result.odfare = response[0].data;
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
      // console.log(new_date.getFullYear());
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


      return {info, result, object_isEmpty, is_Search, isLoading, Search_Info, dateSelect}
    }
}



</script>

<style scoped>
  .is_empty{
    border: 2px solid red;
  }
</style>