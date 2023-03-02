<script lang="ts">
import { PropType } from "vue";
import { Hotel, ServiceFeatures } from "../feature-store/hotelState";

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
    path: Object,
    buttonText: String,
    helpDetail: String,
    colorText: String,
    imgSrcArr: Array,
    axis: String,
    width: String,
    height: String,
    title: String,
    title2: String,
    subTitle: String,
    subTitleArr: Array,
    hotelModel: {
      type: Object as PropType<Hotel>,
      required: true,
    },
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
  },

  data() {
    return {
      model: 0,
    };
  },
};
</script>
<template>
  <v-card elevation="2">
    <v-toolbar  class="!bg-secondary-focus" density="compact">
        <template v-slot:prepend>
            <v-icon icon="mdi-clock" color="white"></v-icon>
        </template>
        <template v-slot:title>
            <h1 class="text-white">มาใหม่ล่าสุด</h1>
        </template>
    </v-toolbar>
    <div class="!h-80 grid grid-cols-8">
      <div class="col-span-3">
        <v-sheet elevation="8" width="full">
          <div class="h-64">
            <v-expand-transition>
              <div
                v-show="model != null"
                class="flex fill-height align-center justify-center"
              >
                <v-img
                  cover
                  :src="(hotelModel.imgUrls[model] as string) "
                  class="h-80 object-fit"
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
                ห่างจากตัวเมือง 24 กิโลเมตร
              </p>
              <p class="text-xs !text-primary flex items-center gap-1">
                <v-icon icon="mdi-map-marker"></v-icon>
                ห่างจากจุดที่อ้างอิง 12 กิโลเมตร
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
                      hotelModel.services.restaurantServiceTimes === "breakfast"
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
          <div class="h-16 flex items-center gap-2">
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
          </div>
        </v-sheet>
      </v-card>
      <!-- <p v-if="subTitle" class="text-base indent-10 break-words">
        {{ subTitle }}
      </p> -->
      <div class="col-span-2">
        <div class="h-80 w-full grid grid-rows-2">
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
                <p>{{ hotelModel.rating.reviews.length }} ความคิดเห็น</p>
              </div>
            </v-btn>
          </section>
          <section id="price" class="place-self-end m-2">
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
</template>
<!-- <div id="bottom-toolbar" class="card-actions h-full !items-end justify-end">
  <router-link v-if="path?.link" :to="path?.link" rel="">
    <button class="btn btn-primary">
      {{ buttonText || "เรียนรู้เพิ่มเดิม" }}
    </button>
  </router-link>
  <button v-else class="btn btn-primary">
    {{ buttonText || "เรียนรู้เพิ่มเดิม" }}
  </button>
</div> -->
