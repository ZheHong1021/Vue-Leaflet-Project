import Vuex from 'vuex';
import moduleMap from './modules/map/index'
import moduleMarker from './modules/marker/index'
import moduleStation from './modules/station/index'
// Module good
// https://siddharam.com.tw/post/20200317/

const store = new Vuex.Store({
  modules: {
    module_Map: moduleMap,
    module_Marker: moduleMarker,
    module_Station: moduleStation,
  }
})

export default store;