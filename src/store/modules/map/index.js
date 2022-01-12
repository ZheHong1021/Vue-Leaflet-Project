import L from "leaflet";
export default {
    namespaced: true,
    state: {
        map: null,
        currentPos: [],
    },
    
    mutations: {
        set_InitialMap(state, payload){
            state.map = payload;
        },
        set_CurrentPos(state, payload){
            state.currentPos = payload;
        },
        add_Layer_To_Map(state, payload){
            state.map.addLayer(payload);
        },
        remove_Layer_To_Map(state, payload){
            state.map.removeLayer(payload);
        },
        pan_To_Map(state, payload){
            state.map.panTo(L.latLng(payload.lat, payload.lng));
        },
        fitBound_Map(state, payload){
            state.map.fitBounds(payload);
        }
    }
  }