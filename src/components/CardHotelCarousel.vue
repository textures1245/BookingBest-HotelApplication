<script lang="ts">
import { PropType } from "vue";
import { Hotel } from "../feature-store/hotelState";

export default {
  props: {
    itemArr: {
      type: Object as PropType<Hotel[]>,
      // required: true,
    },
  },
  data: () => ({
    model: null,
    rating: 3.5,
  }),
};
</script>
<template>
  <v-sheet class="mx-auto py-6 bg-base-200 border-t-[1px] h-full" elevation="1">
    <article
      class="prose prose-blockquote:text-2xl prose-blockquote:text-primary-focus"
    >
      <blockquote class="w-8/12 lg:w-10/12 mx-auto">
        ค้นหาฟีเจอร์ที่ดีที่สด
      </blockquote>
    </article>
    <v-slide-group v-model="model" class="pa-4" start-active show-arrows>
      <v-slide-group-item v-for="n in 8" v-slot="{ isSelected, toggle }">
        <div
          @click="toggle"
          class="card card-compact w-64 lg:w-80 shadow-md mx-3 my-2"
        >
          <figure class="group card-hovering">
            <v-img
              class="!fade-out"
              src="https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/184305239.jpg?k=4dbc2549dfba179004f2acdacceb65c7fb501f88823274ceb8397bde485209b7&o="
            >
            </v-img>
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
                text="ลองดู"
                class="!bg-accent-focus text-accent-content bg-opacity-80"
              ></v-chip>
            </div>

            <div class="absolute z-10 -left-2 bottom-36">
              <v-chip
                prepend-icon="mdi-fire-circle"
                text="ประหยัด 20%"
                class="!bg-primary text-primary-content rounded-l-none"
                size="small"
              >
              </v-chip>
            </div>
          </figure>
          <div class="card-body">
            <div class="flex gap-1 items-center">
              <h2 class="text-lg">Hotel name</h2>
              <v-chip
                class="!bg-slate-50 !flex"
                size="x-small"
                prepend-icon="mdi-map-marker"
                text="สุขุมวิท,กรุงเทพ"
              >
              </v-chip>
            </div>
            <div class="flex gap-2">
              <v-rating
                readonly
                class="!text-accent-focus"
                size="small"
                v-model="rating"
                hover
                density="compact"
                half-increments
              ></v-rating>
              <pre>{{ rating }}</pre>
            </div>
            <article class="prose prose-sm">
              <figure class="!flex justify-start">THB 572.00</figure>
              <figcaption class="text-gray-500 -mt-5">
                ราคาเริ่มต้นต่อคืน
              </figcaption>
            </article>
            <!-- <div class="card-actions justify-end">
              <button class="btn btn-primary">Buy Now</button>
            </div> -->
          </div>
        </div>
        <!-- <v-card
          :color="isSelected ? 'primary' : 'grey-lighten-1'"
          class="ma-4"
          height="200"
          width="100"
          @click="toggle"
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
        </v-card> -->
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
