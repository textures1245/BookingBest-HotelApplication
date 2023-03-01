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

import { initializeApp } from "firebase/app";

import "@formkit/themes/genesis";
import { plugin, defaultConfig } from "@formkit/vue";
import { firebaseConfig } from "./firebase.config";

initializeApp(firebaseConfig);

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .use(plugin, defaultConfig)
  .mount("#app");
