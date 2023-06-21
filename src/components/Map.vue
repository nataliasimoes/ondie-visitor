<script setup>
import { ref } from "vue";
import { onMounted, onBeforeUnmount } from "@vue/runtime-core";

const mapElement = ref(null);
var map = ref(null);
var marker = ref(null);
var watcherId = ref(null);

// opções do geolocalization
const options = {
  enableHighAccuracy: true,
  // tempo máximo que a aplicação aceita para uma posição no cache
  maximumAge: 10000,
  // tempo no qual uma posição expira
  timeout: 5000,
};

onMounted(() => {
  map.value = L.map(mapElement.value).setView([-6.264359, -36.516165], 19);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 23,
    maxNativeZoom: 19, // caso não tenha o zoom, ele pega o atual e amplia,
  }).addTo(map.value);

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
