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
