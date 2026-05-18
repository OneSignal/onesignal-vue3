<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue 3 OneSignal App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  mounted() {
    this.$OneSignal.User.PushSubscription.optIn();
    this.$OneSignal.Notifications.addEventListener(
      'permissionPromptDisplay',
      () => {
        console.warn('OneSignal.Notifications:permissionPromptDisplay');
      },
    );
    this.$OneSignal.User.PushSubscription.addEventListener('change', (e) => {
      console.warn('OneSignal.User.PushSubscription:change', e);
    });
    this.$OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (e) => {
        console.warn(
          'OneSignal.Notifications:foregroundWillDisplay',
          e,
        );
      },
    );
    this.$OneSignal.Notifications.addEventListener('dismiss', (e) => {
      console.warn('OneSignal.Notifications:dismiss', e);
    });
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
