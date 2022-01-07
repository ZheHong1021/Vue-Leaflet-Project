<template>
	<loading v-model:active="isLoading"
      :is-full-page="true"
      loader= "dots"
      />

    <section id="Total_City" v-if="!is_Single_City">
          <div class="city_container"  v-for="(city, index) in master_citys" :key="index" @click="goToSingleMasterCity(index)">
            <img :src="city.img" :alt="city.name">
            <div class="txt">
              <h2 class="text-lg">{{city.name}}</h2>
            </div>
          </div>

          <div class="city_container" @click="goToSingleOtherCity(0)">
            <img src="@/assets/travel_city/Other.jpg" alt="其他縣市">
            <div class="txt">
              <h2 class="text-lg">其他縣市</h2>
            </div>
          </div>

    </section>


    <section id="Single_City" class="flex flex-col items-center p-4" v-if="is_Single_City && isLoading === false">
		<h1 class="text-2xl font-bold">{{choose_City}}</h1>
        <button class="px-4 py-2 my-4 text-lg bg-blue-500 hover:bg-blue-700 transition duration-300 text-white rounded" @click="goToTotalCity">回上一頁</button>
		
		<div v-if="is_Master_City === false" id="other_city" class="flex flex-wrap my-2">
			<span class="cursor-pointer text-white rounded text-base px-2 py-1 m-1" 
				:class="choose_City === city.name ? 'bg-red-500' : 'bg-gray-500'"
				v-for="(city, index) in other_citys" :key="index"
				@click="goToSingleOtherCity(index)">
				{{city.name}}
			</span>
		</div>

		<div v-if="travel_Length() > 0">
			<input type="text" v-model="filter_Input" class="text-lg rounded-md border-2 border-black  px-3 py-1 w-full outline-none" placeholder="查詢景點 / 縣市區域">
			<span v-if="filter_Result.length === 0" class="text-base font-bold mb-4">
				目前找不到您所搜尋的結果，請重新搜尋。
			</span>
			<div v-if="filter_Result.length > 0">
				<div class="my-4 p-4 mx-1 bg-yellow-200 rounded" v-for="(_, index) in pageRow_Route()" :key="index">
					<h1 class="font-bold text-xl">{{filter_Result[currentTotalPage + index].Name}}</h1>
					<div class="my-2">
						<span class="text-base font-light rounded bg-green-600 text-white px-3 py-1 mr-1" v-if="filter_Result[currentTotalPage + index].Class1">{{filter_Result[currentTotalPage + index].Class1}}</span>
						<span class="text-base font-light rounded bg-green-600 text-white px-3 py-1 mr-1" v-if="filter_Result[currentTotalPage + index].Class2">{{filter_Result[currentTotalPage + index].Class2}}</span>
						<span class="text-base font-light rounded bg-green-600 text-white px-3 py-1 mr-1" v-if="filter_Result[currentTotalPage + index].Class3">{{filter_Result[currentTotalPage + index].Class3}}</span>
					</div>
					<p class="text-lg"><i class="fas fa-map-marker-alt mr-1 text-red-500"></i>{{filter_Result[currentTotalPage + index].Address}}</p>
					<p class="text-lg"><i class="fas fa-phone-square-alt mr-1 text-green-600"></i> {{filter_Result[currentTotalPage + index].Phone}}</p>
					<p class="text-lg my-4">
						<span class="rounded-md p-1 font-bold"><i class="far fa-clock mr-1 text-yellow-600"></i>開放時間</span>
						<br>
						{{filter_Result[currentTotalPage + index].OpenTime ? filter_Result[currentTotalPage + index].OpenTime : '無提供' }}
					</p>
					<p class="text-lg my-2">
						<span class="rounded-md p-1 font-bold"><i class="fas fa-car-side mr-1 text-blue-500"></i>交通資訊</span>
						<br>
						<label v-html="filter_Result[currentTotalPage + index].TravelInfo ? filter_Result[currentTotalPage + index].TravelInfo : '無提供'"></label>
					</p>
					<button class="bg-red-500 text-base text-white rounded-lg px-3 py-2 hover:bg-red-700 transition duration-300"
						@click="goTo_Position(currentTotalPage + index)">
						<i class="fas fa-location-arrow"></i>
						前往該位置
					</button>
				</div>

				<Paginator :pageLinkSize="4" :rows="10" :totalRecords="filter_Result.length" :rowsPerPageOptions="[10,20,30]" @page="onPage($event)"
					template="PrevPageLink PageLinks  NextPageLink RowsPerPageDropdown">
					<template #right="slotProps">
						<h1 class="mt-3">
						單頁顯示數量: {{slotProps.state.rows}}，總路線數量: {{ filter_Result.length }}
						</h1>
					</template>
				</Paginator>
			</div>



		</div>

		
	</section>
  

</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { API_Travel_ScenicSpot } from "../api/api.js"; 
import {useStore} from 'vuex';
import L from 'leaflet';
import Paginator from 'primevue/paginator';
import Loading from 'vue-loading-overlay';
import { computed } from '@vue/runtime-core';
export default {
    name: 'Travel',
	components: {
		Paginator: Paginator,
		Loading: Loading,
	},
    setup(){
		const store = useStore();
		const map = store.state.module_Map.map;
        const master_citys = reactive([
			{name:'臺北市', en:'Taipei', img: require('@/assets/travel_city/Taipei.jpg')}, 
			{name:'新北市', en:'NewTaipei',img: require('@/assets/travel_city/NewTaipei.jpg')}, 
			{name:'桃園市', en:'Taoyuan', img: require('@/assets/travel_city/Taoyuan.jpg')},
			{name:'臺中市', en:'Taichung',img: require('@/assets/travel_city/Taichung.jpg')},
			{name:'臺南市', en:'Tainan', img: require('@/assets/travel_city/Tainan.jpg')}, 
			{name:'高雄市', en:'Kaohsiung',img: require('@/assets/travel_city/Kaohsiung.jpg')}, 
        ])

		const other_citys = reactive([
			{name:'基隆市', en:'Keelung'},{name:'新竹市', en:'Hsinchu'},{name:'新竹縣', en:'HsinchuCounty'},
			{name:'苗栗縣', en:'MiaoliCounty'},{name:'彰化縣', en:'ChanghuaCounty'},{name:'南投縣', en:'NantouCounty'},
			{name:'雲林縣', en:'YunlinCounty'}, {name:'嘉義縣', en:'ChiayiCounty'},{name:'嘉義市', en:'Chiayi'}, 
			{name:'屏東縣', en:'PingtungCounty'}, {name:'宜蘭縣', en:'YilanCounty'}, {name:'花蓮縣', en:'HualienCounty'}, 
			{name:'臺東縣', en:'TaitungCounty'}, {name:'金門縣', en:'KinmenCounty'}, {name:'澎湖縣', en:'PenghuCounty'}, 
			{name:'連江縣', en:'LienchiangCounty'},
		])

        const PTX_Travel_Arr = ref([]);
        const choose_City = ref('');
        const is_Single_City = ref(false);
		const is_Master_City = ref(false);
		const filter_Input = ref('');

		// Loading Config
		const isLoading = ref(false);

		// Page Config
		const currentPage = ref( 0 ); // 第幾頁
		const pageRow = ref( 10 );		// 單頁數量
		const currentTotalPage = ref(0);  // 目前總頁數

        const goToSingleMasterCity = (index)=>{
			isLoading.value = true;
			setTimeout(()=>{
				isLoading.value = false;
			}, 1500);
            is_Single_City.value = true;
            is_Master_City.value = true;
			choose_City.value = master_citys[index].name;
            API_Travel_ScenicSpot(master_citys[index].en)
              .then( 
                  (res)=>{
                    PTX_Travel_Arr.value = res.data ;
                  }
              )
        }

        const goToSingleOtherCity = (index)=>{
            is_Single_City.value = true;
            is_Master_City.value = false;

			choose_City.value = choose_City.value === "" ? "基隆市" : other_citys[index].name;

            API_Travel_ScenicSpot(other_citys[index].en)
              .then( 
                  (res)=>{
                    PTX_Travel_Arr.value = res.data ;
                  }
              )
        }

        const goToTotalCity = ()=>{
          is_Single_City.value = false;
          PTX_Travel_Arr.value = [];
			choose_City.value = "";
        }

			// The Length of Travel Array
		const travel_Length = ()=> PTX_Travel_Arr.value.length;

		// Page Event
        const onPage = (event)=>{
            currentPage.value = event.page;
            pageRow.value = event.rows;
			currentTotalPage.value = currentPage.value * pageRow.value;
        }

		const filter_Result = computed(()=>PTX_Travel_Arr.value.filter( (view)=> view.Name.includes(filter_Input.value)));
		const filter_Result_Length = computed(()=> PTX_Travel_Arr.value.filter((view)=> view.Name.includes(filter_Input.value)).length );
		// PageRow設定: 到最後一頁則顯示 總路線數量 - ( 第幾頁n * 單頁數量m )，其他都以單頁數量顯示
		const pageRow_Route = ()=> filter_Result_Length.value - currentTotalPage.value > pageRow.value ? pageRow.value: filter_Result_Length.value - currentTotalPage.value;
		


		let fly_Marker;
		const goTo_Position = (index)=>{
			const lat = filter_Result.value[index].Position.PositionLat;
			const lng = filter_Result.value[index].Position.PositionLon;
			if (fly_Marker) map.removeLayer(fly_Marker);
			let content = `
				<h1 class="text-xl font-bold">${filter_Result.value[index].Name}</h1>
				<p class="text-base">${filter_Result.value[index].DescriptionDetail}</p>
			`;
			fly_Marker = L.marker([lat, lng], {
				icon: store.state.module_Marker.redIcon
			}).bindPopup(content).openPopup().addTo(map);
			map.flyTo([lat, lng], 16, {
				duration: 3 // 移動動畫時間
			});
			// 設立延遲，3000毫秒(3秒)，搭配上述的移動動畫，要在動畫結束之後才能顯性 popup內容
			setTimeout(function () {
				L.popup({
					closeButton: false, // 把 popup畫面框中右上角的 X 去除
					offset: L.point(0, -35) // 讓 popup 畫面框不要擋住 icon
				}).setLatLng([lat, lng]) // 設定飛往座標
				.setContent(content) // 設定內容，運用上面有寫到的函式
				.openOn(map) // 自動打開
			}, 3000);
		}

	

        return {master_citys, other_citys, PTX_Travel_Arr, choose_City, is_Single_City, is_Master_City, currentPage, pageRow, currentTotalPage, filter_Input, filter_Result_Length, isLoading,
		goToSingleMasterCity, goToSingleOtherCity, goToTotalCity, goTo_Position, onPage, pageRow_Route, travel_Length, filter_Result}
    }

}
</script>

<style>
  
/* 旅遊 */
/* Travel_City */
div.city_container {
	margin: 10px 0;
	display: flex;
	justify-content: center;
	width: 100%;
	/* 訂在 item身上 */
	position: relative;
	cursor: pointer;
}

div.city_container:nth-child(1) {
	margin: 0;
}

div.city_container img {
	width: 100%;
	height: auto;
	cursor: pointer;

	/* div下面會多一個空白，用這個處理掉 */
	/* vertical-align: middle; */
}


.city_container .txt {
	/* 用絕對定位在 .item身上 */
	position: absolute;

	/* 與圖片對齊 */
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;

	padding: 20px;

	/* 背景色透明 */
	background-color: rgba(0, 0, 0, .6);

	/* Flex */
	display: flex;
	justify-content: center;
	flex-direction: column;

	/* 動畫 */
	opacity: 0;
	transition: opacity .5s;
}

.city_container:hover .txt {
	opacity: 1;
}


.city_container h2 {
	font-size: 28px;
	color: #ff0;
	font-weight: 500;
}

/* 跑出一條線 */
.city_container h2:after {
	content: "";
	display: block;

	/* 摸到從0%到100% */
	width: 0%;
	/* 線的高度 */
	height: 2px;
	margin: 10px 0;
	background-color: #ff0;
	transition: width .5s .2s;
}

/* 被摸到時出現 */
.city_container:hover h2:after {
	width: 100%;
}

</style>