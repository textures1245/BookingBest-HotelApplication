<script lang="ts">
export default {
  props: {
    hSizeClass: {
      type: String,
    },
  },
};
</script>
<script setup lang="ts">
import { onMounted } from "vue";

const map = new longdo.Map({
  placeholder: document.getElementById("map"),
  zoom: 15,
  lastView: false,
  language: "en",
});

function init() {
  var map = new longdo.Map({
    placeholder: document.getElementById("map"),
  });
}
onMounted(() => {
  init();
});

map.Overlays.add(new longdo.Marker({ lon: 100.532072, lat: 13.729002 }));
</script>
<template>
  <div :class="[hSizeClass || 'h-[20vh]', 'w-auto']" id="map"></div>
</template>
<style scoped></style>
