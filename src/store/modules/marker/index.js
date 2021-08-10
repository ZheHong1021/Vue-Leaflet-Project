import L from 'leaflet'
import 'leaflet.markercluster';

export default {
    namespaced: true,
    state:{
      clusterMarker:  L.markerClusterGroup(),

      greenIcon: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }),

      bus_Route_Marker: L.layerGroup(),
      polyLine_Bus: new L.layerGroup(),
    },






  }