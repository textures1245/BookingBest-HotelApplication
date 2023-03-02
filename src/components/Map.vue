<script lang="ts">
import { useAuthState } from "../auth/authState";
export default {
  props: {
    userGeo: Object as PropType<{ lat: number; lng: number }>,
    hSizeClass: {
      type: String,
    },
  },
};
</script>
<script setup lang="ts">
import { PropType, onMounted } from "vue";

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
  map.location(longdo.LocationMode.Geolocation);
  setTimeout(() => {
    const currUser = useAuthState().getCurrAcc;
    if (currUser) {
      let { lon, lat } = map.location();
      console.log(lon, lat);
      useAuthState().setCurrentGeoLocation(lon, lat);
    }
  }, 1000);
  console.log(map.location());
}
onMounted(() => {
  init();
});

map.Overlays.add(new longdo.Marker({ lon: 100.532072, lat: 13.729002 }));
</script>
<template>
  <div :class="[hSizeClass || 'h-[35vh]', 'w-auto']" id="map"></div>
</template>
<style scoped></style>
