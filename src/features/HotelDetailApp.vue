<script lang="ts">
import { Hotel, useHotelState } from "../feature-store/hotelState";
import HotelImage from "../components/ImageCarouselCard.vue";
import ReviewWidget from "../components/ReviewWidget.vue";
import Swal from "sweetalert2";
import Map from "../components/Map.vue";
import CardHotelCarousel from "../components/CardHotelCarousel.vue";
import PaymentDialog from "../components/PaymentDialog.vue";
import { useAuthState } from "../auth/authState";

export default {
  components: {
    HotelImage,
    ReviewWidget,
    Map,
    CardHotelCarousel,
    PaymentDialog,
  },
  props: {},
  setup() {
    return {
      hotelState: useHotelState(),
      currAccount: useAuthState().getCurrAcc,
    };
  },
  data() {
    return {
      dialogReview: false,
      togglePaymentDialog: false,
      hotel: <Hotel>{},
      nearestHotels: { hotels: <Hotel[]>[], distancesKM: <number[]>[] },
      breadcrumbItems: <any>[],
      onLoaded: true,
      model: null,
      tab: 0,
      menuTopic: ["ลายละเอียด", "สิ่งอำนวยความสะดวก"],
      roomDetails: ["ขนาดห้อง", "ประเภทเตียงนอน"],
      furnitureGroup: {
        name: ["ทั่วไป", "เทคโนโลยี", "อื่นๆ"],
        eachGroup: [
          "",
          "",
          "ทั่วไป",
          "ห้องน้ำ",
          "ห้องนอน",
          "เทคโนโลยีทั่วไป",
          "อินเทอร์เน็ต",
          "ทิวทัศณ์",
          "ห้องครัว",
          "อุปกรณ์ป้องกันนิรภัย",
        ],
      },

      furnitureGroupSelected: "ทั่วไป",
    };
  },
  computed: {
    getFullAddress() {
      const fullAddress = `${this.hotel.address.district},
       ${this.hotel.address.subDistrict}, ${this.hotel.address.moo}, ${this.hotel.address.houseNumber},
       ${this.hotel.address.postalCode}`;
      return fullAddress;
    },
    reviewOrder(): string {
      let order = "";
      switch (this.hotel.rating.stars) {
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
  mounted() {
    const hotelId = +this.$route.params.id;
    const hotelProps = this.hotelState.getHotelState.find(
      (h) => h.hotelId == hotelId
    );
    if (hotelProps) {
      this.onLoadedPropsById(hotelProps);
    } else {
      Swal.fire({
        icon: "error",
        title: "ไม่พบรายการที่ต้องหาร",
        text: "ไม่พบรายการห้องพักที่คุณต้องการหา",
        footer: '<a href="">โปรดแน่ใจว่าคุณกดรายการจากแหล่งห้องพักจริง ๆ</a>',
      });
      this.$router.push("/app-overview");
    }
    return {};
  },
  methods: {
    onLoadedPropsById(hotelProps: Hotel) {
      if (hotelProps) {
        this.hotel = hotelProps;
        const { nearestHotels, distances } = this.hotelState.getNearestHotel(
          {
            lat: this.hotel.address.geo.lat,
            lng: this.hotel.address.geo.lng,
          },
          10,
          50
        );
        this.nearestHotels = {
          hotels: nearestHotels,
          distancesKM: distances,
        };
        console.log(nearestHotels),
          (this.breadcrumbItems = [
            {
              title: "หน้าหลัก",
              disabled: false,
              href: "breadcrumbs_dashboard",
            },
            {
              title: `แหล่งที่พักจุดหมาย ${this.hotel.address.district}`,
              disabled: false,
              href: "breadcrumbs_link_1",
            },
            {
              title: this.hotel.name,
              disabled: true,
              href: "breadcrumbs_link_2",
            },
          ]),
          (this.onLoaded = false);
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่พบรายการที่ต้องหาร",
          text: "ไม่พบรายการห้องพักที่คุณต้องการหา",
          footer: '<a href="">โปรดแน่ใจว่าคุณกดรายการจากแหล่งห้องพักจริง ๆ</a>',
        });
        this.$router.push("/app-overview");
      }
    },
  },
};
</script>
<template>
  <div class="mx-auto">
    <v-container v-if="!onLoaded">
      <div class="mx-auto">
        <v-breadcrumbs class="text-sm" :items="breadcrumbItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
        <HotelImage :img-urls="hotel.imgUrls"></HotelImage>
        <v-card class="mt-4 !sticky !top-0" elevation="4">
          <v-tabs v-model="tab">
            <v-tab v-for="menu in menuTopic" :value="menu">{{ menu }}</v-tab>

            <v-spacer></v-spacer>
            <v-tab class="text-xl text-success" append-icon="mdi-home-floor-b">
              <span class="text-sm mr-2 text-black">เริ่มต้นที่</span>
              ฿ {{ hotel.price }}
            </v-tab>
          </v-tabs>
        </v-card>
        <div class="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <div class="col-span-4 mt-6">
            <v-window v-model="tab">
              <v-window-item
                class="m-2"
                v-for="menu in menuTopic"
                :value="menu"
                :key="menu"
              >
                <div v-if="menu === 'ลายละเอียด'">
                  <v-card class="mx-auto">
                    <v-toolbar class="!bg-primary-content" density="compact">
                      <div class="flex gap-2 ml-3">
                        <v-btn
                          density="compact"
                          prepend-icon="mdi-star-check"
                          color="primary"
                          variant="flat"
                        >
                          ยอดนิยมขณะนี้
                        </v-btn>
                        <v-btn
                          density="compact"
                          prepend-icon="mdi-flash"
                          class="!bg-accent text-white"
                          variant="flat"
                        >
                          มาใหม่ล่าสุด
                        </v-btn>
                      </div>
                      <v-spacer></v-spacer>
                      <div class="flex gap-2 mr-3">
                        <v-btn
                          v-if="!!hotel.guests.adults"
                          density="compact"
                          prepend-icon="mdi-account-tie"
                          variant="text"
                        >
                          ผู้ใหญ่ {{ hotel.guests.adults }}
                        </v-btn>
                        <v-btn
                          v-if="!!hotel.guests.children"
                          density="compact"
                          prepend-icon="mdi-account"
                          variant="text"
                        >
                          เด็ก {{ hotel.guests.children }}
                        </v-btn>
                      </div>
                    </v-toolbar>
                    <v-card-text>
                      <article
                        class="prose prose-blockquote:text-slate-500 prose-blockquote:text-md prose-blockquote:font-light leading-tight lg:prose-lg"
                      >
                        <h2 class="">
                          {{ hotel.name }}
                          <v-rating
                            color="yellow-darken-3"
                            v-model="hotel.rating.stars"
                            density="compact"
                          ></v-rating>
                        </h2>
                        <br />
                        <a>{{ getFullAddress }}</a>
                        <hr class="my-6 leading-none" />
                        <blockquote class="w-full">
                          {{ hotel.description }}
                        </blockquote>
                      </article>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn variant="text" color="deep-purple-accent-4">
                        Learn More
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <v-card class="mt-4" elevation="4">
                    <v-toolbar
                      class="text-secondary"
                      density="compact"
                      title="ไฮไลท์"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-star"></v-icon>
                      </template>
                    </v-toolbar>
                    <v-tabs
                      align-tabs="center"
                      hide-slider
                      class="!overflow-x-auto"
                    >
                      <v-tab prepend-icon="mdi-food">อาหารฟรี</v-tab>
                      <v-tab prepend-icon="mdi-car">ที่จอดรถส่วนตัว</v-tab>
                      <v-tab prepend-icon="mdi-dog">สัตว์เข้ามาได้</v-tab>
                      <v-tab prepend-icon="mdi-image-filter-hdr"
                        >ใกล้สถานที่ท่องทิว</v-tab
                      >
                      <v-tab prepend-icon="mdi-city-variant"
                        >ใกล้ตัวเมือง</v-tab
                      >
                    </v-tabs>
                  </v-card>
                </div>
                <div v-if="menu === 'สิ่งอำนวยความสะดวก'">
                  <v-card class="mx-auto">
                    <v-toolbar class="!bg-primary-content" density="compact">
                      <div class="flex gap-2 ml-3">
                        <v-btn
                          v-for="group in furnitureGroup.name"
                          density="compact"
                          prepend-icon="mdi-star-check"
                          color="primary"
                          :value="group"
                          @click="() => (furnitureGroupSelected = group)"
                          v-model="furnitureGroupSelected"
                          variant="flat"
                        >
                          {{ group }}
                        </v-btn>
                      </div>
                    </v-toolbar>
                    <v-card-text>
                      <div class="">
                        <template v-for="(items, key, i) in hotel.roomFeature">
                          <v-card
                            v-if="
                              furnitureGroupSelected === 'ทั่วไป' &&
                              i > 1 &&
                              i < 5 &&
                              items.length > 0 &&
                              items[0] !== 'none'
                            "
                            color="white"
                            :subtitle="furnitureGroup.eachGroup[i]"
                            prepend-icon="mdi-star-four-points"
                            rounded="6"
                            width="auto"
                            density="compact"
                            class="m-5 p-2"
                            elevation="1"
                          >
                            <hr class="mx-auto mb-4" />
                            <div class="m-2">
                              <v-chip
                                elevation="2"
                                size="small"
                                prepend-icon="mdi-check"
                                density="comfortable"
                                class="m-1"
                                v-for="item in items"
                                :key="item"
                                >{{ item }}</v-chip
                              >
                            </div>
                          </v-card>
                          <v-card
                            v-if="
                              furnitureGroupSelected === 'เทคโนโลยี' &&
                              i > 4 &&
                              i < 7 &&
                              items.length > 0 &&
                              items[0] !== 'none'
                            "
                            color="white"
                            :subtitle="furnitureGroup.eachGroup[i]"
                            prepend-icon="mdi-motion-outline"
                            rounded="6"
                            width="auto"
                            density="compact"
                            class="m-5 p-2"
                            elevation="1"
                          >
                            <hr class="mx-auto mb-4" />
                            <div class="m-2">
                              <v-chip
                                elevation="2"
                                size="small"
                                prepend-icon="mdi-check"
                                density="comfortable"
                                class="m-1"
                                v-for="item in items"
                                :key="item"
                                >{{ item }}</v-chip
                              >
                            </div>
                          </v-card>
                          <v-card
                            v-if="
                              furnitureGroupSelected === 'อื่นๆ' &&
                              i > 6 &&
                              items.length > 0 &&
                              items[0] !== 'none'
                            "
                            color="white"
                            :subtitle="furnitureGroup.eachGroup[i]"
                            prepend-icon="mdi-adjust"
                            rounded="6"
                            width="auto"
                            density="compact"
                            class="m-5 p-2"
                            elevation="1"
                          >
                            <hr class="mx-auto mb-4" />
                            <div class="m-2">
                              <v-chip
                                elevation="2"
                                size="small"
                                prepend-icon="mdi-check"
                                density="comfortable"
                                class="m-1"
                                v-for="item in items"
                                :key="item"
                                >{{ item }}</v-chip
                              >
                            </div>
                          </v-card>
                        </template>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-window-item>
            </v-window>
          </div>
          <div
            class="grid grid-cols-2 gap-4 lg:flex flex-col col-span-3 mt-8 ml-3"
          >
            <v-card variant="elevated">
              <v-toolbar
                density="compact"
                class="bg-secondary-focus text-secondary-content"
                title="ลายละเอียดห้องพัก"
              ></v-toolbar>
              <v-item-group mandatory>
                <v-container>
                  <v-row>
                    <v-col
                      v-for="(d, key, i) in {
                        size: hotel.roomFeature.size,
                        bedType: hotel.roomFeature.bedType,
                      }"
                      :key="i"
                      cols="6"
                      md="6"
                    >
                      <v-item v-if="i <= 1" v-slot="{ isSelected, toggle }">
                        <v-card
                          :color="isSelected ? 'primary' : ''"
                          class="d-flex align-center"
                          dark
                          variant="flat"
                          height="65"
                          @click="toggle"
                        >
                          <v-scroll-y-transition>
                            <div class="flex flex-col items-center w-full">
                              <div class="">
                                <v-icon v-if="i === 0" icon="mdi-bed"></v-icon>
                                <v-icon v-else icon="mdi-resize"></v-icon>
                              </div>
                              <p>
                                {{ roomDetails[i] }}
                              </p>
                              <p class="text-sm">{{ d }}</p>
                            </div>
                          </v-scroll-y-transition>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
              <hr />
              <v-card-actions class="flex justify-end">
                <v-btn variant="outlined"> ดูลายละเอียดเพิ่ม </v-btn>
              </v-card-actions>
            </v-card>
            <v-card variant="elevated">
              <v-toolbar
                density="compact"
                class="bg-primary-focus text-primary-content"
                title="เรทตึ้งของห้องพัก"
              ></v-toolbar>
              <v-card-item>
                <section id="review" class="flex my-5 place-content-start">
                  <v-btn variant="text">
                    <template v-slot:prepend>
                      <v-icon
                        color="info"
                        icon="mdi-chat"
                        class="text-5xl"
                        size="x-large"
                      ></v-icon>
                    </template>
                    <div class="flex flex-col items-start">
                      <p class="text-xl">{{ reviewOrder }}</p>
                      <p>{{ hotel.rating.reviews.length }} ความคิดเห็น</p>
                    </div>
                  </v-btn>
                </section>
              </v-card-item>
              <hr />
              <v-card-actions class="flex justify-end">
                <v-dialog v-model="dialogReview" width="auto">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="outlined" v-bind="props">
                      ดูโดยรวมทั้งหมด
                    </v-btn>
                  </template>

                  <ReviewWidget></ReviewWidget>
                </v-dialog>
              </v-card-actions>
            </v-card>
            <v-card class="col-span-2">
              <Map
                :user-geo="{
                  lat: hotel.address.geo.lat,
                  lng: hotel.address.geo.lng,
                }"
                action="customGeo"
              ></Map>
            </v-card>
          </div>
        </div>
        <div class="my-6">
          <CardHotelCarousel
            :hotel-props="nearestHotels.hotels"
            :distance="nearestHotels.distancesKM"
            :title="`ห้องพักที่ใกล้เคียงกันกับ ${hotel.name}`"
          ></CardHotelCarousel>
        </div>

        <div class="fixed z-20 bottom-10 right-10">
          <v-btn
            class="!bg-primary !text-primary-content"
            prepend-icon="mdi-handshake"
          >
            ดูข้อเสนอการจอง

            <v-dialog v-model="togglePaymentDialog" activator="parent">
              <PaymentDialog :curr-account="currAccount" :hotel-prop="hotel"></PaymentDialog>
            </v-dialog>
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>
<style lang=""></style>
