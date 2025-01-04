const express = require("express");
const dynamoDB = require("../utils/dynamoClient");

const router = express.Router();

// Handle Feedback Submission
router.post("/", async (req, res) => {
  const feedback = req.body;

  try {
    const params = {
      TableName: "Feedback",
      Item: {
        feedbackId: Date.now().toString(), // Unique ID for the feedback
        ...feedback,
        submittedAt: new Date().toISOString(),
      },
    };

    await dynamoDB.put(params).promise();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback Submission Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
