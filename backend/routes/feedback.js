const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const FEEDBACK_TABLE = "Feedback";

// Submit Feedback
router.post("/submit", authenticateToken, async (req, res) => {
    const { issue, reproducible, page, device, browser, navigationEase, confusingFeatures, designSuggestions, featureRequest, featureImportance, generalFeedback } = req.body;

    try {
        const feedbackId = `${req.user.email}-${Date.now()}`; // Unique ID for each feedback
        const params = {
            TableName: FEEDBACK_TABLE,
            Item: {
                feedbackId,
                userEmail: req.user.email,
                issue,
                reproducible,
                page,
                device,
                browser,
                navigationEase,
                confusingFeatures,
                designSuggestions,
                featureRequest,
                featureImportance,
                generalFeedback,
                submittedAt: new Date().toISOString(),
            },
        };

        await dynamoDB.put(params).promise();
        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Submit Feedback Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
