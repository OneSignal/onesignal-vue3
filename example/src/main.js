import { createApp } from 'vue'
import App from './App.vue'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

createApp(App).use(OneSignalVuePlugin, {
  appId: "68e76706-41e1-4990-925b-8304c9a5deed",
  allowLocalhostAsSecureOrigin: true
}).mount('#app')
