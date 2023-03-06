<script lang="ts">
// @ts-nocheck
import { useHotelState, Hotel } from "../../feature-store/hotelState";
import ForumViewCard from "../../components/ForumViewCard.vue";
import ForumFormDialog from "../../components/form/ForumFormDialog.vue";
import { useForumState } from "../../feature-store/forumState";
import StateNotFound from "../../components/StateNotFound.vue";
import { useAuthState } from "../../auth/authState";
import { Ref, ref } from "vue";
import { watch, computed } from "vue";
export default {
  components: {
    ForumViewCard,
    ForumFormDialog,
    StateNotFound,
  },
  setup() {
    // i want to force userOwner to update when state in pinia changes
    const forumState = ref(useForumState().getForumPostState);
    const currAccount = ref(useAuthState().getCurrAcc);

    // Define a computed property to filter the forum state for the current user
    const userOwnerForumState = computed(() => {
      return forumState.value.filter(
        (f) => f.user.email === currAccount.value.email
      );
    });

    // Watch for changes in the forum state and update the userOwnerForumState

    watch(forumState, (newValue, oldValue) => {
      userOwnerForumState.value = newValue.filter(
        (f) => f.user.email === currAccount.value.email
      );
    });

    return { forumState, userOwnerForumState, currAccount };
  },
  data() {
    return { onSelectHotelName: null };
  },
  watch: {
    onSelectHotelName(v) {
      console.log(v);
    },
  },
};
</script>
<template>
  <div class="my-4">
    <div class="flex justify-evenly items-center mx-auto">
      <article class="prose">
        <h1>ยินดีต้อนรับสู่บอร์ดฟอรัมของคุณ</h1>
        <p class="indent-10">
          บอร์ดฟอรัมรีวิวที่เป็นของผู้ใช้ของเราช่วยให้คุณควบคุมรีวิวโรงแรมของคุณได้อย่างสมบูรณ์
          - แก้ไข เพิ่ม อัปเดต หรือลบได้ทุกเมื่อ
          แบ่งปันประสบการณ์ของคุณกับโลกวันนี้!
        </p>
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_4bqzai4k.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          loop
          autoplay
        ></lottie-player>
      </article>
    </div>
    <hr class="my-4" />
    <v-toolbar class="bg-secondary-content !text-secondary" rounded>
      <template v-slot:prepend>
        <div class="!z-10 text-white">
          <ForumFormDialog action="ADD"></ForumFormDialog>
        </div>
      </template>
      <template v-slot:append>
        <div class="!z-10 text-white">
          <v-chip prepend-icon="mdi-plus" color="primary"
            >{{ userOwnerForumState.length }} รายการฟอรัมที่คุณมี</v-chip
          >
        </div>
      </template>
    </v-toolbar>
    <div v-if="userOwnerForumState.length < 1 || !userOwnerForumState">
      <StateNotFound></StateNotFound>
    </div>
    <div v-else class="my-4">
      <div v-for="forum in userOwnerForumState">
        <ForumViewCard action="OWNER" :forum-prop="forum"></ForumViewCard>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
