<script lang="ts">
import { useAuthState } from "../auth/authState";
import CardHotelCarousel from "../components/CardHotelCarousel.vue";
import Map from "../components/Map.vue";
import SearchHotelBar from "../components/SearchHotelBar.vue";
import VoucherCardCarousel from "../components/VoucherCardCarousel.vue";
import { Hotel, useHotelState } from "../feature-store/hotelState";
import LoadingProps from "../components/LoadingProps.vue";
import DistrictCarouselList from "../components/DistrictCarouselList.vue";
export default {
  components: {
    CardHotelCarousel,
    Map,
    SearchHotelBar,
    VoucherCardCarousel,
    LoadingProps,
    DistrictCarouselList,
  },
  setup() {
    const districtImgArr = [
      "https://www.tripgether.com/wp-content/uploads/2022/11/Khlong-Mae-Kha-233.jpg",
      "https://s359.kapook.com/pagebuilder/d801ebf6-a9d5-4858-84b2-5dee62f0bc4d.jpg",
      "https://district.cdd.go.th/saraphi/wp-content/uploads/sites/180/2017/03/yang_trees-800x445-1.jpg",
      "https://www.topchiangmai.com/wp-content/uploads/2015/11/%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B8%88%E0%B8%AD%E0%B8%A1%E0%B8%81%E0%B8%B4%E0%B8%95%E0%B8%95%E0%B8%B4.jpg",
      "https://img.wongnai.com/p/1920x0/2018/11/22/f133ae9db59a4e0ab734917c75ecd14d.jpg",
      "https://img.kapook.com/u/2018/Tanapol/travel/october/hangdongchangmai/f3.jpg",
    ];
    return {
      currentUser: useAuthState(),
      districtState: useHotelState().getDistrictState,
      districtImgArr,
    };
  },
  data() {
    return {
      onLoaded: true,
      nearestHotels: {
        hotels: <Hotel[]>[],
        distancesKM: <number[]>[],
      },
    };
  },
  mounted() {
    this.onLoadedHotelProps();
  },
  methods: {
    //- seems likes geo current set is not working correctly
    onLoadedHotelProps() {
      this.onLoaded = true;
      new Promise((r) =>
        setTimeout(() => {
          useAuthState().setCurrentGeoLocation();
          r(true);
        }, 1000)
      ).then(() => {
        const { nearestHotels, distances } = useHotelState().getNearestHotel(
          {
            lat: this.currentUser.getCurrAcc?.geolocation.lat!,
            lng: this.currentUser.getCurrAcc?.geolocation.lng!,
          },
          10,
          600
        );
        console.log(this.currentUser.getCurrAcc?.geolocation);
        this.nearestHotels = {
          hotels: nearestHotels,
          distancesKM: distances,
        };
        this.onLoaded = false;
      });
    },
  },
};
</script>
<template>
  <div v-if="onLoaded">
    <LoadingProps class="h-screen"></LoadingProps>
  </div>
  <div v-else>
    <div id="hero-section" class="!h-[65vh]">
      <SearchHotelBar></SearchHotelBar>
      <div class="lg:flex justify-evenly items-center">
        <div class="">
          <v-container>
            <article
              class="mx-auto prose prose-headings:text-primary max-h-none mt-14"
            >
              <h1 class="">ค้นหาที่พักครั้งถัดไป</h1>
              <p class="lead -mt-6 text-primary-focus">
                ค้นหาข้อเสนอสำหรับโรงแรม บ้านพัก และอื่น ๆ อีกมากมาย...
              </p>
              <v-card>
                <Map action="currentGeo"></Map>
              </v-card>
              <div class="flex gap-2 items-center">
                <p>
                  ตอนนี้มีห้องอยู๋
                  {{ nearestHotels.hotels.length }} แห่งที่ใกล้คุณ
                </p>
                <v-chip
                  class="!bg-primary-focus text-primary-content cursor-pointer"
                  >ดูตอนนี้เลย</v-chip
                >
              </div>
            </article>
          </v-container>
        </div>

        <lottie-player
          src="https://assets8.lottiefiles.com/packages/lf20_fxvz0c.json"
          background="transparent"
          speed="1"
          style="width: 400px; height: 400px"
          loop
          class="invisible lg:visible"
          autoplay
        ></lottie-player>
        <!-- <img
          class="invisible lg:visible w-[25rem] lg:w-[30rem] h-[95%] -z-0 right-0"
          src="https://img.freepik.com/free-vector/happy-tourists-choosing-hotel-booking-room-online-flat-illustration_74855-10811.jpg?w=1060&t=st=1677690130~exp=1677690730~hmac=7b5c285f2911bc199c49d2a17add9a1a29620275109c0e37213e39da65140320"
        /> -->
      </div>
    </div>

    <div class="grid grid-cols-1 gap-y-12 my-12">
      <div class="">
        <CardHotelCarousel
          title="ห้องพักใกล้ฉัน"
          :hotel-props="nearestHotels.hotels"
          :distance="nearestHotels.distancesKM"
          :border="true"
        ></CardHotelCarousel>
      </div>
      <div class="">
        <DistrictCarouselList
          :images="districtImgArr"
          :district-props="districtState.slice(0, 6)"
        ></DistrictCarouselList>
      </div>
      <div class="lg:place-self-center">
        <VoucherCardCarousel></VoucherCardCarousel>
      </div>
    </div>

    <!--- for 70/30 -->
    <!-- <div class="my-10 block lg:grid lg:grid-cols-3 gap-6">
      <div class="col-span-2 ">
        <CardHotelCarousel></CardHotelCarousel>
      </div>
      <div class="">
        <VoucherCardCarousel></VoucherCardCarousel>
      </div>
    </div> -->
  </div>
</template>
<style scoped>
.img-bg {
  background-image: url("https://img.freepik.com/free-vector/happy-tourists-choosing-hotel-booking-room-online-flat-illustration_74855-10811.jpg?w=1060&t=st=1677690130~exp=1677690730~hmac=7b5c285f2911bc199c49d2a17add9a1a29620275109c0e37213e39da65140320");
}
</style>
