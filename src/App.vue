<script lang="ts">
import Appbar from "./layouts/Appbar.vue";
import { useAuthState } from "./auth/authState";
import Swal from "sweetalert2";
import { useHotelState } from "./feature-store/hotelState";
import { useForumState } from "./feature-store/forumState";

export default {
  components: { Appbar },
  async beforeCreate() {
    useHotelState().setHotelState();
    useForumState().firstInitialsPostState();
    const isAuth = await useAuthState()
      .autoAuth()
      .then((isAuth) => isAuth);
    if (isAuth) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast: any) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "ล็อกอินเสร็จสิ้น",
      });
    }
  },

  methods: {},
};
</script>

<template>
  <v-app class="overflow-y-auto thai-font eng-font">
    <v-layout>
      <Appbar></Appbar>
      <v-main
        class="h-full w-full overflow-y-hidden bg-base-100 thai-font eng-font"
      >
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped></style>
