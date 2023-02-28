<script lang="ts">
import Appbar from "./layouts/Appbar.vue";
export default {
  components: { Appbar },
};
</script>

<template>
  <v-app class="overflow-y-auto thai-font eng-font">
    <v-layout>
      <Appbar></Appbar>
      <v-main class="h-full w-full bg-base-100 thai-font eng-font">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
