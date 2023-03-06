<script lang="ts">
import { PropType } from "vue";
import { DistrictCollection } from "../feature-store/hotelState";
import { useHotelState } from "../feature-store/hotelState";

export default {
  setup() {
    return {
      hotelState: useHotelState().getHotelState,
    };
  },
  props: {
    districtProps: Object as PropType<DistrictCollection[]>,
    images: Array as PropType<string[]>,
  },

  methods: {
    onSelectDistrict(district: DistrictCollection) {
      const hotelSearchFilter = this.hotelState.filter((h) => {
        if (h.address.district === district.district) return h;
      });

      if (hotelSearchFilter.length > 0) {
        console.log(hotelSearchFilter);
        const { nearestHotels, distances } = useHotelState().getNearestHotel(
          {
            lat: district.lat,
            lng: district.lng,
          },
          40,
          100,
          hotelSearchFilter
        );
        useHotelState().setSearchMode(true);
        useHotelState().setLastSearchedHotelState(nearestHotels, distances);
        setTimeout(() => this.$router.push("/hotel-list"), 1000);
      }
    },
  },
};
</script>
<template>
  <article
    class="prose prose-blockquote:text-2xl prose-blockquote:text-primary-focus"
  >
    <blockquote class="w-8/12 lg:w-10/12 mx-auto">
      แหล่งท่องเที่ยวยอดนิยมในเชียงใหม่
    </blockquote>
  </article>
  <v-sheet class="mx-auto" max-width="800">
    <v-slide-group class="pa-4" selected-class="bg-success" show-arrows>
      <v-slide-group-item
        v-for="(d, i) in districtProps"
        v-slot="{ isSelected, selectedClass }"
      >
        <div class="flex flex-col justify-center">
          <v-avatar
            class="hover:shadow-xl duration- transition cursor-pointer"
            @click="() => onSelectDistrict(d)"
            :image="images![i]"
            color="grey-lighten-1"
            :class="['ma-4', selectedClass]"
            height="200"
            width="100"
            size="100"
          >
            <div class="d-flex fill-height align-center justify-center">
              <v-scale-transition>
                <v-icon
                  v-if="isSelected"
                  color="white"
                  size="48"
                  icon="mdi-close-circle-outline"
                ></v-icon>
              </v-scale-transition>
            </div>
          </v-avatar>
          <p class="text-center">{{ d.district }}</p>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
<style lang=""></style>
