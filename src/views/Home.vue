<template>
  <h1>Home</h1>
</template>

<script>
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { useRoute } from 'vue-router'

export default {
    setup(){
      const route = useRoute();

      onMounted(()=>{
        console.log(route.path);
        
      })
      onUnmounted(()=>{
      })
    }
}
</script>

<style>

</style>