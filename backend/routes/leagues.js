const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticateToken");


const LEAGUES_TABLE = "Leagues";

// Create a League
router.post("/create", async (req, res) => {
  const { leagueName, leagueType, franchises } = req.body;

  if (!leagueName || !leagueType || franchises.length === 0) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const leagueId = Date.now().toString(); // Generate a unique ID
    await dynamoDB.put({
      TableName: "Leagues",
      Item: { leagueId, leagueName, leagueType, franchises },
    }).promise();

    res.status(201).json({ message: "League created successfully", leagueId });
  } catch (err) {
    console.error("Error creating league:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

  
//Join a League
  router.post("/join", authenticateToken, async (req, res) => {
    const { inviteCode } = req.body;
  
    try {
      // Find the league with the matching invite code
      const params = {
        TableName: LEAGUES_TABLE,
        FilterExpression: "inviteCode = :inviteCode",
        ExpressionAttributeValues: { ":inviteCode": inviteCode },
      };
  
      const result = await dynamoDB.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ message: "League not found with this invite code" });
      }
  
      const league = result.Items[0];
  
      // Add the user to the participants list if not already included
      if (!league.participants.includes(req.user.email)) {
        league.participants.push(req.user.email);
  
        const updateParams = {
          TableName: LEAGUES_TABLE,
          Item: league,
        };
        await dynamoDB.put(updateParams).promise();
      }
  
      res.status(200).json({ message: "Joined league successfully", leagueId: league.leagueId });
    } catch (error) {
      console.error("Join League Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  //Browse Leagues
  router.get("/browse", authenticateToken, async (req, res) => {
    try {
      const params = {
        TableName: LEAGUES_TABLE,
        FilterExpression: "visibility = :publicVisibility",
        ExpressionAttributeValues: { ":publicVisibility": "public" },
      };
  
      const result = await dynamoDB.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return res.status(404).json({ message: "No public leagues found" });
      }
  
      const leagues = result.Items.map((league) => ({
        leagueId: league.leagueId,
        leagueName: league.leagueName,
        franchises: league.franchises,
        maxTeams: league.maxTeams,
        currentTeams: league.participants.length,
        draftDate: league.draftDate,
      }));
  
      res.status(200).json(leagues);
    } catch (error) {
      console.error("Browse Leagues Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
// Get League Details
router.get("/:leagueId", async (req, res) => {
    const { leagueId } = req.params;

    try {
        console.log("Fetching league with ID:", leagueId);
        const result = await dynamoDB.get({
            TableName: LEAGUES_TABLE,
            Key: { leagueId },
        }).promise();

        console.log("DynamoDB Response:", result);

        if (!result.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        res.status(200).json(result.Item);
    } catch (err) {
        console.error("Error fetching league:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Edit League Details
router.put("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;
    const { leagueName, maxTeams } = req.body;

    try {
        const params = { TableName: LEAGUES_TABLE, Key: { leagueId } };
        const league = await dynamoDB.get(params).promise();

        if (!league.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        if (league.Item.creatorEmail !== req.user.email) {
            return res.status(403).json({ message: "You are not authorized to edit this league" });
        }

        if (leagueName) league.Item.leagueName = leagueName;
        if (maxTeams) league.Item.maxTeams = maxTeams;

        const updateParams = { TableName: LEAGUES_TABLE, Item: league.Item };
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
        const params = { TableName: LEAGUES_TABLE, Key: { leagueId } };
        const league = await dynamoDB.get(params).promise();

        if (!league.Item) {
            return res.status(404).json({ message: "League not found" });
        }

        if (league.Item.creatorEmail !== req.user.email) {
            return res.status(403).json({ message: "You are not authorized to delete this league" });
        }

        await dynamoDB.delete(params).promise();
        res.status(200).json({ message: "League deleted successfully" });
    } catch (error) {
        console.error("Delete League Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Export the router
module.exports = router;
