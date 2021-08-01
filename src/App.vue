<template>

  <!-- <AppHeader /> -->
  <Map />
  <SideBar />
  <TrainStation />
  <ThsrStation />
  <LayerControl />
  

</template>


<script>

import Map from '@/components/Map'
// import AppHeader from '@/components/AppHeader'
import TrainStation from '@/components/TrainStation'
import ThsrStation from '@/components/ThsrStation'
import LayerControl from '@/components/LayerControl'
import SideBar from '@/components/SideBar'
export default {
  components: {
    Map: Map,
    // AppHeader: AppHeader,
    TrainStation: TrainStation,
    ThsrStation: ThsrStation,
    LayerControl: LayerControl,
    SideBar: SideBar
  },
  
 
}
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
