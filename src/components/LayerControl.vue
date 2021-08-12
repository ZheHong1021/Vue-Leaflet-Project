<template>
  <h1></h1>
</template>

<script>
import { useStore } from 'vuex' // Composition API
import L from 'leaflet'
export default {
  setup(){
    // Call Store
    const store = useStore();


    // 增加地圖中的 Control
      const L_Control_Add = (i_Content, position, bg_Color, click_Event) => {
          var customControl =  L.Control.extend({
            options: {
              position: position
            },
            onAdd: function () {
                var container = L.DomUtil.create('div', `cursor-pointer w-10 h-10 text-xl flex justify-center items-center rounded ${bg_Color}`);
                container.innerHTML = i_Content
                container.onclick = click_Event;
              return container;
            }
          });
          store.state.module_Map.map.addControl(new customControl());
      }

    // 設個延遲，等待地圖載入
    setTimeout(() => {
      L_Control_Add('<i class="fas fa-crosshairs text-3xl" style="color:rgb(82, 81, 81)" title="回到目前位置"></i>', 'topright', 'bg-transparent', goTo_CurrentView);
      L_Control_Add('<i class="twicon-main-island text-4xl" title="台灣"></i>', 'topright', 'bg-gray-400', goTo_TaiwanView);
    }, 1500);
    
     const goTo_TaiwanView = ()=>{
          store.state.module_Map.map.fitBounds([
            [21.9705713974, 120.106188593],
            [25.2954588893, 121.951243931]
          ]);
        }
        const goTo_CurrentView = ()=>{
           store.state.module_Map.map.setView(store.state.module_Map.currentPos,  17)
        }



    return {}
  }
}
</script>

<style>
@import '../assets/twicon/twicon.css'

</style>