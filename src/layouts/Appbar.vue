<script lang="ts">
import { Path } from "../shared-store/pathState";
import { usePathState } from "../shared-store/pathState";
import { customRoutes } from "../routes/app-rotues";
export default {
  setup() {
    return {
      app: {
        title: "BookingBest",
        subtitle: "Make yourself like home at everywhere.",
        logo: "mdi-home-map-marker",
        accountIcon: "mdi-account",
      },
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

      <v-btn class="!text-primary-focus" v-for="fp in featurePaths">
        <div class="flex items-center gap-1">
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
            <v-list-item v-for="(userPath, i) in userPaths" :key="i">
              <router-link :to="userPath.path">
                <v-list-item-title>{{ userPath.title }}</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
  </div>
</template>
<style lang=""></style>
