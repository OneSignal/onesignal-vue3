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
    this.$OneSignal.User.PushSubscription.optIn();
    this.$OneSignal.Notification.addEventListener("permissionPromptDisplay", (e) => {
      console.warn("OneSignal.Notification:permissionPromptDisplay", e)
    })
    this.$OneSignal.User.PushSubscription.addEventListener("change", e => {
      console.warn("OneSignal.User.PushSubscription:change", e);
    })
    this.$OneSignal.Notification.addEventListener("foregroundWillDisplay", e => {
      console.warn("OneSignal.Notification.addEventListener:foregroundWillDisplay", e);
    })
    this.$OneSignal.Notification.addEventListener("dismiss", e => {
      console.warn("OneSignal.Notification:dismiss", e);
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
