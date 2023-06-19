<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

// para o componente ser usado corretamente ele deve estar dentro de um elemento pai com a posição definida como realtiva
// Para ser usado em uma tela de mapa não é necessário o elemento pai, porém adicione a classe css margin
function goBack() {
    router.back();
}
</script>

<template>
    <button id="GoBack" @click="goBack">
      <span class="mdi mdi-chevron-left mdi-24px"></span>
    </button>
  </template>

<style scoped>
#GoBack {
    top: 0px;
    right: 0px;
    position: absolute;
    background-color: #389c37;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    z-index: 1000;
}
#GoBack > span {
    color: white;
}
.margin {
    top: 15px !important;
    right: 15px !important;
}
</style>
