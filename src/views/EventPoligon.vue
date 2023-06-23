<script setup>
import { ref, computed } from "vue";
import { onMounted, onBeforeUnmount } from "@vue/runtime-core";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { storeToRefs } from "pinia";
import { usePolygonStore } from "../stores/polygonStore";
import { useActivityStore } from "../stores/atividadeStore";

// esse arquivo é para uso futuro caso seja necessário um tela para exibir todos os poligonos

/* polygon store */
const polygonStore = usePolygonStore();

/* getActivitys */
const activityStore = useActivityStore();
async function getActivitys(idPoligono) {
  await activityStore.getActivitys(idPoligono);
}
const { activitys, loading } = storeToRefs(activityStore);

const mapElement = ref(null);
var map = ref(null);
var marker = ref(null);
var watcherId = ref(null);
var drawnItems = ref(null);

/* dialog */
let dialog = ref(false);
function toggleDialog() {
  dialog.value = true;
}
let currentPolygonId = ref(null);

// opções do geolocalization
const options = {
  enableHighAccuracy: true,
  // tempo máximo que a aplicação aceita para uma posição no cache
  maximumAge: 10000,
  // tempo no qual uma posição expira
  timeout: 5000,
};

onMounted(async () => {
  map.value = L.map(mapElement.value).setView([-6.264359, -36.516165], 19);
    /* 
    # openstretMapsHot
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      maxZoom: 23,
      maxNativeZoom: 19, // caso não tenha o zoom, ele pega o atual e amplia,
    }).addTo(map.value);
    # GoogleMaps
    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map.value);
    # GoogleMaps Satélite
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map.value);
    # GoogleMaps Híbrido
    googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(map.value);
  */
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 23,
    maxNativeZoom: 19, // caso não tenha o zoom, ele pega o atual e amplia,
  }).addTo(map.value);

  drawnItems = new L.FeatureGroup();
  map.value.addLayer(drawnItems);

  /* adiciona no mapa os polígonos já cadastrados */
  await polygonStore.getPolygons('1');

  const { polygons } = storeToRefs(polygonStore);

  polygons.value.forEach((polygon) => {
    let polygonCoords = polygon.locais;
    var polygonLayer = L.polygon(polygonCoords, {
      id: `${polygon.id}`,
    }).addTo(map.value).bindPopup(`${polygon.id}`);

    drawnItems.addLayer(polygonLayer);
  });

  // esse é a função da api geolocation que pega a posição do dispositivo e assiste a mudança
  watcherId = navigator.geolocation.watchPosition(success, error, options);

  // função chamada quando o watchPosition funciona
  function success(position) {
    // variáveis adquiridas pelo watchPosition
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    // verificação se o marcador já existe no mapa
    if (marker.value){
        //caso ele exista, removemos eles, para assim adicionar na posição atualizada
        map.value.removeLayer(marker.value);
    }

    // marcador da posição do dispositivo
    marker.value = L.marker([lat, lon])
        .addTo(map.value)
        .bindPopup("aqui está você!!!");
  }

  // função chamada quando o watchPosition não funciona
  function error(err) {
    if(err.code === 1){
        alert("por favor, permita acessar sua localização")
    } else {
        alert("não foi possível achar sua localização")
    }
  }
});

onBeforeUnmount(() => {
  navigator.geolocation.clearWatch(watcherId);
});

function getLocation() {
  map.value.setView(marker.value.getLatLng());
}
</script>

<template>
  <div id="map" ref="mapElement">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn
            @click="getLocation()"
            :elevation="20"
            icon="mdi-target-account"
            color="primary"
            class="elevated btn"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
#map {
  height: 92vh;
  width: 100vw;
}

.elevated {
  position: absolute;
  z-index: 1000;
}

.v-btn {
  top: 86%;
  left: 85%;
  background-color: #389c37 !important;
  color: #fff !important;
}

@media screen and (max-width: 600px) {
  .v-btn {
    top: 86%;
    left: 80%;
  }
}
</style>
