<script lang="ts">
import ForumDrawer from "../layouts/ForumDrawer.vue";
export default {
  components: { ForumDrawer },
};
</script>
<template>
  <div>
    <ForumDrawer>
      <template #main>
        <v-main class="w-full flex justify-center">
          <v-container>
            <div class="h-screen overflow-y-auto">
              <router-view></router-view>
            </div>
          </v-container>
        </v-main>
      </template>
    </ForumDrawer>
  </div>
</template>
<style lang=""></style>
