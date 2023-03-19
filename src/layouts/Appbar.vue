<script lang="ts">
import { Path } from "../shared-store/pathState";
import { usePathState } from "../shared-store/pathState";
import { customRoutes } from "../routes/app-rotues";
import { useAuthState } from "../auth/authState";
import Swal from "sweetalert2";
import { useHotelState } from "../feature-store/hotelState";
export default {
  props: { isAuth: Boolean },
  setup() {
    return {
      app: {
        title: "BookingBest",
        subtitle: "Make yourself like home at everywhere.",
        logo: "mdi-home-map-marker",
        accountIcon: "mdi-account",
      },
      districtState: useHotelState().getDistrictState,
    };
  },
  data() {
    return {
      featurePaths: <Path[]>usePathState().$state.featurePaths,
      userPaths: <Path[]>usePathState().$state.userPaths,
      customRoutes: {
        overviewRoute: customRoutes[0],
      },
    };
  },

  methods: {
    onSignOut() {
      useAuthState()
        .onSignOut()
        .then((signOut) => {
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
            title: "ออกจากระบบแล้ว",
          });
          this.$router.push("/sign-in");
        })
        .catch((error) => {
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
            icon: "error",
            title: "ล้นเหลวในการออกจากระบบ",
          });
        });
    },
  },
};
</script>
<template>
  <div>
    <v-app-bar elevation="1" class="!bg-base-200 !fixed">
      <template v-slot:image>
        <v-img></v-img>
      </template>

      <template v-slot:prepend>
        <router-link :to="customRoutes.overviewRoute.path">
          <v-app-bar-nav-icon
            :icon="app.logo"
            color="white"
            class="!bg-primary text-lg"
          ></v-app-bar-nav-icon>
        </router-link>
      </template>

      <v-app-bar-title>
        <div class="flex flex-col">
          <h3>
            {{ app.title }}
          </h3>
          <p class="text-caption">{{ app.subtitle }}</p>
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        v-if="isAuth"
        :to="fp.path"
        class="!text-primary-focus mr-2"
        v-for="fp in featurePaths"
      >
        <div class="flex items-center">
          <v-icon class="!text-primary-focus" :icon="fp.icon"></v-icon>
          <span class="text-caption flex mx-auto">
            {{ fp.title }}
          </span>
        </div>
      </v-btn>
      <template v-slot:append>
        <v-menu transition="slide-x-reverse-transition">
          <template v-slot:activator="{ props }">
            <div>
              <v-divider></v-divider>
              <v-btn
                v-bind="props"
                size="small"
                :icon="app.accountIcon"
                class="!text-secondary !bg-primary-content"
              ></v-btn>
            </div>
          </template>
          <v-list class="mt-2">
            <v-list-item
              v-if="!isAuth"
              v-for="(userPath, i) in userPaths"
              :key="i"
            >
              <router-link :to="userPath.path">
                <v-list-item-title>{{ userPath.title }}</v-list-item-title>
              </router-link>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-title
                class="cursor-pointer"
                @click="() => onSignOut()"
                >ออกจากระบบ</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
  </div>
</template>
<style lang=""></style>
