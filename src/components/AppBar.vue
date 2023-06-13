<template>
  <div class="main">
    <v-bottom-navigation
      grow
      absolute
      bg-color="#389c37"
      color="#000000"
      class="bottom-navigation"
    >
      <v-btn value="recent" to="/schedule-activity/3">
        <v-icon>mdi-map</v-icon>
        Atividades
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<style scoped>
.v-icon {
  color: white;
}

.v-btn {
  color: white;
}
.text-white {
  color: white;
}

.v-bottom-navigation {
  position: absolute;
}
</style>
