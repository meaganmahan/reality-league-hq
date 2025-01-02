<template>
    <form class="login-form" @submit.prevent="handleSubmit">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        required
      />
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        required
      />
      <button type="submit">Log In</button>
      <p>
        Don’t have an account? <a href="/signup">Sign up here</a>.
      </p>
    </form>
  </template>
  
  <script>
  export default {
    name: "LoginForm",
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      handleSubmit() {
        console.log("Login attempt:", { email: this.email, password: this.password });
        // Add authentication logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .login-form input {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .login-form button {
    padding: 10px;
    background-color: #d8b4e2;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    color: #000;
    cursor: pointer;
  }
  
  .login-form p {
    text-align: center;
    margin-top: 10px;
  }
  </style>
  