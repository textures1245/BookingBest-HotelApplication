<script lang="ts">
import { onMounted, ref } from "vue";
import ImageCarouselCard from "../../components/ImageCarouselCard.vue";
import { ForumPost } from "../../feature-store/forumState";
import { Hotel, useHotelState } from "../../feature-store/hotelState";
import Swal from "sweetalert2";
import { QuillEditor } from "@vueup/vue-quill";
import { Account, useAuthState } from "../../auth/authState";
import {
  useForumState,
  ForumPostComment,
} from "../../feature-store/forumState";
import { Timestamp } from "@firebase/firestore";
import LoadingProps from "../../components/LoadingProps.vue";

export default {
  components: {
    ImageCarouselCard,
    QuillEditor,
    LoadingProps,
  },
  setup() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    return {
      forumState: <ForumPost[]>useForumState().getForumPostState,
      Toast,
      currentUser: useAuthState().currAccount,
    };
  },
  data() {
    return {
      onLoadedProp: true,
      forumProp: <ForumPost>{},
      breadcrumbItems: [{}],
      agreement: {
        no: 0,
        yes: 0,
      },
      //- comment v-model props
      isAgreed: "",
      quillContent: ref(""),
    };
  },
  computed: {
    reviewOrder(): string {
      let order = "";
      switch (this.forumProp.stars) {
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
  },
  mounted() {
    this.loadedForumDetailProps();
    // const { notAgreed, Agreed } = this.getAmountOfAgreement();
    // this.agreement = {
    //   no: notAgreed,
    //   yes: Agreed,
    // };
  },
  methods: {
    loadedForumDetailProps() {
      this.onLoadedProp = true;
      const forumUId = this.$route.params.id;
      if (!forumUId) {
        this.Toast.fire({
          icon: "error",
          title: "ไม่ตรวจเจอเลขที่ระบุไว้",
        });
        return;
      }

      const findForumByUId = <ForumPost>(
        this.forumState.find((f) => f.uId === forumUId)
      );
      new Promise((r) => setTimeout(r, 1000)).then(() => {
        if (!findForumByUId) {
          this.Toast.fire({
            icon: "error",
            title: "ไม่ค้นพบหมายเลขฟอรํมที่คุณต้องการหา",
          });
          return;
        }

        this.forumProp = findForumByUId;
        this.breadcrumbItems = [
          {
            title: "บอร์ดฟอรัม",
            disabled: false,
          },
          {
            title: `จากที่อยู่อ้างอิง "${this.forumProp.hotelRef.address.district}"`,
            disabled: false,
          },
          {
            title: this.forumProp.hotelRef.name,
            disabled: true,
          },
        ];
        this.onLoadedProp = false;
      });
    },

    // getAmountOfAgreement() {
    //   let notAgreed = 0;
    //   let Agreed = 0;

    //   this.forumProp.comments.forEach((fc) => {
    //     fc.isAgreed ? Agreed++ : notAgreed++;
    //   });

    //   return { notAgreed, Agreed };
    // },

    async onPostComment() {
      if (
        this.quillContent === "<p><br></p>" ||
        this.quillContent.length < 17 ||
        !this.isAgreed
      ) {
        this.Toast.fire({
          icon: "error",
          title:
            "กรุณากรอกข้อมูลให้ครบ (ความคิดเห็นเกิน 10 ตัวอักษร, ตัวเลือกเห็นด้วย) ",
        });
        return;
      } else if (!this.currentUser) {
        this.Toast.fire({
          icon: "error",
          title: "กรุณายืนยันตนเพื่อ คอมเมนต์",
        });
        return;
      }

      let commentValid = <ForumPostComment>{
        forumPostRefId: this.forumProp.hotelRef.hotelId,
        user: this.currentUser,
        comment: this.quillContent,
        isAgreed: this.isAgreed === "เห็นด้วย" ? true : false,
        createdDate: Timestamp.now(),
      };

      await useForumState()
        .onPushCommentForum(this.forumProp.uId, commentValid)
        .then((isPost) => {
          if (isPost) {
            this.Toast.fire({
              icon: "success",
              text: "ความคิดเห็นของคุณถูกเพิ่มเรียบร้อยแล้ว",
            });
            (this.isAgreed = ""), (this.quillContent = "");
          } else {
            this.Toast.fire({
              icon: "error",
              text: "ล้มเหลวในการแสดงความคิดห็น",
            });
          }
        });
    },
  },
};
</script>
<template>
  <LoadingProps class="h-screen" v-if="onLoadedProp"></LoadingProps>
  <div v-else class="">
    <v-btn
      :to="`/hotel-list/${forumProp.hotelRef.hotelId}`"
      class="!absolute !top-15 !right-10 !z-10 bg-primary"
      >เยี่ยมชมหอพักนี้</v-btn
    >
    <v-breadcrumbs class="text-sm" :items="breadcrumbItems">
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
    <ImageCarouselCard
      :img-urls="forumProp.hotelRef.imgUrls"
    ></ImageCarouselCard>

    <section class="my-5">
      <v-card min-height="500" class="w-auto overflow-x-auto !grid grid-rows-4">
        <div class="row-span-1">
          <v-toolbar>
            <template v-slot:append>
              <div class="flex flex-col items-center mt-1">
                <p class="-mb-3">{{ reviewOrder }}</p>
                <v-rating
                  readonly
                  color="yellow-darken-3"
                  v-model="forumProp.stars"
                  class="ma-2"
                  density="compact"
                ></v-rating>
              </div>
            </template>
            <template v-slot:title>
              <h1 class="text-sm md:text-lg">
                {{
                  `การรีวิวนี้ถูกอ้างอิงจาก &quot;${forumProp.hotelRef.name}&quot;`
                }}
              </h1>
            </template>
          </v-toolbar>
        </div>
        <v-card-text class="!row-span-3 !place-content-center">
          <article class="prose prose-sm ml-10 -mt-5">
            <h1>{{ forumProp.title }}</h1>
            <blockquote v-html="forumProp.desc"></blockquote>
          </article>
        </v-card-text>
        <v-toolbar class="row-span-1">
          <v-toolbar-title>
            <div class="flex items-center gap-2">
              <v-icon icon="mdi-account-circle"></v-icon>
              <div class="flex flex-col gap-0.5">
                <p class="!text-xs">{{ forumProp.user.email.split("@")[0] }}</p>
                <div class="flex gap-2">
                  <v-chip size="small" density="comfortable" class="text-xs"
                    >ผู้เขียน</v-chip
                  >
                  <v-chip size="small" density="comfortable" class="text-xs">
                    เป็นสมาชิกตั้งแต่ {{ new Date().toDateString() }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-toolbar-title>
          <div class="text-end mr-2">
            <v-chip size="small" append-icon="mdi-account-supervisor-circle"
              >462 จำนวนผู้อ่าน</v-chip
            >
            <v-chip
              size="x-small"
              append-icon="mdi-clock-outline"
              class="flex text-xs text-end mt-1"
            >
              เขียนเมื่อ {{ forumProp.createdDate.toDate().toLocaleString() }}
            </v-chip>
          </div>
        </v-toolbar>
      </v-card>
    </section>

    <!--- comments input-->
    <section class="my-12" id="comment-section">
      <div class="mb-2 flex">
        <div>
          <h1 class="text-2xl">แสดงความคิดเห็น</h1>
          <p>จำนวนผู้แสดงความคิดเห็น {{ forumProp.comments.length }} คน</p>
        </div>
      </div>
      <hr />
    </section>
    <v-card elevation="6" class="">
      <v-toolbar class="!bg-primary-content text-black row-span-1">
        <v-toolbar-title>
          <div class="flex items-center gap-2">
            <v-icon size="large" icon="mdi-account-circle"></v-icon>
            <div class="flex flex-col gap-0.5">
              <p class="!text-xs">{{ currentUser?.email.split("@")[0] }}</p>
              <div class="flex gap-2">
                <v-chip size="small" density="comfortable" class="text-xs"
                  >เขียนคอนเม้นในฐานะผู้ใช้นี้</v-chip
                >
              </div>
            </div>
          </div>
        </v-toolbar-title>
        <div class="text-end w-40 h-full">
          <v-select
            :class="{
              'bg-success': isAgreed == 'เห็นด้วย',
              '!bg-error text-white': isAgreed == 'ไม่เห็นด้วย',
            }"
            hint="โปรดเลือก"
            placeholder="โปรดเลือก"
            v-model="isAgreed"
            label="เลือกแสดงความคิดเห็น"
            :items="['เห็นด้วย', 'ไม่เห็นด้วย']"
          ></v-select>
        </div>
      </v-toolbar>
      <!--- if value is <p><br></p> then the value is empty -->
      <QuillEditor
        class="!min-h-[200px]"
        contentType="html"
        v-model:content="quillContent"
        placeholder="โปรดกรอกข้อมูล"
        theme="snow"
      />
    </v-card>
    <v-btn
      class="!bg-primary text-primary-content mt-2 float-right"
      @click="() => onPostComment()"
      >ยินยัน</v-btn
    >

    <!--- comments list -->
    <div v-for="fc in forumProp.comments" class="flex flex-col w-full my-20">
      <div class="">
        <v-toolbar class="row-span-1">
          <v-toolbar-title>
            <div class="flex items-center gap-2">
              <v-icon size="large" icon="mdi-account-circle"></v-icon>
              <div class="flex flex-col gap-0.5">
                <p class="!text-xs">{{ fc.user.email.split("@")[0] }}</p>
                <div class="flex gap-2">
                  <v-chip
                    prepend-icon="mdi-account"
                    size="small"
                    density="comfortable"
                    class="text-xs"
                    >สมาชิกแสดงความคิดเห็น</v-chip
                  >
                  <v-chip
                    prepend-icon="mdi-clock-outline"
                    size="small"
                    density="comfortable"
                    class="text-xs"
                  >
                    แสดงความคิดเห็นเมื่อ
                    {{ fc.createdDate.toDate().toLocaleString() }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-toolbar-title>
          <div class="text-end h-full">
            <v-btn
              :border="false"
              :class="{
                'bg-success': fc.isAgreed,
                'bg-error ': !fc.isAgreed,
              }"
              variant="flat"
              class="rounded-0 flex items-center h-full"
              >{{ fc.isAgreed ? "เห็นด้วย" : "ไม่เห็นด้วย" }}</v-btn
            >
          </div>
        </v-toolbar>
        <v-card elevation="2" min-height="200" border="12">
          <v-card-text>
            <article class="prose prose-sm">
              <blockquote v-html="fc.comment"></blockquote>
            </article>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>

  <!--- text editor -->
</template>
<style scoped>
.ql-container {
  min-height: inherit;
}
</style>
