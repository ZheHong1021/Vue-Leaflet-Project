<template>
  <h1></h1>
</template>
<script>

import { onBeforeMount, onMounted, reactive } from 'vue';
import { useStore } from 'vuex' // Composition API
import leaflet from 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster';
import { API_Train_Station } from "../api/api.js"; 


export default {
    setup(){
    const store = useStore()
    const react = reactive({
      stations: [],
    })

    onBeforeMount(async () => {
       await API_Train_Station().then((res)=>{
        react.stations = res.data;
        react.stations.map(item => leaflet.marker(new leaflet.LatLng(item.StationPosition.PositionLat, item.StationPosition.PositionLon))  // 新增Marker
          .bindPopup(`<p>經度: ${item.StationPosition.PositionLat}</p><p>緯度: ${item.StationPosition.PositionLon}</p>`))  // 資訊視窗
          .forEach(item => store.state.module_Marker.clusterMarker.addLayer(item));  // 把marker加入 L.markerClusterGroup中
        }).catch((err)=>{
          console.log('連線異常:' + err);
        });
        
        store.commit('module_Station/setTrainStation', react.stations)
    })
              
    onMounted(()=>{
        // Vuex->state
        store.state.module_Map.map.addLayer(store.state.module_Marker.clusterMarker);
    })

    return { react }
  }
}
</script>

<style>

</style>