<template>

  <Map />
  <SideBar />
  <!-- <TrainStation /> -->
  <!-- <ThsrStation /> -->
  <LayerControl />
  
</template>


<script>

import Map from '@/components/Map'
// import TrainStation from '@/components/TrainStation'
// import ThsrStation from '@/components/ThsrStation'
import LayerControl from '@/components/LayerControl'
import SideBar from '@/components/SideBar'
export default {
  components: {
    Map: Map,
    // TrainStation: TrainStation,
    // ThsrStation: ThsrStation,
    LayerControl: LayerControl,
    SideBar: SideBar
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans TC', sans-serif;
  transition: .2s linear;
}
</style>
