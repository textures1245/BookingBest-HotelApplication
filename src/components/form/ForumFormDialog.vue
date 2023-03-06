<script lang="ts">
import { PropType } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import Swal from "sweetalert2";
import {
  CurrentAccount,
  UserCollection,
  useAuthState,
} from "../../auth/authState";
import {
  ForumPost,
  ForumPostComment,
  useForumState,
} from "../../feature-store/forumState";
import { useHotelState } from "../../feature-store/hotelState";
import { Timestamp } from "@firebase/firestore";

export default {
  components: { QuillEditor },
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
      Toast,
      currentUser: useAuthState().getCurrAcc,
      forumState: useForumState(),
      hotelState: useHotelState(),
      rentedHotelHistoryState: useAuthState().getCurrAcc.rentalHistory,
    };
  },
  props: {
    action: {
      type: String as PropType<"ADD" | "EDIT">,
      required: true,
    },
    forumPostRefId: Number,
  },
  data() {
    return {
      formValue: {
        hSelectName: "",
        title: "",
        quillContent: "",
        rating: -1,
      },
      currentPostEditor: <ForumPost>{},
    };
  },
  mounted() {
    //- reset form values
  },
  methods: {
    onInitPostEditorState() {
      let getCurrentPostEditor = this.forumState.getForumPostState.find(
        (f) => f.forumPostId === this.forumPostRefId
      );

      //- initialize value in form
      if (getCurrentPostEditor) {
        this.formValue = {
          hSelectName: getCurrentPostEditor.hotelRef.name,
          title: getCurrentPostEditor.title,
          quillContent: getCurrentPostEditor.desc.replace(/<[^>]+>/g, ""),
          rating: getCurrentPostEditor.stars,
        };

        //set current post editor
        this.currentPostEditor = getCurrentPostEditor;
        console.log(this.currentPostEditor);
      }
    },

    onSubmitForm() {
      if (
        this.formValue.quillContent === "<p><br></p>" ||
        this.formValue.quillContent.length < 27 ||
        !this.formValue.title ||
        !this.formValue.hSelectName ||
        +this.formValue.rating === -1
      ) {
        this.Toast.fire({
          icon: "error",
          title:
            "กรุณากรอกข้อมูลให้ครบ (ลายละเอียดเกิน 20 ตัวอักษร, ตัวเลือกเห็นด้วย) ",
        });
        return;
      } else if (!this.currentUser) {
        this.Toast.fire({
          icon: "error",
          title: "กรุณายืนยันตนเพื่อ คอมเมนต์",
        });
        return;
      }

      let findHotelRef = this.hotelState.getHotelState.find(
        (h) => h.name === this.formValue.hSelectName
      );
      let forumValid = <ForumPost>{};
      if (findHotelRef) {
        forumValid = <ForumPost>{
          uId: this.currentPostEditor.uId || "",
          forumPostId: this.forumState.genId(),
          user: <UserCollection>this.currentUser,
          title: this.formValue.title,
          desc: this.formValue.quillContent,
          hotelRef: findHotelRef,
          comments: <ForumPostComment[]>this.currentPostEditor.comments || [],
          createdDate: Timestamp.now(),
          stars: this.formValue.rating,
        };
        if (this.action === "ADD") {
          this.forumState.onAddForumPost(forumValid).then((added) => {
            if (added) {
              this.Toast.fire({
                icon: "success",
                text: "ฟอรัมโพสต์ใหม่ได้ถูกเพิ่มเข้าเรียบร้อยแล้ว",
              });
            } else {
              this.Toast.fire({
                icon: "error",
                text: "แอคชั้นเพิ่มโพสต์ถูกยกเลิก",
              });
            }
          });
        } else {
          this.forumState
            .onEditForumPostAction(this.currentPostEditor.uId, forumValid)
            .then((edited) => {
              if (edited) {
                this.Toast.fire({
                  icon: "success",
                  text: "ฟอรัมโพสต์ได้ถูกอัปเดตเข้าเรียบร้อยแล้ว",
                });
              } else {
                this.Toast.fire({
                  icon: "error",
                  text: "แอคชั้นอัปเดตโพสต์ถูกยกเลิก",
                });
              }
            });
        }
        console.log(this.currentPostEditor.uId);
      }
    },
  },
};
</script>
<template>
  <v-dialog
    class="overflow-x-auto"
    transition="dialog-top-transition"
    width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        v-if="action === 'ADD'"
        prepend-icon="mdi-plus"
        variant="flat"
        color="primary"
        >เพิ่มฟอรัม</v-btn
      >
      <v-btn
        @click="onInitPostEditorState()"
        v-if="action === 'EDIT'"
        class="!bg-accent !text-accent-content"
        icon="mdi-book-edit-outline"
        size="small"
        v-bind="props"
      >
        <v-icon icon="mdi-book-edit-outline"></v-icon>
        <v-tooltip text="แก้ไข" activator="parent" location="bottom">
        </v-tooltip>
      </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card min-width="600">
        <v-toolbar
          color="primary"
          :title="action === 'ADD' ? 'เพิ่มฟอรัม' : 'แก้ไขฟอรัม'"
        ></v-toolbar>
        <v-card-text>
          <div class="flex flex-col gap-2">
            <FormKit
              placeholder="เลือกห้องพัก"
              v-model="formValue.hSelectName"
              type="select"
              label="เลือกห้องพักที่คุณเคยไปพัก"
              name="small_country"
              :options="
                rentedHotelHistoryState.map((rented) => rented.hotel.name)
              "
            />
            <FormKit
              v-model="formValue.title"
              type="text"
              label="เขียนชื่อเรื่องของคุณลงไป"
              value="calypso"
            />

            <label class="font-semibold ml-4">การให้คะแนนของคุณ</label>
            <v-rating
              v-model="formValue.rating"
              class="ma-2"
              color="yellow-darken-3"
              density="comfortable"
            ></v-rating>

            <label for="" class="font-semibold">ลายละเอียด</label>
            <QuillEditor
              class="!min-h-[400px]"
              contentType="html"
              v-model:content="formValue.quillContent"
              placeholder="โปรดกรอกข้อมูล"
              theme="snow"
            />
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="flat"
            color="primary"
            @click="[onSubmitForm(), (isActive.value = false)]"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
<style scoped>
.ql-container {
  min-height: inherit;
}
</style>
