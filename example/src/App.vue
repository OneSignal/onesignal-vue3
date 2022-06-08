<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// eslint-disable-next-line no-unused-vars
import OneSignal from '@onesignal/onesignal-vue3';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    this.$OneSignal.showSlidedownPrompt();
    this.$OneSignal.on("permissionPromptDisplay", (e) => {
      console.warn("permissionPromptDisplay", e)
    })
    this.$OneSignal.on("subscriptionChange", e => {
      console.warn("subscriptionChange", e);
    })
    this.$OneSignal.on("notificationDisplay", e => {
      console.warn("notificationDisplay", e);
    })
    this.$OneSignal.on("notificationDismiss", e => {
      console.warn("notificationDismiss", e);
    })
  }
}
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
