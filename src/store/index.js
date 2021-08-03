import Vuex from 'vuex';
import leaflet from 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster';

// Module good
// https://siddharam.com.tw/post/20200317/


// 地圖
const moduleMap = {
  namespaced: true,
    state: {
      map: null,
  },

  mutations: {
    set_InitialMap(state, payload){
      state.map = payload;
    },
  }
}

// Marker
const moduleMarker = {
  namespaced: true,
    state:{
      clusterMarker:  leaflet.markerClusterGroup(),
      greenIcon: new leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),
    },
}


// Station
const moduleStation = {
  namespaced: true,
    state:{
      train: [],
      new_train: [],
      high_Speed_Rail: [],
      new_high_Speed_Rail: [],
    },
    
    mutations:{
      setTrainStation(state, payload){
        state.train = payload;
      },
      setHighSpeedStation(state, payload){
        state.high_Speed_Rail = payload;
      },

      setNewStation(state, payload){
        const category = payload == 'train' ? state.train : state.high_Speed_Rail
        const new_arr = payload == 'train' ? state.new_train : state.new_high_Speed_Rail
        


        // 火車想要做GroupDropDown，所以必須列出該車站的所在城市，其他種類則不用
        if( payload === 'train'){
          let city_include = []
          Object.keys(category).forEach(function (key) {
            const city_name = category[key].LocationCity.substr(0,2)
            if(city_include.includes(city_name) ){
              new_arr[city_include.length - 1].station.push({
                name: category[key].StationName.Zh_tw, 
                id: category[key].StationID,
              })
            }else{
            new_arr.push({
              city: city_name,
              station: [{
                name: category[key].StationName.Zh_tw, 
                id: category[key].StationID,
              }]
            })
            city_include.push(city_name)
          }
        })
      }else{
        Object.keys(category).forEach(function (key) {
            new_arr.push({
              name: category[key].StationName.Zh_tw, 
              id: category[key].StationID,
            })
          })
      }
        


      }
      
    },
    getters:{
      get_NewTrainArr_Length(state){
        return state.new_train.length === 0;
      },
      get_NewThsrArr_Length(state){
        return state.new_high_Speed_Rail.length === 0;
      },
    },
}

const store = new Vuex.Store({
  modules: {
    module_Map: moduleMap,
    module_Marker: moduleMarker,
    module_Station: moduleStation,
  }
})

export default store;