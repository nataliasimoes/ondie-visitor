<script setup lang="ts">
import AppBar from "../components/AppBar.vue";
</script>

<template>
  <v-app>
    <v-layout>
      <v-main>
        <slot />
      </v-main>
      <AppBar />
    </v-layout>
  </v-app>
</template>
