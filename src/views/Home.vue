<template>
  <h1>Home</h1>
</template>

<script>
import 'leaflet-sidebar-v2'
import { onMounted, onUnmounted } from '@vue/runtime-core'
// import { useStore } from 'vuex' // Composition API
import { useRoute } from 'vue-router'

export default {
    setup(){
      // const store = useStore();
      const route = useRoute();

      onMounted(()=>{
        // console.log('Home mounted');
        console.log(route.path);
        
      })
      onUnmounted(()=>{
        // console.log('Home Unmounted');
      })
    }
}
</script>

<style>

</style>