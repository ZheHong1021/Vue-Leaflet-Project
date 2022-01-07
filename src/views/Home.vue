<template>
  {{ a }}
  <h1>Home</h1>
  <input type="text" class="outline-none border-2" v-model="search_Val" name="" id="">
  <div v-for="(item, index) in a" :key="index">
      {{ item.name }} : {{ item.city }}
  </div>

  <br>
  <br>

  <hr>

  {{ testHAHA() }}
  <div v-for="(item, index) in testHAHA()" :key="index">
      {{ item.name }} : {{ item.city }}
  </div>
</template>

<script>
import {  reactive, ref,  } from '@vue/runtime-core'

export default {
    setup(){

      const search_Val = ref('');
      const a = reactive([
        {name: 'haha', city: 'Tainan'},
        {name: 'haha5', city: 'NewTaipei'},
        {name: 'haha3', city: 'Taipei'},
        {name: 'haha2', city: 'Kaohsiung'},
      ])

      const testHAHA = ()=> a.filter(item=> item.name.includes(search_Val.value) || item.city.includes(search_Val.value) );

    
      return {search_Val, a, testHAHA}

  
    }
}
</script>

<style>

</style>