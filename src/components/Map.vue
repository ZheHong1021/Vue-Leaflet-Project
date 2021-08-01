<template>
<!-- z-0 最下層，否則 select不能用 -->
  <div id="map" class="w-full z-0"></div>
</template>

<script>
import L from 'leaflet'
import '@ansur/leaflet-pulse-icon'
import 'leaflet-sidebar-v2'
import { onMounted } from 'vue';
import { useStore } from 'vuex' // Composition API

export default {
  name: 'Map',

  setup(){
    let map = null;
    const store = useStore()

    const error_Position = [22.620894, 120.311859];

    const blueIcon = L.icon.pulse({
      iconSize: [20, 20],
      color: '#2e72f0',
      fillColor: '#2e72f0'
    })

    const blueMarker = L.marker(error_Position, {
        icon: blueIcon,
        title: '目前位置', 
        opacity: 1.0
      });

    // 抓不到定位時
    function errorHandler(e) {
      console.log("e", e);
      window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 「高雄市政府」');
      map.setView(error_Position, 18); // 中心移到高雄市政府
    }

    // 抓到使用者提供的位置
    let foundHandler = function(e) {
      let myLocation = e.latlng // 使用者位置
      blueMarker.setLatLng(myLocation); // 座標定位在該位置
    }


    onMounted(()=>{
      map = new L.map('map');
      // Vuex->state
      store.commit('module_Map/set_InitialMap', map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      blueMarker.addTo(map);
      map.locate({ setView: true, watch: false, maxZoom: 18, enableHighAccuracy: true });
      map.on('locationfound', foundHandler);
      map.on('locationerror', errorHandler);

    })
  }

  }

</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/leaflet-pulse-icon@0.1.0/src/L.Icon.Pulse.css';
#map{
  /* height: calc(100vh - 4rem); */
  height: 100vh;
}

</style>


