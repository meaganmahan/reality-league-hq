<template>
  <div>
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Footer,
  },
};
</script>

<style>
/* Add global styles here if needed */
<style>
body {
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.site-footer {
  margin-top: auto;
}
</style>

