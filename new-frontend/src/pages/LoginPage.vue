<template>
    <div class="login-page">
      <header class="login-header">
        <h1>Welcome to Reality League HQ</h1>
        <p>Please log in to continue</p>
      </header>
      <main>
        <LoginForm />
      </main>
    </div>
  </template>
  
  <script>
  import LoginForm from "../components/LoginForm.vue";
  
  export default {
    name: "LoginPage",
    components: {
      LoginForm,
    },
  };
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #000;
    color: #fff;
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  