import axios from 'axios';
import {useAuthHeader} from '../utilities/useAuthHeader'   // AuthKey

// 得到公車路線資訊(使用到的位置: /views/Bus)
let PTX_Bus_V2 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Bus',
    headers: useAuthHeader()
});

setInterval(() => {
    PTX_Bus_V2 = axios.create({
        baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Bus',
        headers: useAuthHeader()
    });
}, 4 * 60 * 1000 );



const select_Bus_Route = 'RouteUID, RouteName, SubRoutes, BusRouteType, DepartureStopNameZh, DestinationStopNameZh';
export const get_Bus_Route = (city) => PTX_Bus_V2.get(`/Route/City/${city}?$format=JSON&$select=${select_Bus_Route}`);

const select_Bus_StopOfRoute = 'Direction, Stops';
export const get_Bus_StopOfRoute = (data) => PTX_Bus_V2.get(`/StopOfRoute/City/${data.city}?$format=JSON&$select=${select_Bus_StopOfRoute}&$filter=RouteUID eq '${data.routeUID}'`);


// 這個可以以線性(Leanerly)方式來顯示該路線所有的站序(臺北市、 臺南市、 新北市、 桃園市、 臺中市)
const select_Bus_DisplayStopOfRoute = 'Direction, Stops';
export const get_Bus_DisplayStopOfRoute = (data) => PTX_Bus_V2.get(`/DisplayStopOfRoute/City/${data.city}?$format=JSON&$select=${select_Bus_DisplayStopOfRoute}&$filter=RouteUID eq '${data.routeUID}'`);


const select_Bus_EstimatedTimeOfArrival = 'StopUID, Direction, PlateNumb, EstimateTime, NextBusTime, StopName';
export const get_Bus_EstimatedTimeOfArrival = (data) => PTX_Bus_V2.get(`/EstimatedTimeOfArrival/City/${data.city}?$format=JSON&$select=${select_Bus_EstimatedTimeOfArrival}&$filter=RouteUID eq '${data.routeUID}'`);


const select_Bus_RealTimeByFrequency = 'PlateNumb, Direction, BusPosition, DutyStatus';
export const get_Bus_RealTimeByFrequency = (data) => PTX_Bus_V2.get(`/RealTimeByFrequency/City/${data.city}?$format=JSON&$select=${select_Bus_RealTimeByFrequency}&$filter=RouteUID eq '${data.routeUID}' AND DutyStatus eq 0`);


const select_Bus_RealTimeNearStop = 'Direction, StopName, PlateNumb, DutyStatus, StopUID';
export const get_Bus_RealTimeNearStop = (data) => PTX_Bus_V2.get(`/RealTimeNearStop/City/${data.city}?$format=JSON&$select=${select_Bus_RealTimeNearStop}&$filter=RouteUID eq '${data.routeUID}'  AND Direction eq ${data.direction} AND DutyStatus eq 0`);


const select_BusStop = 'StopUID, StationID, StopName, StopPosition';
export const get_BusStop = (data) => PTX_Bus_V2.get(`/Stop/City/${data.city}/?$format=JSON&$select=${select_BusStop}`);

const select_BusStation = 'Stops, StationID';
export const get_BusStation = (data) => PTX_Bus_V2.get(`/Station/City/${data.city}/?$format=JSON&$select=${select_BusStation}`);

export const get_NearByBusStop = (data) => PTX_Bus_V2.get(`/Stop/City/${data.city}/?$spatialFilter=nearby(${data.lat}, ${data.lng}, ${data.distance})&$format=JSON`);
