const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken, ensureAdmin } = require("../middleware/authenticateToken");

const router = express.Router();
const USERS_TABLE = "Users";
const LEAGUES_TABLE = "Leagues";
const DISPUTES_TABLE = "Disputes";

// Fetch Users
router.get("/users", authenticateToken, ensureAdmin, async (req, res) => {
  try {
    const users = await dynamoDB.scan({ TableName: USERS_TABLE }).promise();
    res.status(200).json(users.Items);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Leagues
router.get("/leagues", authenticateToken, ensureAdmin, async (req, res) => {
  try {
    const leagues = await dynamoDB.scan({ TableName: LEAGUES_TABLE }).promise();
    res.status(200).json(leagues.Items);
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Disputes
router.get("/disputes", authenticateToken, ensureAdmin, async (req, res) => {
  try {
    const disputes = await dynamoDB.scan({ TableName: DISPUTES_TABLE }).promise();
    res.status(200).json(disputes.Items);
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete User
router.delete("/users/:email", authenticateToken, ensureAdmin, async (req, res) => {
  const { email } = req.params;

  try {
    await dynamoDB.delete({
      TableName: USERS_TABLE,
      Key: { email },
    }).promise();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete League
router.delete("/leagues/:leagueId", authenticateToken, ensureAdmin, async (req, res) => {
  const { leagueId } = req.params;

  try {
    await dynamoDB.delete({
      TableName: LEAGUES_TABLE,
      Key: { leagueId },
    }).promise();

    res.status(200).json({ message: "League deleted successfully" });
  } catch (error) {
    console.error("Error deleting league:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Resolve Dispute
router.post("/disputes/:disputeId", authenticateToken, ensureAdmin, async (req, res) => {
  const { disputeId } = req.params;

  try {
    const params = {
      TableName: DISPUTES_TABLE,
      Key: { disputeId },
      UpdateExpression: "set #status = :resolved",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":resolved": "Resolved" },
    };

    await dynamoDB.update(params).promise();
    res.status(200).json({ message: "Dispute resolved successfully" });
  } catch (error) {
    console.error("Error resolving dispute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
