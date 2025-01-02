const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const LEAGUES_TABLE = "Leagues";

// Create a League
router.post("/create", authenticateToken, async (req, res) => {
    const { leagueName, type, franchise, maxTeams } = req.body;
    const leagueId = `${req.user.email}-${Date.now()}`; // Generate a unique ID
    console.log("Creating League:", { leagueName, type, franchise, maxTeams, leagueId }); // Debug log

    try {
        const params = {
            TableName: LEAGUES_TABLE,
            Item: {
                leagueId,
                name: leagueName,
                creatorEmail: req.user.email,
                type,
                franchise,
                maxTeams,
                participants: [req.user.email],
                createdAt: new Date().toISOString(),
            },
        };
        console.log("DynamoDB Put Params:", params); // Debug log

        await dynamoDB.put(params).promise();
        res.status(201).json({ message: "League created successfully", leagueId });
    } catch (error) {
        console.error("Create League Error:", error); // Log the full error
        res.status(500).json({ message: "Internal server error" });
    }
});


// Join a League
router.post("/join", authenticateToken, async (req, res) => {
    const { leagueId } = req.body;
    console.log("League ID:", leagueId); // Log the leagueId received from the request

    try {
        const params = {
            TableName: LEAGUES_TABLE,
            Key: { leagueId },
        };
        console.log("DynamoDB Get Params:", params); // Log the params being sent to DynamoDB

        const league = await dynamoDB.get(params).promise();
        console.log("Fetched League:", league); // Log the result from DynamoDB

        if (!league.Item) {
            console.log("League not found");
            return res.status(404).json({ message: "League not found" });
        }

        // Add user to participants list if not already included
        if (!league.Item.participants.includes(req.user.email)) {
            console.log("Adding user to participants:", req.user.email);
            league.Item.participants.push(req.user.email);

            const updateParams = {
                TableName: LEAGUES_TABLE,
                Item: league.Item,
            };
            console.log("Update Params:", updateParams); // Log the updateParams before updating
            await dynamoDB.put(updateParams).promise();
        }

        res.status(200).json({ message: "Joined league successfully", league: league.Item });
    } catch (error) {
        console.error("Join League Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Get League Details
router.get("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;

    try {
        const params = {
            TableName: LEAGUES_TABLE,
            Key: { leagueId },
        };

        const league = await dynamoDB.get(params).promise();
        if (!league.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        res.status(200).json({ league: league.Item });
    } catch (error) {
        console.error("Get League Details Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Edit League Details
router.put("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;
    const { leagueName, maxTeams } = req.body; // Fields to update

    try {
        const params = {
            TableName: LEAGUES_TABLE,
            Key: { leagueId },
        };

        // Fetch the league
        const league = await dynamoDB.get(params).promise();
        if (!league.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        // Ensure the user is the creator of the league
        if (league.Item.creatorEmail !== req.user.email) {
            return res.status(403).json({ message: "You are not authorized to edit this league" });
        }

        // Update league details
        if (leagueName) league.Item.name = leagueName;
        if (maxTeams) league.Item.maxTeams = maxTeams;

        const updateParams = {
            TableName: LEAGUES_TABLE,
            Item: league.Item,
        };

        await dynamoDB.put(updateParams).promise();
        res.status(200).json({ message: "League updated successfully", league: league.Item });
    } catch (error) {
        console.error("Edit League Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete League
router.delete("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;

    try {
        const params = {
            TableName: LEAGUES_TABLE,
            Key: { leagueId },
        };

        // Fetch the league
        const league = await dynamoDB.get(params).promise();
        if (!league.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        // Ensure the user is the creator of the league
        if (league.Item.creatorEmail !== req.user.email) {
            return res.status(403).json({ message: "You are not authorized to delete this league" });
        }

        // Delete the league
        await dynamoDB.delete(params).promise();
        res.status(200).json({ message: "League deleted successfully" });
    } catch (error) {
        console.error("Delete League Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Export the router
module.exports = router;
