<script lang="ts">
import { PropType } from "vue";
import { Hotel } from "../feature-store/hotelState";

export default {
  props: {
    border: {
      type: Boolean,
      default: false,
    },
    title: String,
    hotelProps: {
      type: Object as PropType<Hotel[]>,
      // required: true,
    },
    distance: Array as PropType<number[]>,
  },
  data: () => ({
    model: null,
    rating: 3.5,
  }),
  methods: {
    onVisitedHotel(hotelId: number) {
      this.$router
        .push(`/hotel-list`)
        .then(() => this.$router.push(`/hotel-list/${hotelId}`));
    },
  },
};
</script>
<template>
  <v-sheet
    :class="border ? 'bg-base-200 !rounded-t-[1px]' : ''"
    class="mx-auto py-6 h-full"
    :elevation="border ? 6 : 0"
  >
    <article
      class="prose prose-blockquote:text-2xl prose-blockquote:text-primary-focus"
    >
      <blockquote class="w-8/12 lg:w-10/12 mx-auto">
        {{ title || "รายการ" }}
      </blockquote>
    </article>
    <v-slide-group v-model="model" class="pa-4" start-active show-arrows>
      <v-slide-group-item
        v-for="(hotel, i) in hotelProps"
        :key="hotel.hotelId"
        v-slot="{ isSelected, toggle }"
      >
        <div
          @click="toggle"
          class="hover:shadow-xl duration-300 card card-compact w-64 h-96 lg:w-80 shadow-md mx-3 my-2"
        >
          <figure class="group card-hovering">
            <v-img class="!fade-out" cover :src="hotel.imgUrls[0]"> </v-img>
            <div class="absolute z-10 right-2 top-2">
              <v-chip
                prepend-icon="mdi-fire-circle"
                text="ยอดนิยม"
                class="!bg-secondary text-secondary-content"
                size="small"
              >
              </v-chip>
            </div>

            <div class="absolute invisible group-hover:visible tradition-200">
              <v-chip
                @click="() => onVisitedHotel(hotel.hotelId)"
                text="เยี่ยมชม"
                class="cursor-pointer !bg-accent-focus text-accent-content bg-opacity-80"
              ></v-chip>
            </div>
            <div class="absolute z-10 -left-2 top-32">
              <v-chip
                prepend-icon="mdi-fire-circle"
                :text="`ประหยัด ${hotel.partner.discount}%`"
                class="!bg-primary text-primary-content rounded-l-none"
                size="small"
              >
              </v-chip>
            </div>
          </figure>
          <div class="card-body">
            <div class="flex flex-col gap-1 items-start">
              <h3 class="text-base">{{ hotel.name }}</h3>
              <v-chip
                class="!bg-slate-50 !flex"
                size="x-small"
                prepend-icon="mdi-map-marker"
                :text="`${hotel.address.district}, ${hotel.address.subDistrict}`"
              >
              </v-chip>
            </div>
            <div class="flex flex-col gap-6">
              <div class="flex gap-2">
                <v-rating
                  readonly
                  class="!text-accent-focus"
                  size="small"
                  v-model="hotel.rating.stars"
                  hover
                  density="compact"
                  half-increments
                ></v-rating>
                <pre>{{ hotel.rating.stars }}</pre>
              </div>

              <p v-if="distance" class="text-gray-500 -mt-5 text-sm">
                ห่างออกไป {{ distance[i] }} กิโลเมตร
              </p>
            </div>
            <article class="prose prose-sm">
              <figure class="!flex justify-start">THB {{ hotel.price }}</figure>
              <figcaption class="text-gray-500 -mt-6">
                ราคาเริ่มต้นต่อคืน
              </figcaption>
            </article>
          </div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>
<style scoped>
@tailwind components;

@layer components {
  .card-hovering:hover {
    @apply shadow-lg duration-200 cursor-pointer;
  }

  .fade-out:hover {
    @apply opacity-80  duration-200;
  }

  .fade-out {
    @apply opacity-100 duration-200;
  }
}
</style>
