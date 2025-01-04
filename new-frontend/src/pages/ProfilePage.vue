<template>
  <div class="profile-page">
    <h1>Your Profile</h1>
    <form @submit.prevent="updateProfile">
      <label for="displayName">Display Name:</label>
      <input
        type="text"
        id="displayName"
        v-model="profile.displayName"
        placeholder="Your display name"
      />

      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="profile.email"
        placeholder="Your email address"
        disabled
      />

      <button type="submit">Save Changes</button>
    </form>

    <h2>Change Password</h2>
    <form @submit.prevent="changePassword">
      <label for="currentPassword">Current Password:</label>
      <input
        type="password"
        id="currentPassword"
        v-model="passwordData.currentPassword"
        placeholder="Enter current password"
        required
      />

      <label for="newPassword">New Password:</label>
      <input
        type="password"
        id="newPassword"
        v-model="passwordData.newPassword"
        placeholder="Enter new password"
        required
      />

      <label for="confirmNewPassword">Confirm New Password:</label>
      <input
        type="password"
        id="confirmNewPassword"
        v-model="passwordData.confirmNewPassword"
        placeholder="Confirm new password"
        required
      />

      <button type="submit">Change Password</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      profile: {
        displayName: "Meagan",
        email: "meagan@realityhq.com",
      },
      passwordData: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
    };
  },
  methods: {
    updateProfile() {
      alert(`Profile updated: ${this.profile.displayName}`);
    },
    changePassword() {
      if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
        alert("New passwords do not match!");
        return;
      }
      console.log("Password Change Request:", this.passwordData);
      alert("Your password has been changed!");
      this.passwordData = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
    },
  },
};
</script>
  
  <style scoped>
  .profile-page {
    padding: 20px;
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }
  
  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    padding: 10px;
    background-color: #d8b4e2;
    border: none;
    border-radius: 5px;
    color: #000;
    cursor: pointer;
  }
  </style>
  