export default {
    namespaced: true,
    state:{
        city_name: {
            tw: '',
            en: '',
        },
        city_Route: [],
    },
    actions:{
        
    },
    mutations:{
        setCityName(state, payload){
            sessionStorage.setItem("bus_City", JSON.stringify(payload)); //新增到sessionStorage 
            state.city_name = payload
        },
        setApiRoute(state, payload){
            state.city_Route = payload;
        },

        clearApiRoute(state){
            sessionStorage.removeItem("bus_City");
            state.city_name = {};
            state.city_Route = [];
        }
    },
    getters:{

    },
  }