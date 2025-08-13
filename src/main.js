import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import AppButton from "./components/AppButton.vue";

import "./assets/app.css";

import App from "./App.vue";

const app =createApp(App)
app.use(createPinia())
app.use(router)
app.component("AppButton", AppButton);
app.mount("#app");
