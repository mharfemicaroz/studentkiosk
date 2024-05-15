import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.config.globalProperties = {
  API_URL: `http://${window.location.hostname}:8081/api/`,
};

app.use(router);
app.use(createPinia());

app.mount("#app");
