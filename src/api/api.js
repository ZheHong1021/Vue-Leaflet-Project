import axios from 'axios';
import useAuthHeader from '@/utilities/useAuthHeader'   // AuthKey


const PTX_Train_Station = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station',
    headers: useAuthHeader()
});
const PTX_Thsr_Station = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station',
    headers: useAuthHeader()
});

const PTX_Train_ODfare = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v3/Rail/TRA/ODFare',
    headers: useAuthHeader()
})

const PTX_Thsr_ODfare = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/ODFare',
    headers: useAuthHeader()
})

const PTX_Train_TimeTable = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/DailyTimetable/OD',
    headers: useAuthHeader()
})

const PTX_Thsr_TimeTable = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/OD',
    headers: useAuthHeader()
})


// 得到台鐵的站點資訊(使用到的位置: /components/TrainStation)
export const get_Train_Station = () => PTX_Train_Station.get(`/`);

// 得到高鐵的站點資訊(使用到的位置: /components/ThsrStation)
export const get_Thsr_Station = () => PTX_Thsr_Station.get(`/`);

// 得到台鐵的票價資訊(使用到的位置: /views/TRA)
export const get_Train_Odfare = (data) => PTX_Train_ODfare.get(`/${data.OriginStationID}/to/${data.DestinationStationID }?$format=JSON`);

// 得到高鐵的票價資訊(使用到的位置: /views/THSR)
export const get_Thsr_Odfare = (data) => PTX_Thsr_ODfare.get(`/${data.OriginStationID}/to/${data.DestinationStationID }?$format=JSON`);

// 得到台鐵的時刻表(使用到的位置: /views/TRA)
export const get_Train_TimeTable = (data) => PTX_Train_TimeTable.get(`/${data.OriginStationID}/to/${data.DestinationStationID}/${data.choose_Date}?$format=JSON`);

// 得到高鐵的時刻表(使用到的位置: /views/THSR)
export const get_Thsr_TimeTable = (data) => PTX_Thsr_TimeTable.get(`/${data.OriginStationID}/to/${data.DestinationStationID}/${data.choose_Date}?$format=JSON`);