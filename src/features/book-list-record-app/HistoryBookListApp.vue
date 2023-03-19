<script lang="ts">
import HotelCard from "../../components/HotelCard.vue";
import { useHotelState } from "../../feature-store/hotelState";
import { useAuthState } from "../../auth/authState";
export default {
  components: { HotelCard },
  setup() {
    return { hotelHistoryState: useAuthState().getCurrAcc.rentalHistory };
  },
};
</script>
<template>
  <div class="">
    <div class="flex items-center justify-evenly">
      <lottie-player
        src="https://assets6.lottiefiles.com/private_files/lf30_cywopxwk.json"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px"
        loop
        autoplay
      ></lottie-player>
      <div class="flex-col flex gap-3 mb-3 items-end">
        <h1 class="text-4xl font-semibold">ห้องพักที่ฉันเคยจองไว้</h1>
        <p class="lead text-md">
          พบ
          {{ hotelHistoryState.length }}
          รายการห้องพักที่ได้เคยทำการจองไว้ทั้งหมด
        </p>
      </div>
    </div>
    <hr class="mb-6" />
    <div v-for="hotelHistory in hotelHistoryState" class="w-auto mb-6 mr-2">
      <HotelCard
        :rented-date="hotelHistory.rentalDate"
        card-type="History"
        :hotel-model="hotelHistory.hotel"
      ></HotelCard>
    </div>
  </div>
</template>
<style lang=""></style>
