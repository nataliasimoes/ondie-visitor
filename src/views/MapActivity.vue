<script setup>
import { ref, computed } from "vue";
import { onMounted, onBeforeUnmount } from "@vue/runtime-core";
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useRouter } from "vue-router";
import { usePolygonStore } from "../stores/polygonStore";
import { storeToRefs } from "pinia";
import GoBack from "../components/GoBackButton.vue";
import { centerOfMass } from '@turf/turf';

/* Current router */
const router = useRouter();
const poligonoId = parseInt(router.currentRoute.value.params.poligonoid);

// opções do geolocalization
const options = {
  enableHighAccuracy: true,
  // tempo máximo que a aplicação aceita para uma posição no cache
  maximumAge: 10000,
  // tempo no qual uma posição expira
  timeout: 5000,
};

/* polygon store */
const polygonStore = usePolygonStore();

/* map config */
const mapElement = ref(null);
var map = ref(null);
var marker = ref(null);
var drawnItems = ref(null);
var watcherId = ref(null);

/* dialog */
let dialog = ref(false);
function toggleDialog() {
  dialog.value = true;
}

onMounted(async () => {
  map.value = L.map(mapElement.value).setView([-6.264359, -36.516165], 19);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    maxZoom: 23,
    maxNativeZoom: 19,
  }).addTo(map.value);

  drawnItems = new L.FeatureGroup();

  map.value.addLayer(drawnItems);

  /* adiciona no mapa os polígonos já cadastrados */
  const poligono = await polygonStore.getOnePolygon(poligonoId);

  let polygonCoords = poligono[0].locais;

  var polygonLayer = L.polygon(polygonCoords, {
    id: `${poligono.id}`,
  }).addTo(map.value);

  //aqui fazemos o mapeamento do nosso poligono para um poligno utilizado pelo GEOJSON
  const polygonGeoJSON = {
    type: "Polygon",
    coordinates: [polygonCoords.map(coord => [coord.lng, coord.lat])]
  };
  // com isso definimos um ponto como centro do poligono através do centerOfMass da biblioteca turf
  var center = centerOfMass(polygonGeoJSON);

  map.value.fitBounds(polygonLayer.getBounds(), {maxZoom: 20});

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

        // point1 é a localização atual do usuário
        let point1 = L.latLng(lat, lon);
        // point1 é o centro do poligono que já definimos
        // devemos inverter a ordem das coordenadas para que funcione aqui
        let point2 = L.latLng(center.geometry.coordinates[1], center.geometry.coordinates[0]);

        // aqui o leaflet calcula a distáncia entre os 2 pontos
        const distance = point1.distanceTo(point2);
        console.log(distance); // Distância em metros
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
  <GoBack class="margin"/>
  <div class="main">
    <div id="map" ref="mapElement">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              @click="getLocation()"
              :elevation="20"
              icon="mdi-target-account"
              color="primary"
              class="elevated btn btn-location"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

#map {
  height: 92vh;
  width: 100vw;
}

.elevated {
  position: absolute;
  z-index: 1000;
}

.btn-location {
  top: 86%;
  left: 70%;
  background-color: #389c37 !important;
  color: #fff !important;
}

.leaflet-popup-content > * {
  display: block !important;
}

.v-icon {
  color: white !important;
}

.v-btn {
  color: white !important;
}
.text-white {
  color: white !important;
}

.v-bottom-navigation {
  position: absolute;
}

@media screen and (max-width: 600px) {
  .btn-location {
    top: 86%;
    left: 80%;
  }
}
</style>
