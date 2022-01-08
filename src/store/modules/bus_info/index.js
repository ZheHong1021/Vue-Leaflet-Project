export default {
    namespaced: true,
    state:{
        city_name: {
            tw: '',
            en: '',
        },
        map_Route: {},
        map_Stop: {},
        map_EstimateTime: {},
    },
    actions:{
        // 將陣列轉成 map型態，找尋資料較有效率
        setApiRoute({commit}, payload){
            const map = {}
            for (const item of payload) {
                map[item.RouteUID] = item;
            }
            commit('setApiRoute', map);
        },
        // 將陣列轉成 map型態，找尋資料較有效率
        setApiStop({commit}, payload){
            const map = {}
            for (const item of payload) {
                map[item.StopUID] = item;
            }
            commit('setApiStop', map);
        },
        // 將陣列轉成 map型態，找尋資料較有效率
        setApiEstimateTime({commit}, payload){
            const map = {}
            const status = {0:'正常', 1:'尚未發車', 2:'交管不停靠', 3:'末班已過', 4:'今日停駛'};
            for (const item of payload) {
                // 情況1: 沒有在Object中，直接紀錄(跳離條件式)
                // 情況2: 有在 Object中，判斷有預估時間或到站時間最短者優先紀錄 (跳離條件式)
                // 情況3: 有在 Object中，但記錄的時間較短 ->剔除 (return)
                // 情況3: 有在 Object中，無預估時間 ->剔除 (return)
                if(Object.prototype.hasOwnProperty.call(map, item.StopUID)){
                    if(map[item.StopUID] == 'underfined' || map[item.StopUID].estimateTime < item.EstimateTime){
                        return;
                    }
                }
                const nextBusTime = item.NextBusTime ? new Date(item.NextBusTime).getHours() + " : " + (new Date(item.NextBusTime).getMinutes() > 10 ? "" : "0") + new Date(item.NextBusTime).getMinutes() : "";
                map[item.StopUID] = {
                    estimateTime: Math.ceil(item.EstimateTime / 60 ),  // 預估時間(秒數 ÷ 60)
                    stopStatus: status[item.StopStatus],   // 行駛情況
                    nextBusTime: nextBusTime,
                };
            }
            commit('setApiEstimateTime', map);
        },
    },
    mutations:{
        setCityName(state, payload){
            sessionStorage.setItem("bus_City", JSON.stringify(payload)); //新增到sessionStorage 
            state.city_name = payload
        },
        setApiRoute(state, payload){
            state.map_Route = payload;
        },
        setApiStop(state, payload){
            state.map_Stop = payload;
        },
        setApiEstimateTime(state, payload){
            state.map_EstimateTime = payload;
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