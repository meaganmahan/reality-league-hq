const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();


//Input Scores
router.post("/input", authenticateToken, async (req, res) => {
    const { leagueId, scores } = req.body; // Scores: [{ playerId, episodeId, score, details }]
    console.log("Scores Input Received:", { leagueId, scores });

    try {
        const putRequests = scores.map((score) => ({
            PutRequest: {
                Item: {
                    leagueId: leagueId,
                    "playerId-episodeId": `${score.playerId}-${score.episodeId}`,
                    score: score.score,
                    details: score.details,
                },
            },
        }));

        const params = {
            RequestItems: {
                Scores: putRequests,
            },
        };

        await dynamoDB.batchWrite(params).promise();
        res.status(200).json({ message: "Scores input successfully" });
    } catch (error) {
        console.error("Input Scores Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//View Scores 
router.get("/:leagueId/:episodeId", authenticateToken, async (req, res) => {
    const { leagueId, episodeId } = req.params;
    console.log("View Scores for:", { leagueId, episodeId });

    try {
        const params = {
            TableName: "Scores",
            KeyConditionExpression: "leagueId = :leagueId and begins_with(#playerEpisode, :episodeId)",
            ExpressionAttributeNames: {
                "#playerEpisode": "playerId-episodeId", // Escape special characters
            },
            ExpressionAttributeValues: {
                ":leagueId": leagueId,
                ":episodeId": episodeId,
            },
        };

        const result = await dynamoDB.query(params).promise();
        res.status(200).json({ scores: result.Items });
    } catch (error) {
        console.error("View Scores Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Update Scores
router.put("/update", authenticateToken, async (req, res) => {
    const { leagueId, playerId, episodeId, score, details } = req.body;
    console.log("Update Score Request:", { leagueId, playerId, episodeId, score, details });

    try {
        const params = {
            TableName: "Scores",
            Key: {
                leagueId: leagueId,
                "playerId-episodeId": `${playerId}-${episodeId}`,
            },
            UpdateExpression: "set score = :score, details = :details",
            ExpressionAttributeValues: {
                ":score": score,
                ":details": details,
            },
        };

        await dynamoDB.update(params).promise();
        res.status(200).json({ message: "Score updated successfully" });
    } catch (error) {
        console.error("Update Scores Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Export the router
module.exports = router;
