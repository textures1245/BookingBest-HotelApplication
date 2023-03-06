import {
  RouteRecordRaw,
  createRouter,
  createWebHistory,
  RouterOptions,
  createWebHashHistory,
} from "vue-router";

import { pinia } from "../shared-store/appStore";
import { Path, usePathState } from "../shared-store/pathState";
import { useAuthState } from "../auth/authState";
import { getCurrentUser } from "vuefire";

const pathStore = usePathState(pinia);
const featuresRoutes = pathStore.$state.featurePaths;
const usrRoutes = pathStore.$state.userPaths;

const fRoutes = featuresRoutes.map((r) => ({
  path: r.path,
  name: r.name,
  component: () =>
    Promise.resolve(r.component || import("../components/NotFoundApp.vue")),
  meta: { requiresAuth: true },
  // children: () =>
  //   r.children !== undefined
  //     ? r.children.map((childPath) => ({
  //         path: childPath.path,
  //         component: () =>
  //           Promise.resolve(
  //             childPath.component || import("../components/NotFoundApp.vue")
  //           ),
  //       }))
  //     : [], // add empty array if no children are present to avoid errors
}));

const userRoutes = usrRoutes.map((r) => ({
  path: r.path,
  name: r.name,
  component: () =>
    Promise.resolve(r.component || import("../components/NotFoundApp.vue")),
  meta: { requiresAuth: false },
}));

export const customRoutes = [
  {
    name: "overview",
    path: "/app-overview",
    component: () => import("../features/OverviewApp.vue"),
    meta: { requiresAuth: true },
  },
  {
    name: "hotel-detail",
    path: "/hotel-list/:id",
    component: () => import("../features/HotelDetailApp.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/hotel-book-list",
    component: () => import("../features/BookListRecordApp.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "my-history-list",
        component: () =>
          import("../features/book-list-record-app/HistoryBookListApp.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "my-book-hotel-list",
        component: () =>
          import("../features/book-list-record-app/HotelBookingListApp.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/hotel-broad-forum",
    component: () => import("../features/BoardForumApp.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "forum-view",
        component: () =>
          import("../features/forum-component-app/ForumViewApp.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "forum-view/:id",
        component: () =>
          import("../features/forum-component-app/ForumDetailApp.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "forum-create",
        component: () =>
          import("../features/forum-component-app/ForumCreateApp.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "user-owner-forum-list",
        component: () =>
          import("../features/forum-component-app/UserOwnerForumListApp.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const routes = [...customRoutes, ...userRoutes, ...fRoutes];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

let isFirstInitials = false;
router.beforeEach(async (to, from, next) => {
  if (!isFirstInitials) {
    isFirstInitials = true;
    return next("/app-overview");
  }

  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return next("/sign-in");
    }
  }
  if (to.matched.length === 0) {
    return next("/app-overview");
  }
  next();
});

export default router;
