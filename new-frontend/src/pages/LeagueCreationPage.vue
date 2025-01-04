<template>
  <div class="league-creation-page">
    <h1>Create a New League</h1>
    <form @submit.prevent="handleSubmit">
      <label for="leagueName">League Name:</label>
      <input type="text" id="leagueName" v-model="formData.leagueName" required />

      <label for="leagueType">League Type:</label>
      <select id="leagueType" v-model="formData.leagueType" required>
        <option value="" disabled>Select a league type</option>
        <option value="single">Single Franchise</option>
        <option value="super">Super League (Multiple Franchises)</option>
      </select>

      <div v-if="formData.leagueType === 'single'">
        <label for="franchise">Franchise:</label>
        <select id="franchise" v-model="formData.franchises" required>
          <option
            v-for="franchise in franchises"
            :key="franchise.franchiseId"
            :value="franchise.franchiseId"
          >
            {{ franchise.franchiseName }}
          </option>
        </select>
      </div>

      <div v-if="formData.leagueType === 'super'">
        <label for="franchises">Select Franchises:</label>
        <div v-for="franchise in franchises" :key="franchise.franchiseId">
          <input
            type="checkbox"
            :id="franchise.franchiseId"
            :value="franchise.franchiseId"
            v-model="formData.franchises"
          />
          <label :for="franchise.franchiseId">{{ franchise.franchiseName }}</label>
        </div>
      </div>

      <button type="submit">Create League</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      franchises: [], // Dynamically loaded franchises
      formData: {
        leagueName: "",
        leagueType: "",
        franchises: [],
      },
    };
  },
  async created() {
    try {
      const response = await fetch("http://localhost:3000/api/franchises");
      if (response.ok) {
        this.franchises = await response.json(); // Populate the franchises
        console.log("Franchises loaded:", this.franchises); // Debug log
      } else {
        console.error("Failed to fetch franchises");
      }
    } catch (err) {
      console.error("Error fetching franchises:", err);
    }
  },
  methods: {
    async handleSubmit() {
      if (!this.formData.leagueName || !this.formData.leagueType) {
        alert("Please fill out all required fields.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/leagues/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`League created successfully! League ID: ${data.leagueId}`);
          this.$router.push(`/league/${data.leagueId}`); // Redirect to the league page
        } else {
          const errorData = await response.json();
          alert(`Error creating league: ${errorData.message}`);
        }
      } catch (err) {
        console.error("Error creating league:", err);
        alert("An error occurred. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.league-creation-page {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

button {
  margin-top: 10px;
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
