<template>
  <img alt="UPME Logo" src="./assets/Logo_upme_nw.png">
  <CardBox msg="" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardBox from './components/CardBox.vue';

export default defineComponent({
  name: 'App',
  components: {
    CardBox
  }
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

img {
  width: 10%;
  height: auto;
}
</style>
