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
        <br />
        <a href="/forgot-password">Forgot your password?</a>
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
    async handleSubmit() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Login successful!");
          localStorage.setItem("token", data.token); // Save the token
          this.$router.push("/dashboard"); // Redirect to the dashboard
        } else {
          alert(data.message || "Login failed!");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
      }
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
  