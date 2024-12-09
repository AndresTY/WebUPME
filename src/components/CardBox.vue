<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ModelForm/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModelForm from './ModelForm.vue';

export default defineComponent({
  name: 'CardBox',
  components:{
    ModelForm
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
