<script lang="ts">
import {
  DistrictCollection,
  useHotelState,
} from "../../feature-store/hotelState";
import Swal from "sweetalert2";
import ForumViewCard from "../../components/ForumViewCard.vue";
import { useForumState } from "../../feature-store/forumState";
import StateNotFound from "../../components/StateNotFound.vue";
export default {
  components: { ForumViewCard, StateNotFound },
  setup() {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    return {
      districtState: useHotelState().getDistrictState,
      forumState: useForumState().getForumPostState,
      Toast,
    };
  },
  data: () => ({
    onSelectDistrict: null,
  }),

  computed: {
    getForumByDistrict() {
      if (!this.onSelectDistrict) return this.forumState;
      const forumByDistrictList = this.forumState.filter(
        (fs) => fs.hotelRef.address.district === this.onSelectDistrict
      );
      return forumByDistrictList.length > 0 ? forumByDistrictList : null;
    },
  },
};
</script>
<template>
  <div class="my-3">
    <div class="flex justify-evenly items-center mx-auto">
      <article class="prose">
        <h1>ยินดีต้อนรับสู่บอร์ดฟอรัม</h1>
        <p class="indent-10">
          ฟอรัมรีวิวโรงแรมของเราเป็นสถานที่ที่สมบูรณ์แบบในการค้นหาและแบ่งปันรีวิวโรงแรมจากทั่วโลกอย่างละเอียดและจริงใจ
          เข้าร่วมชุมชนที่กระตือรือร้นและมีความรู้ของเราวันนี้และค้นพบโรงแรมที่ดีที่สุดสำหรับวันหยุดพักผ่อนครั้งต่อไปของคุณ
        </p>
      </article>
      <lottie-player
        src="https://assets1.lottiefiles.com/packages/lf20_ccbkweni.json"
        background="transparent"
        speed="1"
        style="width: 500px; height: 200px"
        autoplay
      ></lottie-player>
    </div>
    <hr class="my-4" />
    <v-toolbar
      title="เลือกโซน"
      class="bg-primary-content !text-primary"
      rounded
    >
      <template v-slot:prepend>
        <div class="!z-10 text-white">
          <p></p>
          <v-select
            hide-details
            clearable
            floating
            class="!bg-primary-focus !text-white"
            color="primary"
            v-model="onSelectDistrict"
            :items="districtState.map((d) => d.district)"
            return-object
          ></v-select>
        </div>
      </template>
    </v-toolbar>
    <div
      v-if="forumState.length < 1 || !forumState || getForumByDistrict === null"
    >
      <StateNotFound></StateNotFound>
    </div>
    <div v-else class="">
      <div class="my-4">
        <div v-for="forum in getForumByDistrict">
          <ForumViewCard action="VIEW" :forum-prop="forum"></ForumViewCard>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
