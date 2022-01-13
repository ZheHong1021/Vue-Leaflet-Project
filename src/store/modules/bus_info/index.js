import L from 'leaflet'
import 'leaflet-fontawesome-markers';
import "leaflet-fontawesome-markers/L.Icon.FontAwesome.css";
import {antPath} from 'leaflet-ant-path';
import polyUtil from 'polyline-encoded';
import router from '@/router'


const busMarker = L.icon.fontAwesome({
    iconClasses: "fa fa-bus",
    markerColor: "#e74c3c",
    iconColor: "#FFF",
    iconXOffset: -2,
    iconYOffset: 0
})
const stopMarker = L.icon.fontAwesome({
    iconClasses: "fa fa-bus",
    markerColor: "#2c3e50",
    iconColor: "#FFF",
    iconXOffset: -2,
    iconYOffset: 0
})


export default {
    namespaced: true,
    state:{
        city_name: {
            tw: '',
            en: '',
        },
        bus_Route:{
            uid: '',
            direct: '',
        },
        stop_Markers: L.layerGroup(),
        bus_Markers: L.layerGroup(),
        route_Line: L.layerGroup(),
        map_Route: {},
        map_Stop: {},
        map_EstimateTime: {},
        map_RealTimeNearStop: {},
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
        setApiStop({commit, state}, payload){
            state.stop_Markers = L.layerGroup(); // // 清除座標資料
            const map = {}
            for (const item of payload) {
                map[item.StopUID] = item;
                const marker = L.marker([item.StopPosition.PositionLat, item.StopPosition.PositionLon], {icon: stopMarker} )
                    .bindPopup(`<h2 class='text-xl'>第${item.StopSequence}站_${item.StopName.Zh_tw}</h2>`); 
                state.stop_Markers.addLayer(marker);
            }
            commit('setApiStop', map);
            commit('module_Map/add_Layer_To_Map', state.stop_Markers, { root: true });
        },
        removeStopMarker({commit, state}){
            commit('module_Map/remove_Layer_To_Map', state.stop_Markers, { root: true });
        },
        setRouteShape({commit, state}, payload){
            state.route_Line = L.layerGroup(); // 清除座標資料
            
            const direct = router.currentRoute.value.query.direct;
            console.log(direct);
            const line_arr = polyUtil.decode(payload);
            const antPolyline = antPath(line_arr, {
                "delay": 1500,
                "weight": 6,
                "color": "#27ae60",
                "pulseColor": "#2c3e50",
                // "reverse":  direct == 0 ? false : true
                "reverse": false
              });

            state.route_Line.addLayer(antPolyline);
            commit('module_Map/add_Layer_To_Map', state.route_Line, { root: true });
        },
        removeRouteShape({commit, state}){
            commit('module_Map/remove_Layer_To_Map', state.route_Line, { root: true });
        },
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
                const nextBusTime = item.NextBusTime ? new Date(item.NextBusTime).getHours() + " : " + (new Date(item.NextBusTime).getMinutes() >= 10 ? "" : "0") + new Date(item.NextBusTime).getMinutes() : "";
                map[item.StopUID] = {
                    estimateTime: Math.ceil(item.EstimateTime / 60 ),  // 預估時間(秒數 ÷ 60)
                    stopStatus: status[item.StopStatus],   // 行駛情況
                    nextBusTime: nextBusTime,
                };
            }
            commit('setApiEstimateTime', map);
        },        
        setApiNearStop({commit}, payload){
            const map = {}
            const A2EventType = {0: "離站", 1: "進站"};
            for (const item of payload) {
                map[item.StopUID] = {
                    PlateNumb: item.PlateNumb,
                    A2EventType: A2EventType[item.A2EventType],
                };
            }
            commit('setApiNearStop', map);
        },

        setApiBusNow({commit, state}, payload){
            state.bus_Markers = L.layerGroup(); // 清除座標資料
            for (const item of payload) {
                const marker = L.marker([item.BusPosition.PositionLat, item.BusPosition.PositionLon], {icon: busMarker})
                    .bindPopup(`<h2 class='text-lg'><i class="fas fa-bus"></i> ${item.PlateNumb} 目前位置</h2>`); 
                state.bus_Markers.addLayer(marker);
            }
            commit('module_Map/add_Layer_To_Map', state.bus_Markers, { root: true });
        },
        removeBusMarker({commit, state}){
            commit('module_Map/remove_Layer_To_Map', state.bus_Markers, { root: true });
        },
       
    },
    mutations:{
        setCityName(state, payload){
            sessionStorage.setItem("bus_City", JSON.stringify(payload)); //新增到sessionStorage 
            state.city_name = payload
        },
        setBusRoute(state, payload){
            sessionStorage.setItem("bus_Route", JSON.stringify(payload)); //新增到sessionStorage 
            state.bus_Route = payload
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
        setApiNearStop(state, payload){
            state.map_RealTimeNearStop = payload;
        },
        clearApiRoute(state){
            sessionStorage.removeItem("bus_City");
            state.city_name = {};
            state.city_Route = [];
        },

    },
    getters:{
        
    },
  }