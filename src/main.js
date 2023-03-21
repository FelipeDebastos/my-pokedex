import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify();

createApp(App).use(router).use(vuetify).mount("#app");
