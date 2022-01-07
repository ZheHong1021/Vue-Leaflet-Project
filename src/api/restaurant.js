import axios from 'axios';
import {useAuthHeader} from '../utilities/useAuthHeader'   // AuthKey


// 得到美食資訊(使用到的位置: /views/Food)
let PTX_Restaurant = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant',
    headers: useAuthHeader(),
});

setInterval(() => {
    PTX_Restaurant = axios.create({
    baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant',
    headers: useAuthHeader(),
});
}, 4 * 60 * 1000 );


const select_Restaurant = 'Name, Description, Phone, Address, OpenTime, Position, Class';
export const get_Restaurant = (city) => PTX_Restaurant.get(`/${city}?$format=JSON&$select=${select_Restaurant}`);



