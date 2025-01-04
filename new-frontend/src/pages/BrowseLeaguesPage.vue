<script>
export default {
  name: "BrowseLeaguesPage",
  data() {
    return {
      leagues: [],
      error: null,
    };
  },
  async created() {
    try {
      const response = await fetch("http://localhost:3000/api/leagues/browse", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch public leagues");

      this.leagues = await response.json();
    } catch (error) {
      console.error("Error fetching public leagues:", error);
      this.error = "Unable to load public leagues. Please try again later.";
    }
  },
};
</script>

<template>
  <div class="browse-leagues-page">
    <h1>Browse Public Leagues</h1>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="league in leagues" :key="league.leagueId" class="league-card">
        <h2>{{ league.leagueName }}</h2>
        <p>Franchises: {{ league.franchises.join(", ") }}</p>
        <p>Teams: {{ league.currentTeams }} / {{ league.maxTeams }}</p>
        <p>Draft Date: {{ league.draftDate }}</p>
        <button @click="joinLeague(league.leagueId)">Join League</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.browse-leagues-page {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

.league-card {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #1a1a1a;
}

button {
  padding: 10px;
  background-color: #d8b4e2;
  border: none;
  border-radius: 5px;
  color: #000;
  cursor: pointer;
}

button:hover {
  background-color: #c89edb;
}
</style>
