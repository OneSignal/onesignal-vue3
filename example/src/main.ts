import { createApp } from 'vue';
import OneSignalVuePlugin from '@onesignal/onesignal-vue3';

import App from './App.vue';

createApp(App)
  .use(OneSignalVuePlugin, {
    appId: '<YOUR_APP_ID>',
    allowLocalhostAsSecureOrigin: true,
  })
  .mount('#app');
