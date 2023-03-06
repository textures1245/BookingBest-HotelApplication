<script lang="ts">
// @ts-nocheck
import { useAuthState } from "../auth/authState";
import { PropType, onMounted } from "vue";

export default {
  setup() {
    var map = new longdo.Map({
      placeholder: document.getElementById("map"),
    });
    function init(
      zoomNum: number,
      geo?: { lat: number; lng: number } | undefined
    ) {
      map = new longdo.Map({
        placeholder: document.getElementById("map"),
      });
      map.zoom(zoomNum, true);
      var TagPanel2 = new longdo.TagPanel({ tag: ["mountain"] });
      map.Ui.add(TagPanel2);

      if (geo !== undefined) {
        map.Overlays.add(new longdo.Marker({ lon: geo.lng, lat: geo.lat }));
        map.location({ lon: geo.lng, lat: geo.lat }, true);
      } else {
        map.location(longdo.LocationMode.Geolocation);
      }

    }
    return { map, init };
  },
  props: {
    action: {
      type: String as PropType<"currentGeo" | "customGeo">,
      required: true,
    },
    userGeo: Object as PropType<{ lat: number; lng: number }>,
    hSizeClass: {
      type: String,
    },
  },
  mounted() {
    if (this.action === "currentGeo") {
      this.init(5);
    } else {
      this.init(16, { lat: this.userGeo!.lat, lng: this.userGeo!.lng });
    }
  },
};
</script>
<template>
  <div :class="[hSizeClass || 'h-[40vh]', 'w-auto']" id="map"></div>
</template>
<style scoped></style>
