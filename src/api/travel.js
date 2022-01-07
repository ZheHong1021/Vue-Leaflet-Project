import axios from 'axios';
import {useAuthHeader} from '../utilities/useAuthHeader'   // AuthKey


let PTX_Travel_ScenicSpot = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot',
    headers: useAuthHeader(),
});

setInterval(() => {
    PTX_Travel_ScenicSpot = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot',
    headers: useAuthHeader(),
});
}, 4 * 60 * 1000 );

const select_Travel_ScenicSpot = 'Name, DescriptionDetail, Phone, Address, OpenTime, Position, Class1, Class2, Class3, Remarks, TravelInfo';
export const get_Travel_ScenicSpot = (city) => PTX_Travel_ScenicSpot.get(`/${city}?$format=JSON&$select=${select_Travel_ScenicSpot}`);

