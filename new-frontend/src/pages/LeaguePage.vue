<template>
  <div class="league-page">
    <header class="league-header" v-if="league">
      <h1>{{ league.name }}</h1>
      <p>Type: {{ league.type }}</p>
      <p v-if="league.franchises">Franchises: {{ league.franchises.join(", ") }}</p>
    </header>
    <nav>
      <button @click="setTab('leaderboard')">Leaderboard</button>
      <button @click="setTab('scoring')">Scoring Breakdown</button>
      <button @click="setTab('announcements')">Announcements</button>
      <button @click="setTab('disputes')">Disputes</button>
      <button @click="setTab('settings')">Settings</button>
    </nav>
    <main>
      <!-- Leaderboard Tab -->
      <div v-if="currentTab === 'leaderboard'">
        <h2>Leaderboard</h2>
        <ul>
          <li v-for="team in leaderboard" :key="team.id">
            {{ team.name }} - {{ team.score }} points
          </li>
        </ul>
      </div>

      <!-- Scoring Tab -->
      <div v-if="currentTab === 'scoring'">
        <h2>Scoring Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Week 1</th>
              <th>Week 2</th>
              <th>Week 3</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in leaderboard" :key="team.id">
              <td>{{ team.name }}</td>
              <td>{{ team.week1 || 0 }}</td>
              <td>{{ team.week2 || 0 }}</td>
              <td>{{ team.week3 || 0 }}</td>
              <td>{{ team.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Announcements Tab -->
      <div v-if="currentTab === 'announcements'">
        <h2>Announcements</h2>
        <ul>
          <li v-for="announcement in announcements" :key="announcement.id">
            {{ announcement.message }} - {{ announcement.date }}
          </li>
        </ul>
      </div>

      <!-- Disputes Tab -->
      <div v-if="currentTab === 'disputes'">
        <h2>File a Dispute</h2>
        <form @submit.prevent="fileDispute">
          <textarea v-model="disputeMessage" placeholder="Enter your dispute"></textarea>
          <button type="submit">Submit Dispute</button>
        </form>
        <h3>Existing Disputes</h3>
        <ul>
          <li v-for="dispute in disputes" :key="dispute.id">
            {{ dispute.message }} - {{ dispute.status }}
          </li>
        </ul>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'">
        <h2>League Settings</h2>
        <p>Feature coming soon...</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "LeaguePage",
  data() {
    return {
      league: null, // Initially null while loading
      currentTab: "leaderboard", // Default tab
      leaderboard: [], // Data for leaderboard
      announcements: [], // Data for announcements
      disputes: [], // Data for disputes
      disputeMessage: "", // For filing disputes
    };
  },
  created() {
    this.fetchLeagueDetails();
    this.fetchLeaderboard();
  },
  methods: {
    setTab(tab) {
      this.currentTab = tab;
    },
    async fetchLeagueDetails() {
      try {
        const leagueId = this.$route.params.leagueId; // Extract leagueId from route
        console.log("Frontend League ID:", leagueId);

        const response = await fetch(`http://localhost:3000/api/leagues/${leagueId}`);
        if (!response.ok) throw new Error("Failed to fetch league details");

        this.league = await response.json();
      } catch (error) {
        console.error("Error fetching league:", error);
        alert("Could not load league details.");
      }
    },
    async fetchLeaderboard() {
      try {
        const response = await fetch(`http://localhost:3000/api/leagues/${this.$route.params.leagueId}/leaderboard`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard.");
        this.leaderboard = await response.json();
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    },
  },
};
</script>

<style scoped>
.league-page {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

.league-header {
  text-align: center;
  margin-bottom: 20px;
}

nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

nav button {
  padding: 10px;
  background-color: #d8b4e2;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

nav button:hover {
  background-color: #c89edb;
}
</style>
