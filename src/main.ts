import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

//- Vuetify
import "vuetify/styles";
import router from "./routes/app-rotues";
import "@mdi/font/css/materialdesignicons.min.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createPinia } from "pinia";
import { VueFire, VueFireAuth } from "vuefire";

import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { initializeApp } from "firebase/app";

import "@formkit/themes/genesis";
import { plugin, defaultConfig } from "@formkit/vue";
import { firebaseApp, firebaseConfig } from "./firebase.config";
import { useHotelState } from "./feature-store/hotelState";

const app = createApp(App);

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
});

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

app.use(pinia);
app.use(router);
app.use(plugin, defaultConfig);
app.use(vuetify);

router.isReady().then(() => {
  app.mount("#app");
});
