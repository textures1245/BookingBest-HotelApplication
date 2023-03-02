<script lang="ts">
import CardHotelCarousel from "../components/CardHotelCarousel.vue";
import Map from "../components/Map.vue";
import SearchHotelBar from "../components/SearchHotelBar.vue";
import VoucherCardCarousel from "../components/VoucherCardCarousel.vue";
export default {
  components: { CardHotelCarousel, Map, SearchHotelBar, VoucherCardCarousel },
};
</script>
<template>
  <div id="hero-section" class="h-[70vh]">
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
              <Map ></Map>
            </v-card>
            <div class="flex gap-2 items-center">
              <p>ตอนนี้มีห้องอยู๋ 8 แห่งที่ใกล้คุณ</p>
              <v-chip
                class="!bg-primary-focus text-primary-content cursor-pointer"
                >ดูตอนนี้เลย</v-chip
              >
            </div>
          </article>
        </v-container>
      </div>
      <img
        class="invisible lg:visible w-[25rem] lg:w-[30rem] h-[95%] -z-0 right-0"
        src="https://img.freepik.com/free-vector/happy-tourists-choosing-hotel-booking-room-online-flat-illustration_74855-10811.jpg?w=1060&t=st=1677690130~exp=1677690730~hmac=7b5c285f2911bc199c49d2a17add9a1a29620275109c0e37213e39da65140320"
      />
    </div>
  </div>
  <!-- <Map></Map> -->

  <div class="grid grid-cols-1 gap-y-12 my-12">
    <div class="">
      <CardHotelCarousel></CardHotelCarousel>
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
</template>
<style scoped>
.img-bg {
  background-image: url("https://img.freepik.com/free-vector/happy-tourists-choosing-hotel-booking-room-online-flat-illustration_74855-10811.jpg?w=1060&t=st=1677690130~exp=1677690730~hmac=7b5c285f2911bc199c49d2a17add9a1a29620275109c0e37213e39da65140320");
}
</style>
