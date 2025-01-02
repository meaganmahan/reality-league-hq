<template>
    <div class="signup-page">
      <header class="signup-header">
        <h1>Create Your Account</h1>
        <p>Join Reality League HQ to get started!</p>
      </header>
      <main>
        <SignUpForm />
      </main>
    </div>
  </template>
  
  <script>
  import SignUpForm from "../components/SignUpForm.vue";
  
  export default {
    name: "SignUpPage",
    components: {
      SignUpForm,
    },
  };
  </script>
  
  <style scoped>
  .signup-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #000;
    color: #fff;
  }
  
  .signup-header {
    text-align: center;
    margin-bottom: 20px;
  }
  </style>
  