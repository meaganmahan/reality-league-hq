<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <h1>Welcome to Your Dashboard</h1>
      <p>Manage your leagues, check scores, and more!</p>
    </header>
    <main class="dashboard-main">
      <section class="leagues">
        <h2>Your Leagues</h2>
        <ul>
          <li v-for="league in leagues" :key="league.id">
            <a :href="`/league/${league.id}`">{{ league.name }}</a>
          </li>
        </ul>
        <button @click="createLeague">Create New League</button>
      </section>
      <section class="recent-activity">
        <h2>Recent Activity</h2>
        <p v-if="activity.length === 0">No recent activity yet.</p>
        <ul v-else>
          <li v-for="item in activity" :key="item.id">{{ item.description }}</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "DashboardPage",
  data() {
    return {
      leagues: [
        { id: 1, name: "League A" },
        { id: 2, name: "League B" },
      ],
      activity: [
        { id: 1, description: "League A updated scores for Week 1" },
        { id: 2, description: "League B added a new member" },
      ],
    };
  },
  methods: {
    createLeague() {
      this.$router.push("/create-league");
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000;
  color: #fff;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.leagues,
.recent-activity {
  flex: 1;
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
</style>
