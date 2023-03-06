<script lang="ts">
import { PropType } from "vue";
import { Hotel } from "../feature-store/hotelState";

export default {
  props: {
    imgUrls: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  data() {
    return { model: 0 };
  },
};
</script>
<template>
  <div class="flex justify-center">
    <v-card>
      <v-sheet elevation="8" width="full">
        <div class="grid gap-1 grid-cols-1 lg:grid-cols-6">
          <div class="col-span-3">
            <v-expand-transition>
              <div
                v-show="model != null"
                class="flex fill-height align-center justify-center"
              >
                <v-img cover :src="imgUrls[model]" class="h-96"></v-img>
              </div>
            </v-expand-transition>
          </div>
          <div class="col-span-3 place-self-center">
            <v-slide-group
              v-model="model"
              selected-class="bg-primary"
              center-active
              show-arrows
            >
              <div class="flex lg:grid grid-cols-3 gap-1 overflow-auto">
                <v-slide-group-item
                  v-for="img in (imgUrls as string[])"
                  v-slot="{ isSelected, toggle, selectedClass }"
                >
                  <div class="block">
                    <v-img
                      cover
                      width="200"
                      color="grey-lighten-1"
                      :src="img"
                      class="my-auto h-full !cursor-pointer"
                      @click="toggle"
                    >
                    </v-img>
                  </div>
                </v-slide-group-item>
              </div>
            </v-slide-group>
          </div>
        </div>
      </v-sheet>
    </v-card>
  </div>
</template>
<style lang=""></style>
