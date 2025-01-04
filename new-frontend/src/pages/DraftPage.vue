<template>
  <div class="draft-page">
    <header class="draft-header">
      <h1>League Draft</h1>
      <p>League: {{ league.name }}</p>
      <p>Draft Type: {{ league.draftType }}</p>
      <p>Max Teams: {{ league.maxTeams }}</p>
      <p>Player Rules: 
        {{ league.rules.playerRepeat === 0 ? "No Repeats" 
          : league.rules.playerRepeat === 1 ? "1 Repeat Allowed" 
          : "Unlimited Repeats" }}
      </p>
      <p>Player Inclusion: 
        {{ league.rules.includeHousewives ? "Housewives, " : "" }}
        {{ league.rules.includePartners ? "Partners, " : "" }}
        {{ league.rules.includeFriendsOf ? "Friends Of" : "" }}
      </p>
    </header>

    <main class="draft-main">
      <!-- Commissioner Controls -->
      <section v-if="isCommissioner">
        <h2>Commissioner Controls</h2>
        <button @click="pauseDraft">Pause Draft</button>
        <button @click="resumeDraft">Resume Draft</button>
        <button @click="rescheduleDraft">Reschedule Draft</button>
      </section>

      <!-- Current Pick -->
      <section v-if="currentPick">
        <h2>Current Pick</h2>
        <p>Team: {{ currentPick.teamName }} (Owner: {{ currentPick.owner }})</p>
        <p>Time Remaining: {{ timeRemaining }}</p>
      </section>

      <!-- Draft Order -->
      <section>
        <h2>Draft Order</h2>
        <ul>
          <li v-for="(team, index) in draftOrder" :key="team.id">
            {{ index + 1 }}. {{ team.name }} (Owner: {{ team.owner }})
          </li>
        </ul>
      </section>

      <!-- Available Players -->
      <section>
        <h2>Available Players</h2>
        <ul>
          <li v-for="player in availablePlayers" :key="player.id">
            {{ player.name }} ({{ player.franchise }})
            <button @click="selectPlayer(player)">Draft</button>
          </li>
        </ul>
      </section>
      <section v-if="isCommissioner" class="commissioner-controls">
  <h2>Commissioner Settings</h2>
  
  <!-- Max Teams -->
  <div>
    <label for="maxTeams">Max Teams:</label>
    <input
      type="number"
      id="maxTeams"
      v-model="league.maxTeams"
      min="2"
      max="16"
      @change="updateDraftSettings"
    />
  </div>

  <!-- Player Repetition Rules -->
  <div>
    <label>Player Repetition Rules:</label>
    <select v-model="league.rules.playerRepeat" @change="updateDraftSettings">
      <option :value="0">No Repeats</option>
      <option :value="1">One Repeat Allowed</option>
      <option :value="2">Unlimited Repeats</option>
    </select>
  </div>

  <!-- Player Inclusion -->
  <div>
    <label>Include Players:</label>
    <div>
      <label>
        <input
          type="checkbox"
          v-model="league.rules.includeHousewives"
          @change="updateDraftSettings"
        />
        Housewives
      </label>
      <label>
        <input
          type="checkbox"
          v-model="league.rules.includePartners"
          @change="updateDraftSettings"
        />
        Partners
      </label>
      <label>
        <input
          type="checkbox"
          v-model="league.rules.includeFriendsOf"
          @change="updateDraftSettings"
        />
        Friends Of
      </label>
    </div>
  </div>

  <!-- Reschedule Draft -->
  <div>
    <label for="draftDate">Reschedule Draft:</label>
    <input
      type="datetime-local"
      id="draftDate"
      v-model="league.draftDate"
      @change="updateDraftSettings"
    />
  </div>

  <!-- Pause/Resume Controls -->
  <div>
    <button @click="pauseDraft">Pause Draft</button>
    <button @click="resumeDraft">Resume Draft</button>
  </div>
</section>

    </main>
  </div>
</template>

<script>
export default {
  name: "DraftPage",
  data() {
    return {
      league: {
        name: "Reality All-Stars",
        draftType: "Snake",
        maxTeams: 8,
        rules: {
          playerRepeat: 1,
          includeHousewives: true,
          includePartners: true,
          includeFriendsOf: false,
        },
      },
      draftOrder: [
        { id: 1, name: "Team A", owner: "Alice" },
        { id: 2, name: "Team B", owner: "Bob" },
      ],
      currentPick: {
        teamName: "Team A",
        owner: "Alice",
      },
      timeRemaining: "1:30",
      availablePlayers: [
        { id: 1, name: "Player 1", franchise: "Franchise A" },
        { id: 2, name: "Player 2", franchise: "Franchise B" },
        { id: 3, name: "Player 3", franchise: "Franchise C" },
      ],
      isCommissioner: true, // Placeholder for commissioner role
    };
  },
  methods: {
    selectPlayer(player) {
      alert(`${player.name} has been drafted by ${this.currentPick.teamName}!`);
      this.availablePlayers = this.availablePlayers.filter((p) => p.id !== player.id);
    },
    pauseDraft() {
      alert("Draft Paused!");
    },
    resumeDraft() {
      alert("Draft Resumed!");
    },
    rescheduleDraft() {
      alert("Reschedule Draft Dialog Open!");
    },
    async updateDraftSettings() {
    try {
      const response = await fetch(`http://localhost:3000/api/drafts/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: this.draftId, // Pass draftId
          leagueId: this.leagueId, // Pass leagueId
          maxTeams: this.league.maxTeams,
          playerRepeat: this.league.rules.playerRepeat,
          includeHousewives: this.league.rules.includeHousewives,
          includePartners: this.league.rules.includePartners,
          includeFriendsOf: this.league.rules.includeFriendsOf,
          draftDate: this.league.draftDate,
        }),
      });
      if (response.ok) {
        alert("Draft settings updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating draft settings:", error);
    }
  },
  async pauseDraft() {
    try {
      const response = await fetch(`http://localhost:3000/api/drafts/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: this.draftId, leagueId: this.leagueId }),
      });
      if (response.ok) {
        alert("Draft paused!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error pausing draft:", error);
    }
  },
  async resumeDraft() {
    try {
      const response = await fetch(`http://localhost:3000/api/drafts/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: this.draftId, leagueId: this.leagueId }),
      });
      if (response.ok) {
        alert("Draft resumed!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error resuming draft:", error);
    }
  },
  },
};
</script>

  
  <style scoped>
  .draft-page {
    padding: 20px;
    background-color: #000;
    color: #fff;
    min-height: 100vh;
  }
  
  .draft-header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .draft-main {
    display: flex;
    flex-direction: column;
    gap: 20px;
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
  