// import L from 'leaflet'
// import { onEachFeature } from '@/utilities/geoJSON'

export default {
    namespaced: true,
    state: {
        namespaced: true,
        state: {
          map: null,
      },
    },
    
    mutations: {
        set_InitialMap(state, payload){
            state.map = payload;
        },

    }
  }