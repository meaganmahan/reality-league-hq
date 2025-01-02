const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router(); // Initialize the router

// Submit a Dispute
router.post("/submit", authenticateToken, async (req, res) => {
    const { leagueId, type, description } = req.body;
    console.log("Dispute Submitted:", { leagueId, type, description });

    try {
        const disputeId = `dispute-${Date.now()}`;
        const params = {
            TableName: "Disputes",
            Item: {
                leagueId,
                disputeId,
                user: req.user.email,
                type,
                description,
                status: "Open",
                submittedAt: new Date().toISOString(),
                resolutionNote: null,
                resolvedBy: null,
                resolvedAt: null,
            },
        };

        await dynamoDB.put(params).promise();
        res.status(201).json({ message: "Dispute submitted successfully", disputeId });
    } catch (error) {
        console.error("Submit Dispute Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// View Disputes
router.get("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;

    try {
        const params = {
            TableName: "Disputes",
            KeyConditionExpression: "leagueId = :leagueId",
            ExpressionAttributeValues: {
                ":leagueId": leagueId,
            },
        };

        const result = await dynamoDB.query(params).promise();
        res.status(200).json({ disputes: result.Items });
    } catch (error) {
        console.error("View Disputes Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Resolve Dispute
router.put("/resolve", authenticateToken, async (req, res) => {
    const { leagueId, disputeId, resolutionNote } = req.body;

    try {
        const params = {
            TableName: "Disputes",
            Key: {
                leagueId,
                disputeId,
            },
            UpdateExpression: "set #status = :status, resolutionNote = :resolutionNote, resolvedBy = :resolvedBy, resolvedAt = :resolvedAt",
            ExpressionAttributeNames: {
                "#status": "status", // Alias the reserved keyword
            },
            ExpressionAttributeValues: {
                ":status": "Resolved",
                ":resolutionNote": resolutionNote,
                ":resolvedBy": req.user.email,
                ":resolvedAt": new Date().toISOString(),
            },
        };

        await dynamoDB.update(params).promise();
        res.status(200).json({ message: "Dispute resolved successfully" });
    } catch (error) {
        console.error("Resolve Dispute Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
