<template>
    <div class="reset-password-page">
      <h1>Reset Your Password</h1>
      <form @submit.prevent="resetPassword">
        <label for="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          v-model="formData.newPassword"
          placeholder="Enter new password"
          required
        />
  
        <label for="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="formData.confirmPassword"
          placeholder="Confirm new password"
          required
        />
  
        <button type="submit">Reset Password</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "ResetPasswordPage",
    data() {
      return {
        formData: {
          newPassword: "",
          confirmPassword: "",
        },
        token: this.$route.query.token,
      };
    },
    methods: {
      async resetPassword() {
        if (this.formData.newPassword !== this.formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:3000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: this.token,
              newPassword: this.formData.newPassword,
            }),
          });
  
          if (response.ok) {
            alert("Password reset successfully!");
            this.$router.push("/");
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error("Error resetting password:", error);
          alert("An error occurred. Please try again.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .reset-password-page {
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
  