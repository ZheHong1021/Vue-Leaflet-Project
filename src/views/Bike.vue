<template>
  <h1>Bike</h1>
  <button class="bg-green-300 rounded py-2 px-4" @click="test">Click</button>
</template>

<script>
// import axios from 'axios'
// import myData from '@/assets/test.kml';
import {useStore} from 'vuex'
export default {
    setup(){
        const store = useStore();
        const test = ()=>{
          console.log(store);
        }
       

        return { test }
    }
}
</script>

<style>

</style>