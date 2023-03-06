<script lang="ts">
import { PropType } from "vue";
import { Hotel } from "../feature-store/hotelState";
import ForumFormDialog from "./form/ForumFormDialog.vue";
import { ForumPost, useForumState } from "../feature-store/forumState";
import Swal from "sweetalert2";

export default {
  components: { ForumFormDialog },
  props: {
    action: {
      type: String as PropType<"VIEW" | "OWNER">,
      required: true,
    },
    forumProp: {
      type: Object as PropType<ForumPost>,
      required: true,
    },
  },
  methods: {
    reviewOrder(rating: number): string {
      let order = "";
      switch (rating) {
        case 0:
        case 1:
          order = "แย่";
          break;
        case 2:
        case 3:
          order = "ปานกลาง";
          break;
        case 4:
          order = "ดี";
          break;
        case 5:
          order = "ดีมาก";
          break;
        default:
          order = "ดี";
          break;
      }
      return order;
    },

    onRemoveForum() {
      Swal.fire({
        icon: "warning",
        title: "คุณแน่ใจหรือไม่ว่าต้องการลบฟอรัมนี้ออก?",
        showDenyButton: true,
        confirmButtonText: "ใช่",
        denyButtonText: `ไม่`,
        footer:
          '<a  class="!text-underline !text-error text-center">เมื่อทำการลบฟอรัมแล้วข้อมูลทั้งหมดรวมถึงส่วนคอมเมนต์จะไม่สามารถกู้คืนได้</a>',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          useForumState()
            .onDeleteForumPosteAction(this.forumProp.uId)
            .then((isDeleted) => {
              if (isDeleted) {
                Swal.fire("ฟอรัมของคุมที่ลบเรียบร้อยแล้ว", "", "success");
              }
            });
        } else if (result.isDenied) {
          Swal.fire("การลบฟอรัมถูกยกเลิกแล้ว", "", "info");
        }
      });
    },
  },
};
</script>
<template>
  <v-card
    class="my-10"
    :class="' max-h-[600px] lg:!min-h-[200px] lg:!max-h-[200px]'"
  >
    <div class="grid lg:grid-cols-6">
      <div class="md:col-span-2 bg-base-200">
        <v-carousel
          cycle
          hide-delimiter-background
          :hide-delimiters="true"
          height="190"
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(slide, i) in forumProp.hotelRef.imgUrls"
            :key="i"
          >
            <v-img cover sizes="100" class="!h-full mt-1" :src="slide"></v-img>
          </v-carousel-item>
        </v-carousel>
      </div>
      <v-card class="lg:col-span-3 !rounded-none">
        <div class="grid lg:grid-rows-3 gap-1">
          <v-card-text :border="false" class="row-span-2">
            <div id="topic">
              <h1 class="text-xl font-semibold">
                {{ forumProp.title }}
              </h1>
              <v-chip size="x-small" class="mr-1" prepend-icon="mdi-home"
                >{{ forumProp.hotelRef.name }}
              </v-chip>
              <v-chip size="x-small" prepend-icon="mdi-map-marker"
                >{{ forumProp.hotelRef.address.district }},
                {{ forumProp.hotelRef.address.subDistrict }}</v-chip
              >
              <div class="!break-words">
                <p
                  v-html="forumProp.desc"
                  class="flex indent-4 text-[13px] !break-words min-w-[10px] breaks"
                ></p>
              </div>
            </div>
          </v-card-text>
          <v-toolbar class="row-span-1">
            <v-toolbar-title>
              <div class="flex items-center gap-2">
                <v-icon icon="mdi-account-circle"></v-icon>
                <div class="flex flex-col gap-0.5">
                  <p class="!text-xs">
                    {{ forumProp.user.email.split("@")[0] }}
                  </p>
                  <div class="flex">
                    <v-chip size="small" density="comfortable" class="text-xs"
                      >ผู้เขียน</v-chip
                    >
                  </div>
                </div>
              </div>
            </v-toolbar-title>
            <div class="text-end mr-2">
              <v-chip
                size="small"
                density="comfortable"
                append-icon="mdi-account-supervisor-circle"
                >462 จำนวนผู้อ่าน</v-chip
              >
              <v-chip
                size="small"
                density="comfortable"
                class="flex md:mb-2 lg:mb-0 text-xs"
              >
                สร้างเมื่อ {{ forumProp.createdDate.toDate().toDateString() }}
              </v-chip>
            </div>
          </v-toolbar>
        </div>
      </v-card>
      <v-card
        class="!rounded-none !justify-center md:!justify-end items-center !flex md:!grid md:!grid-rows-2"
      >
        <div class="m-2 flex justify-end gap-1">
          <v-tooltip v-if="action === 'OWNER'" text="ลบ" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                @click="() => onRemoveForum()"
                class="!bg-error text-error-content"
                icon="mdi-delete-empty"
                size="small"
                v-bind="props"
              >
              </v-btn>
            </template>
          </v-tooltip>
          <ForumFormDialog
            v-if="action === 'OWNER'"
            :forum-post-ref-id="forumProp.forumPostId"
            action="EDIT"
          ></ForumFormDialog>
          <v-tooltip text="ดู" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                :to="`/hotel-broad-forum/forum-view/${forumProp.uId}`"
                class="!bg-secondary text-secondary-content"
                icon="mdi-eye"
                size="small"
                v-bind="props"
              >
              </v-btn>
            </template>
          </v-tooltip>
        </div>
        <div class="md:place-self-end m-4 md:m-2 mr-2">
          <p class="flex justify-center md:justify-end text-2xl text-semibold">
            {{ reviewOrder(forumProp.stars) }}
          </p>
          <v-rating
            readonly
            v-model="forumProp.stars"
            size="small"
            density="compact"
          ></v-rating>
        </div>
      </v-card>
    </div>
  </v-card>
</template>
<style scoped>
.breaks > p {
  overflow-wrap: break-word;
}
</style>
