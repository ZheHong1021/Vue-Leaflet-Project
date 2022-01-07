// train.js
import axios from 'axios'
import {useAuthHeader} from '../utilities/useAuthHeader'

let PTX_Train_Station_V2 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA',
    headers: useAuthHeader()
});

// 票價抓Version3的
let PTX_Train_Station_V3 = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v3/Rail/TRA',
    headers: useAuthHeader()
});


setInterval(() => {
    PTX_Train_Station_V2 = axios.create({
        baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA',
        headers: useAuthHeader()
    });
    PTX_Train_Station_V3 = axios.create({
        baseURL: 'https://ptx.transportdata.tw/MOTC/v3/Rail/TRA',
        headers: useAuthHeader()
    });
}, 4 * 60 * 1000 );


// const select_Train_Station = "StationUID,StationName,StationPosition,LocationCity,StationPhone"
export const get_Train_Station = () => PTX_Train_Station_V2.get(`/Station`);
// export const get_Train_Station = () => PTX_Train_Station_V2.get(`/Station?$select=${select_Train_Station}`);
export const get_Train_Odfare = (data) => PTX_Train_Station_V3.get(`/ODFare/${data.OriginStationID}/to/${data.DestinationStationID }?$format=JSON`)
export const get_Train_TimeTable = (data) => PTX_Train_Station_V2.get(`/DailyTimetable/OD/${data.OriginStationID}/to/${data.DestinationStationID}/${data.choose_Date}?$format=JSON`)

export const get_NearByTrain_Station = (data) => PTX_Train_Station_V2.get(`/Station?$spatialFilter=nearby(${data.lat}, ${data.lng}, ${data.distance})&$format=JSON`);