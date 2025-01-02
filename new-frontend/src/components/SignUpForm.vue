<template>
    <form class="signup-form" @submit.prevent="handleSubmit">
      <label for="fullName">Full Name:</label>
      <input
        type="text"
        id="fullName"
        v-model="formData.fullName"
        required
      />
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="formData.email"
        required
      />
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="formData.password"
        required
      />
      <label for="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="formData.confirmPassword"
        required
      />
      <button type="submit">Sign Up</button>
      <p>
        Already have an account? <a href="/">Log in here</a>.
      </p>
    </form>
  </template>
  
  <script>
  export default {
    name: "SignUpForm",
    data() {
      return {
        formData: {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      };
    },
    methods: {
      handleSubmit() {
        if (this.formData.password !== this.formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        console.log("Sign up data:", this.formData);
        // API call logic will go here
      },
    },
  };
  </script>
  
  <style scoped>
  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 300px;
  }
  
  .signup-form input {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .signup-form button {
    padding: 10px;
    background-color: #d8b4e2;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    color: #000;
    cursor: pointer;
  }
  </style>
  