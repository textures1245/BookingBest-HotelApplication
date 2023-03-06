<script lang="ts">
import HotelCard from "../../components/HotelCard.vue";
import { useHotelState } from "../../feature-store/hotelState";
export default {
  components: { HotelCard },
  setup() {
    return { hotelState: useHotelState().getHotelState };
  },
};
</script>
<template>
  <div class="">
    <article>
      <div class="flex-col flex gap-3 mb-3 items-end">
        <h1 class="text-4xl font-semibold">ห้องพักที่ฉันบันทึกไว้</h1>
        <p class="lead text-md">พบ 10 รายการหอพักที่บันถึกไว้ทั้งหมด</p>
      </div>
    </article>
    <hr class="mb-6" />
    <HotelCard card-type="Booked" :hotel-model="hotelState[0]"></HotelCard>
  </div>
</template>
<style lang=""></style>
