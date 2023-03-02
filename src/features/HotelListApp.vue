<script lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";
import { PropType } from "vue";
import { Hotel, useHotelState } from "../feature-store/hotelState";
import HotelCard from "../components/HotelCard.vue";

export default {
  components: { HotelCard },
  props: {
    hotelList: {
      type: Array as PropType<Hotel[]>,
      required: true,
    },
  },
  computed: {
    asMdSize() {
      if (this.display.mdAndDown) {
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      display: useDisplay(),
      dialog: false,
      hotels: <Hotel[]>useHotelState().getHotelState,
    };
  },
};
</script>
<template>
  <div class="grid mt-6 place-items-center grid-cols-3">
    <div class=""></div>
    <div class=""></div>
    <article class="prose place-self-center">
      <h1>ห้องพักทั้งหมด</h1>
    </article>
  </div>
  <div
    class="grid grid-cols-1 place-items-center lg:grid-cols-3 overflow-x-auto py-10"
  >
    <v-btn
      @click="() => (dialog = true)"
      icon
      v-if="!asMdSize"
      color="primary"
      class="fixed bottom-14 !right-10 !z-10"
    >
      <v-icon icon="mdi-filter-cog-outline"></v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="auto">
      <div
        class="max-h-[70vh] overflow-y-auto col-span-1 place-self-start place-content-end w-full py-10"
      >
        <div class="">
          <v-card class="mx-auto" max-width="344">
            <v-card-text>
              <FormKit
                type="checkbox"
                label="เตียงนอน"
                :options="{
                  เตียงเดียว: 'เตียงเดียว',
                  เตียงคู่: 'เตียงคู่',
                  เตียงสองชั้น: 'เตียงสองชั้น',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                type="radio"
                label="Partner"
                :options="{
                  true: 'เป็น Partner กับเรา',
                  false: 'ไม่เป็น Partner กับเรา',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                type="radio"
                label="ส่วนลด"
                :options="{
                  10: 'ลด 10%',
                  20: 'ลด 20%',
                  30: 'ลด 30%',
                  40: 'ลด 40%',
                  50: 'ลด 50%',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                type="checkbox"
                label="Services"
                :options="{
                  food: 'มีอาหารให้',
                  parking: 'มีที่จอดรถส่วนตัวให้',
                  pet: 'สามารถนำสัตว์เข้าได้',
                  40: 'ลด 40%',
                  50: 'ลด 50%',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                type="checkbox"
                label="Rating"
                :options="{
                  1: '1 ดาว',
                  2: '2 ดาว',
                  3: '3 ดาว',
                  4: '4 ดาว',
                  5: '5 ดาว',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn class="!btn-primary" location="top">ยืนยัน</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-dialog>
    <div
      v-if="asMdSize"
      class="max-h-[70vh] overflow-y-auto col-span-1 place-self-start place-content-end w-full py-10"
    >
      <div class="">
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <FormKit
              type="checkbox"
              label="เตียงนอน"
              :options="{
                เตียงเดียว: 'เตียงเดียว',
                เตียงคู่: 'เตียงคู่',
                เตียงสองชั้น: 'เตียงสองชั้น',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-text>
            <FormKit
              type="radio"
              label="Partner"
              :options="{
                true: 'เป็น Partner กับเรา',
                false: 'ไม่เป็น Partner กับเรา',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-text>
            <FormKit
              type="radio"
              label="ส่วนลด"
              :options="{
                10: 'ลด 10%',
                20: 'ลด 20%',
                30: 'ลด 30%',
                40: 'ลด 40%',
                50: 'ลด 50%',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-text>
            <FormKit
              type="checkbox"
              label="Services"
              :options="{
                food: 'มีอาหารให้',
                parking: 'มีที่จอดรถส่วนตัวให้',
                pet: 'สามารถนำสัตว์เข้าได้',
                40: 'ลด 40%',
                50: 'ลด 50%',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-text>
            <FormKit
              type="checkbox"
              label="Rating"
              :options="{
                1: '1 ดาว',
                2: '2 ดาว',
                3: '3 ดาว',
                4: '4 ดาว',
                5: '5 ดาว',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn class="!btn-primary" location="top">ยืนยัน</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div class="col-span-2 flex flex-col gap-10 min-w-[800px] max-w-[800px]">
      <HotelCard
        :hotel-model="hotel"
        v-for="hotel in hotels.slice(0, 5)"
      ></HotelCard>
    </div>
  </div>
</template>
<style lang=""></style>
