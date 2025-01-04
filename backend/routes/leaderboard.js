const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();

// View Leaderboard
router.get("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;
    console.log("View Leaderboard for League:", leagueId);

    try {
        const params = {
            TableName: "Scores",
            KeyConditionExpression: "leagueId = :leagueId",
            ExpressionAttributeValues: {
                ":leagueId": leagueId,
            },
        };

        const result = await dynamoDB.query(params).promise();
        console.log("Scores Retrieved:", result.Items);

        // Aggregate scores by teamId
        const leaderboard = {};
        result.Items.forEach((item) => {
            const teamId = item.teamId;
            if (!leaderboard[teamId]) {
                leaderboard[teamId] = { teamId, totalScore: 0 };
            }
            leaderboard[teamId].totalScore += item.score;
        });

        // Convert leaderboard to sorted array
        const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.totalScore - a.totalScore);

        res.status(200).json({ leaderboard: sortedLeaderboard });
    } catch (error) {
        console.error("View Leaderboard Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//Get Team Scores
router.get("/:leagueId/team/:teamId", authenticateToken, async (req, res) => {
    const { leagueId, teamId } = req.params;
    console.log("View Scores for Team:", { leagueId, teamId });

    try {
        const params = {
            TableName: "Scores",
            KeyConditionExpression: "leagueId = :leagueId and begins_with(#playerEpisode, :teamId)",
            ExpressionAttributeNames: {
                "#playerEpisode": "playerId-episodeId", // Escape the attribute name
            },
            ExpressionAttributeValues: {
                ":leagueId": leagueId,
                ":teamId": teamId,
            },
        };

        const result = await dynamoDB.query(params).promise();
        res.status(200).json({ scores: result.Items });
    } catch (error) {
        console.error("View Team Details Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Export the router
module.exports = router;