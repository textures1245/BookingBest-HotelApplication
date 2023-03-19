<script lang="ts">
import { PropType } from "vue";
import {
  Hotel,
  HotelSearcher,
  ServiceFeatures,
} from "../feature-store/hotelState";
import { Timestamp } from "@firebase/firestore";

export type HotelCardType = {
  title: string;
  imgSrcArr: string[];
  address: string;
  optArr: string[];
  helpDetail?: string;
  subTitle?: string;
  subTitleArr?: [];
  path?: object;
  buttonText?: string;
  colorText?: string;
  stars: number;
};

export default {
  props: {
    hotelModel: {
      type: Object as PropType<HotelSearcher | Hotel>,
      required: true,
    },
    cardType: {
      type: String as PropType<"Visit" | "Booked" | "History">,
      required: true,
    },
    rentedDate: Object as PropType<Timestamp>,
  },

  computed: {
    reviewOrder(): string {
      let order = "";
      switch (this.hotelModel.rating.stars) {
        case 0:
        case 1:
          order = "แย่";
          break;
        case 2:
        case 3:
          order = "ปานกลาง";
          break;
        case 4:
          order = "ดี";
          break;
        case 5:
          order = "ดีมาก";
          break;
        default:
          order = "ดี";
          break;
      }
      return order;
    },

    genToolbarValue() {
      let toolbar = {
        icon: "",
        title: "",
      };
      if (this.cardType == "Visit") {
        toolbar = {
          icon: "mdi-clock",
          title: "มาใหม่ล่าสุด",
        };
        return toolbar;
      } else if (this.cardType === "Booked") {
        toolbar = {
          icon: "mdi-heart",
          title:
            "บันทึกแล้วแล้วเมื่อวันที่ " +
            (this.rentedDate! as Timestamp).toDate().toLocaleDateString(),
        };
        return toolbar;
      } else {
        toolbar = {
          icon: "mdi-history",
          title:
            "จองแล้วเมื่อวันที่ " +
            (this.rentedDate! as Timestamp).toDate().toLocaleDateString(),
        };
        return toolbar;
      }
    },
  },
  data() {
    return {
      model: 0,
    };
  },
};
</script>
<template>
  <div class="mx-auto flex justify-center">
    <v-card
      elevation="2"
      class="!duration-300  w-auto xs:w-8/12 sm:w-10/12 md:w-full transition hover:shadow-xl hover:-translate-y-3"
    >
      <v-toolbar
        :class="{
          '!bg-secondary-focus': cardType === 'Visit',
          '!bg-accent-focus': cardType === 'Booked',
          '!bg-primary-focus': cardType === 'History',
        }"
        density="compact"
      >
        <template v-slot:prepend>
          <v-icon :icon="genToolbarValue.icon" color="white"> </v-icon>
        </template>
        <template v-slot:title>
          <h1 class="text-white">{{ genToolbarValue.title }}</h1>
        </template>
        <template v-if="hotelModel.partner.isPartner" v-slot:append>
          <v-chip
            append-icon="mdi-star-circle"
            text="ห้องพักนี้เป็นพาร์ทเนอร์"
            color="white"
          >
          </v-chip>
        </template>
      </v-toolbar>
      <div class="h-full md:h-80 flex-col flex md:grid grid-cols-8">
        <div class="w-full row-span-1 md:col-span-3">
          <v-sheet elevation="8" width="full">
            <div class="md:h-64">
              <v-expand-transition>
                <div
                  v-show="model != null"
                  class="flex fill-height align-center justify-center"
                >
                  <v-img
                    cover
                    :src="(hotelModel.imgUrls[model] as string) "
                    class="h-80 w-full object-fit"
                  ></v-img>
                </div>
              </v-expand-transition>
            </div>
            <div class="!h-20 w-auto">
              <v-slide-group
                v-model="model"
                selected-class="bg-primary"
                center-active
                show-arrows
              >
                <div class="flex gap-1">
                  <v-slide-group-item
                    v-for="img in (hotelModel.imgUrls as string[])"
                    v-slot="{ isSelected, toggle, selectedClass }"
                  >
                    <v-img
                      cover
                      color="grey-lighten-1"
                      :src="img"
                      class="!h-20 !w-28 !cursor-pointer"
                      @click="toggle"
                    >
                    </v-img>
                  </v-slide-group-item>
                </div>
              </v-slide-group>
            </div>
          </v-sheet>
        </div>
        <v-card class="!col-span-3 h-80 !card-body thai-p">
          <v-sheet>
            <div class="h-56">
              <h2>
                {{ hotelModel.name }}
              </h2>
              <div class="flex justify-start items-center gap-2">
                <v-rating
                  class="text-secondary-focus"
                  v-model="hotelModel.rating.stars"
                  readonly
                  size="x-small"
                  density="compact"
                ></v-rating>
                <v-chip
                  class="!bg-secondary !text-secondary-content"
                  size="small"
                  prepend-icon="mdi-map-marker-outline"
                  :text="
                    hotelModel.address.district +
                    ', ' +
                    hotelModel.address.subDistrict
                  "
                ></v-chip>
              </div>
              <div class="mt-2 flex flex-col gap-1">
                <p class="text-xs text-accent flex items-center gap-1">
                  <v-icon icon="mdi-city"></v-icon>
                  ห่างจากตัวเมือง
                  {{ Math.floor(Math.random() * 20) + 5 }} กิโลเมตร
                </p>
                <p
                  v-if="(hotelModel as HotelSearcher)?.formRefDistract"
                  class="text-xs !text-primary flex items-center gap-1"
                >
                  <v-icon icon="mdi-map-marker"></v-icon>
                  ห่างจากจุดที่อ้างอิง
                  {{ (hotelModel as HotelSearcher).formRefDistract }} กิโลเมตร
                </p>
              </div>

              <section id="services" class="flex flex-col gap-1 mt-2">
                <p class="text-caption font-semibold">Service</p>
                <hr />
                <v-divider></v-divider>
                <div class="grid grid-cols-2 gap-y-2">
                  <div
                    v-if="hotelModel.services.restaurantServiceTimes !== 'none' as ServiceFeatures['restaurantServiceTimes']"
                    class="text-xs text-accent flex items-center gap-2"
                  >
                    <v-btn color="info" size="x-small" prepend-icon="mdi-food">
                      {{
                        hotelModel.services.restaurantServiceTimes ===
                        "breakfast"
                          ? "ฟรีอาหารเช้า"
                          : ""
                      }}
                    </v-btn>
                  </div>
                  <div
                    v-if="hotelModel.services.petsAllowed"
                    class="text-xs text-accent flex items-center gap-2"
                  >
                    <v-btn color="info" size="x-small" prepend-icon="mdi-paw">
                      สัตว์เลี้ยงเข้าได้
                    </v-btn>
                  </div>
                  <div
                    v-if="hotelModel.services.hasOwnParking"
                    class="text-xs text-accent flex items-center gap-2"
                  >
                    <v-btn color="info" size="x-small" prepend-icon="mdi-car">
                      ที่จอดรถส่วนตัว
                    </v-btn>
                  </div>
                </div>
              </section>
              <section class="flex flex-col items-start mt-2">
                <div v-if="hotelModel.rating.stars >= 4" class="">
                  <v-btn
                    class="text-success"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-star-check"
                    >ยอดนิยมอยู่ในขณะนี้</v-btn
                  >
                </div>
                <div class="">
                  <v-btn
                    class="text-warning"
                    variant="text"
                    size="small"
                    prepend-icon="mdi-ticket-percent"
                    >ใช้โค๊ด {{ hotelModel.partner.voucherCode }} เพื่อลดราคาลง
                    {{ hotelModel.partner.discount }}%</v-btn
                  >
                </div>
              </section>
            </div>
            <hr />
            <div class="h-24 md:h-16 justify-center flex items-center gap-2">
              <span class="text-xs">ลายละเอียด</span>
              <v-tooltip location="top" :text="hotelModel.roomFeature.size">
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="bg-base-200"
                    v-bind="props"
                    size="x-small"
                    icon="mdi-resize"
                  ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip location="top" :text="hotelModel.roomFeature.bedType">
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="bg-base-200"
                    v-bind="props"
                    size="x-small"
                    icon="mdi-bed"
                  ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip
                location="top"
                v-if="!!hotelModel.guests.adults"
                :text="'ผู้ใหญ่ ' + hotelModel.guests.adults.toString()"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="bg-base-200"
                    v-bind="props"
                    size="x-small"
                    icon="mdi-account-tie"
                  ></v-btn>
                </template>
              </v-tooltip>
              <v-tooltip
                location="top"
                v-if="!!hotelModel.guests.children"
                :text="'เด็ก ' + hotelModel.guests.children.toString()"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="bg-base-200"
                    v-bind="props"
                    size="x-small"
                    icon="mdi-account"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
          </v-sheet>
        </v-card>
        <div class="h-48 md:h-80 col-span-2">
          <div
            class="pt-2 md:h-full w-full items-center md:items-start justify-evenly md:justify-end flex md:grid grid-rows-2"
          >
            <section id="review" class="flex place-content-end m-2">
              <v-btn variant="text" class="text-xs" append-icon="mdi-chat">
                <template v-slot:append>
                  <v-icon
                    color="info"
                    icon="mdi-chat"
                    class="text-5xl"
                    size="x-large"
                  ></v-icon>
                </template>
                <div class="flex flex-col items-end">
                  <p class="text-xl">{{ reviewOrder }}</p>
                  <v-rating
                    color="yellow-darken-3"
                    v-model="hotelModel.rating.stars"
                    readonly
                    size="x-small"
                    density="compact"
                  ></v-rating>
                </div>
              </v-btn>
            </section>
            <section id="price" class="md:place-self-end m-2">
              <div class="flex justify-end mb-2">
                <v-btn
                  :to="`/hotel-list/${hotelModel.hotelId}`"
                  class="!bg-accent !text-white"
                  >เยี่ยมชม</v-btn
                >
              </div>
              <div class="">
                <div class="stat-value font-light text-3xl text-success">
                  ฿{{ hotelModel.price }}.00
                </div>
                <p class="text-end">ราคาเริ่มต้นต่อคืน</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
