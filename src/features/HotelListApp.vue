<script lang="ts">
import { useDisplay } from "vuetify/lib/framework.mjs";
import { PropType } from "vue";
import { Hotel, useHotelState, RoomFeature } from "../feature-store/hotelState";
import HotelCard from "../components/HotelCard.vue";
import LoadingProps from "../components/LoadingProps.vue";

export default {
  components: { HotelCard, LoadingProps },
  setup() {
    return { hotelState: <Hotel[]>useHotelState().getHotelState };
  },
  props: {
    headline: String,
    hLength: Number,
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
      onLoaded: false,
      display: useDisplay(),
      dialog: false,
      hotelProps: <Hotel[]>useHotelState().getHotelState,
      opts: {
        bedType: [] as RoomFeature["bedType"][],
        isPartner: "",
        discount: [] as number[],
        service: [] as string[],
        rating: [] as number[],
      },
    };
  },

  methods: {
    async onFilterAction() {
      this.onLoaded = true;
      let filterOpts = {
        ...this.opts,
        discount: this.opts.discount.map(Number),
        isPartner: !!+this.opts.isPartner, //- convert from number to boolean (1,0)
        rating: this.opts.rating.map(Number),
      };
      const filteredHotels = this.hotelState.filter((hotel) => {
        // Check if the bedType property of the hotel object matches the bedType values in the opts object
        if (
          filterOpts.bedType.length &&
          !filterOpts.bedType.some((bedType) =>
            hotel.roomFeature.bedType.includes(bedType)
          )
        ) {
          return false;
        }

        // Check if the isPartner property of the hotel object matches the isPartner value in the opts object
        if (
          filterOpts.isPartner !== null &&
          hotel.partner.isPartner !== filterOpts.isPartner
        ) {
          return false;
        }

        // Check if the discount property of the hotel object matches the discount values in the opts object
        if (
          filterOpts.discount.length > 0 &&
          filterOpts.discount.includes(hotel.partner.discount)
        ) {
          return false;
        }

        // Check if the service property of the hotel object matches the service values in the opts object
        if (filterOpts.service.length > 0) {
          const services = hotel.services;
          if (
            filterOpts.service.includes("food") &&
            services.restaurantServiceTimes !== "breakfast"
          ) {
            return false;
          }
          if (
            filterOpts.service.includes("parking") &&
            !services.hasOwnParking
          ) {
            return false;
          }
          if (filterOpts.service.includes("pet") && !services.petsAllowed) {
            return false;
          }
        }

        // Check if the rating property of the hotel object matches the rating values in the opts object
        if (
          filterOpts.rating.length &&
          !filterOpts.rating.includes(hotel.rating.stars)
        ) {
          return false;
        }

        // If all checks pass, return true to include the hotel in the filtered array
        return true;
      });
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        this.onLoaded = false;
        console.log(filteredHotels);
        console.log(filterOpts);
        this.hotelProps = filteredHotels;
      });
    },
  },
};
</script>
<template>
  <div class="grid mt-6 place-items-center lg:grid-cols-3">
    <div class=""></div>
    <div class=""></div>
    <article class="prose place-self-center mr-0 lg:mr-12 text-end">
      <h1>ห้องพักทั้งหมด</h1>
      <p class="">{{ hLength || 0 }} รายการห้องพักที่เกี่ยวข้องกัน</p>
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
    <v-dialog v-model="dialog" width="380">
      <div
        class="max-h-[70vh] overflow-y-auto col-span-1 place-self-start place-content-end w-full py-10"
      >
        <div class="">
          <v-card class="mx-auto" max-width="500">
            <v-card-text>
              <FormKit
                v-model="opts.bedType"
                type="checkbox"
                label="เตียงนอน"
                :options="{
                  เตียงเดี่ยว: 'เตียงเดี่ยว',
                  เตียงคู่: 'เตียงคู่',
                  เตียงสองชั้น: 'เตียงสองชั้น',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                v-model="opts.isPartner"
                type="radio"
                label="Partner"
                :options="{
                  1: 'เป็น Partner กับเรา',
                  0: 'ไม่เป็น Partner กับเรา',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                v-model="opts.discount"
                type="checkbox"
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
                v-model="opts.service"
                type="checkbox"
                label="Services"
                :options="{
                  food: 'มีอาหารให้',
                  parking: 'มีที่จอดรถส่วนตัวให้',
                  pet: 'สามารถนำสัตว์เข้าได้',
                }"
                help="Configure your car’s trim options"
              />
            </v-card-text>
            <v-card-text>
              <FormKit
                v-model="opts.rating"
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
              <v-btn
                @click="onFilterAction()"
                class="!btn-primary"
                location="top"
                >ยืนยัน</v-btn
              >
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
        <v-card class="mx-auto" max-width="500">
          <v-card-text>
            <FormKit
              v-model="opts.bedType"
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
              v-model="opts.isPartner"
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
              v-model="opts.discount"
              type="checkbox"
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
              v-model="opts.service"
              type="checkbox"
              label="Services"
              :options="{
                food: 'มีอาหารให้',
                parking: 'มีที่จอดรถส่วนตัวให้',
                pet: 'สามารถนำสัตว์เข้าได้',
              }"
              help="Configure your car’s trim options"
            />
          </v-card-text>
          <v-card-text>
            <FormKit
              v-model="opts.rating"
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
            <v-btn @click="onFilterAction()" class="!btn-primary" location="top"
              >ยืนยัน</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <div
      v-if="onLoaded"
      class="col-span-2 flex flex-col gap-10 min-w-[800px] max-w-[800px]"
    >
      <div class="items-center">
        <LoadingProps></LoadingProps>
      </div>
    </div>
    <div
      v-else
      class="col-span-2 flex flex-col gap-10 min-w-[800px] max-w-[800px]"
    >
      <HotelCard
        :hotel-model="hotel"
        v-for="hotel in hotelProps.slice(0, 5)"
      ></HotelCard>
    </div>
  </div>
</template>
<style lang=""></style>
