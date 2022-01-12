import {get_Travel_ScenicSpot} from './travel';
import {get_Restaurant} from './restaurant';
import {get_Train_Station, get_Train_Odfare, get_Train_TimeTable, get_NearByTrain_Station} from './train';
import {get_THSR_Station, get_THSR_Odfare, get_THSR_TimeTable, get_NearByTHSR_Station} from './high_Speed_Rail';

import {get_Bus_Route, 
    get_Bus_StopOfRoute, 
    get_Bus_DisplayStopOfRoute, 
    get_Bus_EstimatedTimeOfArrival, 
    get_Bus_RealTimeByFrequency, 
    get_Bus_RealTimeNearStop, 
    get_BusStop,
    get_BusStation,
    get_NearByBusStop,
    get_BusRouteShape} from './bus';

/*====== 旅遊 ====== */
export const API_Travel_ScenicSpot = get_Travel_ScenicSpot



/*====== 餐廳 ====== */
export const API_Restaurant = get_Restaurant



/*====== 台鐵 ====== */

// 得到台鐵的站點資訊(使用到的位置: /components/TrainStation)
export const API_Train_Station = get_Train_Station

// 得到台鐵的票價資訊(使用到的位置: /views/TRA)
export const API_Train_Odfare = get_Train_Odfare

// 得到台鐵的時刻表(使用到的位置: /views/TRA)
export const API_Train_TimeTable = get_Train_TimeTable

// 得到附近的有火車站(使用到的位置: /views/TRA)
export const API_Train_NearByStation = get_NearByTrain_Station;



/*====== 高鐵 ====== */

// 得到高鐵的站點資訊(使用到的位置: /components/ThsrStation)
export const API_THSR_Station = get_THSR_Station

// 得到高鐵的票價資訊(使用到的位置: /views/THSR)
export const API_THSR_Odfare = get_THSR_Odfare

// 得到高鐵的時刻表(使用到的位置: /views/THSR)
export const API_THSR_TimeTable = get_THSR_TimeTable

// 得到附近的有高鐵站(使用到的位置: /views/TRA)
export const API_THSR_NearByStation = get_NearByTHSR_Station;



/*====== 公車 ====== */

// 得到公車路線資訊(使用到的位置: /views/Bus)
export const API_Bus_Route = get_Bus_Route

// 得到公車路線上的各個站點(使用到的位置: /views/Bus)
export const API_Bus_StopOfRoute = get_Bus_StopOfRoute

// 得到公車路線上的各個站點(使用到的位置: /views/Bus)
export const API_Bus_DisplayStopOfRoute = get_Bus_DisplayStopOfRoute

// 得到公車路線上的到站估計時間(使用到的位置: /views/Bus)
export const API_Bus_EstimatedTimeOfArrival = get_Bus_EstimatedTimeOfArrival

// 得到目前公車在地圖上哪個位置(使用到的位置: /views/Bus)
export const API_Bus_RealTimeByFrequency = get_Bus_RealTimeByFrequency

// 得到目前公車在哪個站點(使用到的位置: /views/Bus)
export const API_Bus_RealTimeNearStop = get_Bus_RealTimeNearStop

// 得到公車的站點資訊(使用到的位置: /components/Map)
export const API_BusStop = get_BusStop

// 得到公車的站點資訊(使用到的位置: /components/Map)
export const API_BusStation = get_BusStation

// 得到目前位置的所有車站
export const API_NearByBusStop = get_NearByBusStop

// 得到特定路線的精細路線圖
export const API_BusRouteShape = get_BusRouteShape