<template>
<div id="sidebar" class="leaflet-sidebar collapsed">

    <!-- Nav tabs -->
    <div class="leaflet-sidebar-tabs">
        <ul role="tablist">
            <li 
                class="route_link"
                v-for="(route, index) in route_List" 
                :key="index" >
                 <router-link :to='route.to' :href='route.href' role="tab">
                    <span v-html="route.icon"></span>
                </router-link>
            </li>
        </ul>
    </div>

    <!-- Tab panes -->
    <div class="leaflet-sidebar-content">
        <!-- Sidebar Header -->
        <div class="leaflet-sidebar-pane"  
        v-for="(route, index) in route_List" 
        :key="index" 
        :id="route.id">
          <h1 class="leaflet-sidebar-header font-bold">
              {{route.title}}
              <div class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></div>
          </h1>
        </div>

        <!-- Sidebar Content -->
        <router-view />
    </div>
</div>
</template>

<script>
import L from 'leaflet'
import 'leaflet-sidebar-v2'
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
export default {
    setup(){
        const store = useStore()
        const route_List = reactive([
            {href:'#home', id:'home',  title: '首頁', to: '/', icon: '<i class="fa text-black fa-bars"/>'},
            {href:'#travel', id:'travel',  title: '旅遊資訊', to: '/travel', icon: '<i class="text-black fas fa-suitcase-rolling"></i>'},
            {href:'#food', id:'food',  title: '美食資訊', to: '/food', icon: '<i class="text-black fas fa-utensils"></i>'},
            {href:'#tra', id:'tra', title: '台鐵資訊', to: '/tra', icon: '<i class="fa text-black fa-subway"/>'},
            {href:'#thsr', id:'thsr', title: '高鐵資訊', to: '/thsr', icon: '<img class ="m-auto w-1/2 h-1/2" src="https://image.flaticon.com/icons/png/512/1278/1278687.png"></img>'},
            {href:'#bus', id:'bus', title: '公車資訊', to: '/bus', icon: '<i class="fas fa-bus-alt"></i>'},
            {href:'#bike', id:'bike', title: '自行車資訊', to: '/bike', icon: '<i class="fas fa-biking"></i>'},
        ])

        onMounted(()=>{
            setTimeout(()=>{
                let sidebar = L.control.sidebar({
                    container: 'sidebar',
                }).addTo(store.state.module_Map.map);
                sidebar.open('home')
            }, 1000)
        })

        return { route_List }
    }

}
</script>


<style scoped>
@import 'https://cdn.jsdelivr.net/npm/leaflet-sidebar-v2@3.2.3/css/leaflet-sidebar.css';

/* 因為FontAweSome找不到高鐵 icon，透過 img外接圖片近來用來做排版 */
.route_link a{
    display: flex;
    align-items: center;
    justify-content: center;
}


</style>