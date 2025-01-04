<template>
    <div class="join-league-page">
      <h1>Join a League</h1>
      <p>Enter the league code provided by your commissioner:</p>
      <form @submit.prevent="joinLeague">
        <input
          type="text"
          v-model="leagueCode"
          placeholder="League Code"
          required
        />
        <button type="submit">Join League</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "JoinLeaguePage",
    data() {
      return {
        leagueCode: "",
      };
    },
    methods: {
      joinLeague() {
        alert(`Joining league with code: ${this.leagueCode}`);
        this.leagueCode = "";
      },
    },
  };
  </script>
  
  <style scoped>
  .join-league-page {
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
  