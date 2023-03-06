import { defineStore } from "pinia";
import { defineAsyncComponent, markRaw } from "vue";

export type Path = {
  icon?: string;
  title?: string;
  name: string;
  path: string;
  component?: Function;
  children?: {
    path: string;
    component: Function;
  }[];
};

export const usePathState = defineStore("pathState", {
  state: () => {
    return {
      userPaths: <Path[]>[
        {
          icon: "mdi-account",
          name: "signIn",
          title: "เข้าสู่ระบบ",
          path: "/sign-in",
          component: markRaw(
            defineAsyncComponent(async () => import("../auth/LoginApp.vue"))
          ),
        },
        {
          icon: "mdi-account",
          name: "signUp",
          title: "ลงทะเบียน",
          path: "/sign-up",
          component: markRaw(
            defineAsyncComponent(() => import("../auth/SignupApp.vue"))
          ),
        },
      ],
      featurePaths: <Path[]>[
        {
          icon: "mdi-home-city-outline",
          name: "hotelList",
          title: "ห้องพัก",
          path: "/hotel-list",
          component: markRaw(
            defineAsyncComponent(() => import("../features/HotelListApp.vue"))
          ),
        },
        {
          icon: "mdi-bookmark-box-multiple-outline",
          name: "bookList",
          title: "บันทึกรายการ",
          path: "/hotel-book-list",
          component: markRaw(
            defineAsyncComponent(
              () => import("../features/BookListRecordApp.vue")
            )
          ),
        },

        {
          icon: "mdi-forum-outline",
          name: "Forum",
          title: "ฟอรัม",
          path: "/hotel-broad-forum",
          component: markRaw(
            defineAsyncComponent(
              () => import("../features/BoardForumApp.vue")
            )
          ),
        },
      ],
    };
  },
  getters: {},
  actions: {},
});
