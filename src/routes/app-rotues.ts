import {
  RouteRecordRaw,
  createRouter,
  createWebHistory,
  RouterOptions,
  createWebHashHistory,
} from "vue-router";

import { pinia } from "../shared-store/appStore";
import { Path, usePathState } from "../shared-store/pathState";

const pathStore = usePathState(pinia);
const featuresRoutes = pathStore.$state.featurePaths;
const usrRoutes = pathStore.$state.userPaths;

const fRoutes = featuresRoutes.map((r) => ({
  path: r.path,
  name: r.name,
  component: () =>
    Promise.resolve(r.component || import("../components/NotFoundApp.vue")),
}));

const userRoutes = usrRoutes.map((r) => ({
  path: r.path,
  name: r.name,
  component: () =>
    Promise.resolve(r.component || import("../components/NotFoundApp.vue")),
}));

export const customRoutes = [
  {
    name: "overview",
    path: "/app-overview",
    component: () => import("../features/OverviewApp.vue"),
  },
];

const routes = [...customRoutes, ...userRoutes, ...fRoutes];
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    return next("/app-overview");
  }
  next();
});

export default router;
