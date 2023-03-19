<script lang="ts">
import UserDrawer from "../layouts/UserBookDrawer.vue";
export default {
  components: { UserDrawer },
};
</script>
<template>
  <div>
    <UserDrawer>
      <template #main>
        <v-main class="w-full flex">
          <v-container>
            <div class="h-screen overflow-y-auto">
              <router-view></router-view>
            </div>
          </v-container>
        </v-main>
      </template>
    </UserDrawer>
  </div>
</template>
<style lang=""></style>
