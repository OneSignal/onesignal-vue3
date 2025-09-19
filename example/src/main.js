import OneSignalVuePlugin from "@onesignal/onesignal-vue3";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App)
  .use(OneSignalVuePlugin, {
    appId: "77e32082-ea27-42e3-a898-c72e141824ef",
  })
  .mount("#app");
