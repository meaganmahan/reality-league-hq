<template>
  <div class="forgot-password-page">
    <h1>Forgot Your Password?</h1>
    <form @submit.prevent="requestReset">
      <label for="email">Email Address:</label>
      <input
        type="email"
        id="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />
      <button type="submit">Send Reset Link</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ForgotPasswordPage",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async requestReset() {
      try {
        const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email }),
        });

        if (response.ok) {
          alert("A reset link has been sent to your email!");
          this.$router.push("/");
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error("Error requesting reset:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-page {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  background-color: #d8b4e2;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: #000;
  cursor: pointer;
}

button:hover {
  background-color: #c89edb;
}
</style>
