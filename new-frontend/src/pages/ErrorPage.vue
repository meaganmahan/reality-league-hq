<template>
  <div class="error-page">
    <h1>Oops!</h1>
    <p>The page you're looking for doesn't exist or an error occurred.</p>
    <router-link to="/">Go back to the homepage</router-link>
  </div>
</template>

<style scoped>
.error-page {
  text-align: center;
  padding: 50px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

a {
  color: #d8b4e2;
  text-decoration: underline;
}

a:hover {
  color: #c89edb;
}
</style>
