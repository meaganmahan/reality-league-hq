<template>
  <div class="feedback-form">
    <h1>Submit Feedback</h1>
    <form @submit.prevent="submitFeedback">
      <label for="email">Email (Optional):</label>
      <input type="email" id="email" v-model="formData.email" />

      <h2>Issue Reporting</h2>
      <label for="issueDescription">Description of the Issue:</label>
      <textarea id="issueDescription" v-model="formData.issueDescription"></textarea>

      <label for="stepsToReproduce">Steps to Reproduce:</label>
      <textarea id="stepsToReproduce" v-model="formData.stepsToReproduce"></textarea>

      <label for="feature">Page or Feature:</label>
      <input type="text" id="feature" v-model="formData.feature" />

      <h2>Feature Suggestions</h2>
      <label for="featureSuggestion">What Feature Would You Like to See?:</label>
      <textarea id="featureSuggestion" v-model="formData.featureSuggestion"></textarea>

      <label for="featureReason">Why Would This Be Helpful?:</label>
      <textarea id="featureReason" v-model="formData.featureReason"></textarea>

      <h2>User Experience</h2>
      <label for="uxFeedback">Was Anything Confusing or Difficult to Use?:</label>
      <textarea id="uxFeedback" v-model="formData.uxFeedback"></textarea>

      <label for="rating">Rating (1–5):</label>
      <input type="number" id="rating" v-model="formData.rating" min="1" max="5" />

      <h2>Additional Comments</h2>
      <textarea v-model="formData.additionalComments" placeholder="Anything else?"></textarea>

      <button type="submit">Submit Feedback</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "FeedbackForm",
  data() {
    return {
      formData: {
        email: "",
        issueDescription: "",
        stepsToReproduce: "",
        feature: "",
        featureSuggestion: "",
        featureReason: "",
        uxFeedback: "",
        rating: null,
        additionalComments: "",
      },
    };
  },
  methods: {
    async submitFeedback() {
      try {
        const response = await fetch("http://localhost:3000/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });

        if (response.ok) {
          alert("Thank you for your feedback!");
          this.$router.push("/dashboard");
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("An error occurred. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.feedback-form {
  padding: 20px;
  background-color: #000;
  color: #fff;
  min-height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

textarea,
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
