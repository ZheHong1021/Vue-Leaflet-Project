// THSR.js
import axios from 'axios'
import {useAuthHeader} from '../utilities/useAuthHeader'

let PTX_THSR_Station_V2 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR',
    headers: useAuthHeader(),
});

setInterval(() => {
PTX_THSR_Station_V2 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR',
    headers: useAuthHeader(),
});
}, 4 * 60 * 1000 );



// const select_THSR_Station = "StationUID,StationName,StationPosition"
export const get_THSR_Station = () => PTX_THSR_Station_V2.get(`/Station`)
// export const get_THSR_Station = () => PTX_THSR_Station_V2.get(`/Station?$select=${select_THSR_Station}`)
export const get_THSR_Odfare = (data) => PTX_THSR_Station_V2.get(`/ODFare/${data.OriginStationID}/to/${data.DestinationStationID }?$format=JSON`)
export const get_THSR_TimeTable = (data) => PTX_THSR_Station_V2.get(`/DailyTimetable/OD/${data.OriginStationID}/to/${data.DestinationStationID}/${data.choose_Date}?$format=JSON`)

export const get_NearByTHSR_Station = (data) => PTX_THSR_Station_V2.get(`/Station?$spatialFilter=nearby(${data.lat}, ${data.lng}, ${data.distance})&$format=JSON`);