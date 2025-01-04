<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>

    <section>
      <h2>Manage Users</h2>
      <ul>
        <li v-for="user in users" :key="user.email">
          {{ user.displayName }} ({{ user.email }})
          <button @click="deleteUser(user.email)">Delete</button>
        </li>
      </ul>
    </section>

    <section>
      <h2>Manage Leagues</h2>
      <ul>
        <li v-for="league in leagues" :key="league.leagueId">
          {{ league.leagueName }}
          <button @click="deleteLeague(league.leagueId)">Delete</button>
        </li>
      </ul>
    </section>

    <section>
      <h2>Manage Disputes</h2>
      <ul>
        <li v-for="dispute in disputes" :key="dispute.id">
          {{ dispute.message }} - {{ dispute.status }}
          <button @click="resolveDispute(dispute.id)">Resolve</button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: "AdminPage",
  data() {
    return {
      users: [],
      leagues: [],
      disputes: [],
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Fetch users
        const usersResponse = await fetch("http://localhost:3000/api/admin/users");
        if (usersResponse.ok) {
          this.users = await usersResponse.json();
        }

        // Fetch leagues
        const leaguesResponse = await fetch("http://localhost:3000/api/admin/leagues");
        if (leaguesResponse.ok) {
          this.leagues = await leaguesResponse.json();
        }

        // Fetch disputes
        const disputesResponse = await fetch("http://localhost:3000/api/admin/disputes");
        if (disputesResponse.ok) {
          this.disputes = await disputesResponse.json();
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    },
    async deleteUser(email) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${email}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("User deleted successfully!");
          await this.fetchData();
        } else {
          alert("Failed to delete user.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    async deleteLeague(leagueId) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/leagues/${leagueId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("League deleted successfully!");
          await this.fetchData();
        } else {
          alert("Failed to delete league.");
        }
      } catch (error) {
        console.error("Error deleting league:", error);
      }
    },
    async resolveDispute(disputeId) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/disputes/${disputeId}`, {
          method: "POST",
        });
        if (response.ok) {
          alert("Dispute resolved successfully!");
          await this.fetchData();
        } else {
          alert("Failed to resolve dispute.");
        }
      } catch (error) {
        console.error("Error resolving dispute:", error);
      }
    },
  },
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

section {
  margin-bottom: 20px;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
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
