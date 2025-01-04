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
    async handleSubmit() {
      if (this.formData.password !== this.formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      try {
        // Convert reactive data to plain object
        const formDataPlain = {
          fullName: this.formData.fullName,
          email: this.formData.email,
          password: this.formData.password,
        };

        const response = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataPlain), // Send plain object
        });

        const data = await response.json();
        if (response.ok) {
          alert("Sign-up successful! Please log in.");
          this.$router.push("/"); // Redirect to login
        } else {
          alert(data.message || "Sign-up failed!");
        }
      } catch (error) {
        console.error("Sign-up error:", error);
        alert("An error occurred during sign-up.");
      }
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
