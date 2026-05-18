<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Edit <code>src/App.vue</code> and save to reload.<br />
      Replace <code>&lt;YOUR_APP_ID&gt;</code> in <code>src/main.ts</code> with
      your OneSignal app id.
    </p>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3 Docs</a>
      </li>
      <li>
        <a href="https://vitejs.dev" target="_blank" rel="noopener">Vite</a>
      </li>
      <li>
        <a
          href="https://documentation.onesignal.com/docs/web-push-quickstart"
          target="_blank"
          rel="noopener"
          >OneSignal Web Push</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
