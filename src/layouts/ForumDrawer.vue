<script lang="ts">
import { usePathState } from "../shared-store/pathState";
import { useAuthState } from "../auth/authState";
export default {
  setup() {
    const drawerPaths = [
      {
        icon: "mdi-forum-outline",
        title: "บอร์ดฟอรัม",
        path: "/hotel-broad-forum/forum-view",
      },
      {
        icon: "mdi-folder-account-outline",
        title: "บอร์ดฟอรัมของฉัน",
        path: "/hotel-broad-forum/user-owner-forum-list",
      },
    ];
    return { drawerPaths, currentUser: useAuthState().currAccount };
  },
};
</script>
<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        image="https://img.freepik.com/free-vector/blue-curve-frame-template-vector_53876-165860.jpg?w=740&t=st=1677975040~exp=1677975640~hmac=942351c8de27907ec6d4b9bb243fcd0e3f3b43b94853ade8f13d17f7fa7b869e"
        elevation="4"
        rail
        permanent
        expand-on-hover
        location="left"
      >
        <template v-slot:prepend>
          <v-list-item
            lines="two"
            :title="currentUser.email.split('@')[0]"
            :subtitle="`เป็นสมาชิกตั้งแต่ ${new Date().toDateString()}`"
          >
            <template v-slot:prepend>
              <v-avatar
                size="26"
                class="!bg-primary-focus text-primary-content"
              >
                <v-icon icon="mdi-account-badge"></v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </template>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            v-for="p in drawerPaths"
            :to="p.path"
            :exact="true"
            :active="false"
            :prepend-icon="p.icon"
            :title="p.title"
            value="home"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <slot name="main"> </slot>
    </v-layout>
  </v-card>
</template>
<style lang=""></style>
