const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken } = require("../middleware/authenticateToken");
console.log("authenticateToken:", authenticateToken);

const router = express.Router();
const DRAFTS_TABLE = "Drafts";
const LEAGUES_TABLE = "Leagues";

// Create a Draft
router.post("/create", authenticateToken, async (req, res) => {
    const { leagueId, draftType, rounds } = req.body;

    try {
        const draftId = `${leagueId}-draft`;

        const draft = {
            draftId,
            leagueId,
            draftType,
            rounds,
            picks: [],
            status: "Not Started", // Status: Not Started, In Progress, Completed
            currentRound: 0,
            currentPick: 0,
        };

        const params = {
            TableName: DRAFTS_TABLE,
            Item: draft,
        };

        await dynamoDB.put(params).promise();
        res.status(201).json({ message: "Draft created successfully", draft });
    } catch (error) {
        console.error("Create Draft Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//Uodate Draft
router.post("/update", authenticateToken, async (req, res) => {
    const {
      draftId,
      leagueId,
      maxTeams,
      playerRepeat,
      includeHousewives,
      includePartners,
      includeFriendsOf,
      draftDate,
    } = req.body;
  
    try {
      const params = { TableName: DRAFTS_TABLE, Key: { draftId, leagueId } };
      const draft = await dynamoDB.get(params).promise();
  
      if (!draft.Item) return res.status(404).json({ message: "Draft not found" });
  
      // Update draft settings
      draft.Item.maxTeams = maxTeams;
      draft.Item.rules = {
        playerRepeat,
        includeHousewives,
        includePartners,
        includeFriendsOf,
      };
      draft.Item.draftDate = draftDate;
  
      await dynamoDB.put({ TableName: DRAFTS_TABLE, Item: draft.Item }).promise();
      res.status(200).json({ message: "Draft settings updated successfully", draft: draft.Item });
    } catch (error) {
      console.error("Update Draft Settings Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// Start the Draft
router.post("/start", authenticateToken, async (req, res) => {
    console.log("Request Body:", req.body); // Log the full request body
    const { draftId, leagueId } = req.body;
    console.log("Draft ID Received:", draftId);
    console.log("League ID Received:", leagueId);

    try {
        // Log all items in the Drafts table for verification
        const scanParams = {
            TableName: DRAFTS_TABLE,
        };
        const allItems = await dynamoDB.scan(scanParams).promise();
        console.log("All Items in Drafts Table:", allItems);

        const params = {
            TableName: DRAFTS_TABLE,
            Key: { 
                draftId: String(draftId).trim(),
                leagueId: String(leagueId).trim(),
            },
        };
        console.log("DynamoDB Query Params:", params); // Log the parameters sent to DynamoDB
        console.log("Final Query Params Sent to DynamoDB:", JSON.stringify(params, null, 2));

        const draft = await dynamoDB.get(params).promise();
        console.log("DynamoDB Query Result:", draft); // Log the fetched draft

        if (!draft.Item) {
            console.log("Draft not found in DynamoDB");
            return res.status(404).json({ message: "Draft not found" });
        }

        draft.Item.status = "In Progress";
        draft.Item.currentRound = 1;

        const updateParams = {
            TableName: DRAFTS_TABLE,
            Item: draft.Item,
        };
        console.log("DynamoDB Update Params:", updateParams);

        await dynamoDB.put(updateParams).promise();
        res.status(200).json({ message: "Draft started successfully", draft: draft.Item });
    } catch (error) {
        console.error("Start Draft Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// Make a Pick
router.post("/pick", authenticateToken, async (req, res) => {
    const { draftId, leagueId, player, user } = req.body;
    console.log("Pick Details Received:", { draftId, leagueId, player, user });

    try {
        const params = {
            TableName: DRAFTS_TABLE,
            Key: { draftId, leagueId },
        };

        const draft = await dynamoDB.get(params).promise();
        console.log("Fetched Draft:", draft);

        if (!draft.Item) {
            return res.status(404).json({ message: "Draft not found" });
        }

        // Check if player is already picked
        if (draft.Item.picks.some((p) => p.player === player)) {
            return res.status(400).json({ message: "Player already drafted" });
        }

        // Add the pick to the draft
        draft.Item.picks.push({ user, player, round: draft.Item.currentRound });

        // Update draft status
        draft.Item.currentPick += 1;
        if (draft.Item.currentPick >= draft.Item.picks.length / draft.Item.rounds) {
            draft.Item.currentRound += 1;
            draft.Item.currentPick = 0; // Reset for new round
        }

        const updateParams = {
            TableName: DRAFTS_TABLE,
            Item: draft.Item,
        };

        await dynamoDB.put(updateParams).promise();
        res.status(200).json({ message: "Pick successful", draft: draft.Item });
    } catch (error) {
        console.error("Make Pick Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/:draftId/status", authenticateToken, async (req, res) => {
    const { draftId } = req.params;
    const leagueId = req.query.leagueId; // Pass `leagueId` as a query parameter
    console.log("Draft ID Received:", draftId);
    console.log("League ID Received:", leagueId);

    try {
        const params = {
            TableName: DRAFTS_TABLE,
            Key: {
                draftId: String(draftId).trim(),
                leagueId: String(leagueId).trim(),
            },
        };
        console.log("DynamoDB Query Params:", params); // Log the query parameters

        const draft = await dynamoDB.get(params).promise();
        console.log("DynamoDB Query Result:", draft); // Log the fetched draft

        if (!draft.Item) {
            console.log("Draft not found in DynamoDB");
            return res.status(404).json({ message: "Draft not found" });
        }

        res.status(200).json({ status: draft.Item.status, draft: draft.Item });
    } catch (error) {
        console.error("Get Draft Status Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Pause Draft
router.post("/pause", authenticateToken, async (req, res) => {
    const { draftId, leagueId } = req.body;
    try {
      const params = { TableName: DRAFTS_TABLE, Key: { draftId, leagueId } };
      const draft = await dynamoDB.get(params).promise();
  
      if (!draft.Item) return res.status(404).json({ message: "Draft not found" });
  
      draft.Item.status = "Paused";
      await dynamoDB.put({ TableName: DRAFTS_TABLE, Item: draft.Item }).promise();
  
      res.status(200).json({ message: "Draft paused successfully" });
    } catch (error) {
      console.error("Pause Draft Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Resume Draft
  router.post("/resume", authenticateToken, async (req, res) => {
    const { draftId, leagueId } = req.body;
    try {
      const params = { TableName: DRAFTS_TABLE, Key: { draftId, leagueId } };
      const draft = await dynamoDB.get(params).promise();
  
      if (!draft.Item) return res.status(404).json({ message: "Draft not found" });
  
      draft.Item.status = "In Progress";
      await dynamoDB.put({ TableName: DRAFTS_TABLE, Item: draft.Item }).promise();
  
      res.status(200).json({ message: "Draft resumed successfully" });
    } catch (error) {
      console.error("Resume Draft Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
// Complete the Draft
router.post("/complete", authenticateToken, async (req, res) => {
    const { draftId, leagueId } = req.body;

    try {
        const params = {
            TableName: DRAFTS_TABLE,
            Key: { draftId, leagueId },
        };

        const draft = await dynamoDB.get(params).promise();
        if (!draft.Item) {
            return res.status(404).json({ message: "Draft not found" });
        }

        // Mark the draft as completed
        draft.Item.status = "Completed";

        const updateParams = {
            TableName: DRAFTS_TABLE,
            Item: draft.Item,
        };

        await dynamoDB.put(updateParams).promise();
        res.status(200).json({ message: "Draft completed successfully", draft: draft.Item });
    } catch (error) {
        console.error("Complete Draft Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
