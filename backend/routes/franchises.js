const express = require("express");
const dynamoDB = require("../utils/dynamoClient");

const router = express.Router();
const FRANCHISES_TABLE = "Franchises";

// Get All Franchises
router.get("/", async (req, res) => {
  try {
    const params = {
      TableName: FRANCHISES_TABLE,
    };

    const result = await dynamoDB.scan(params).promise();
    res.status(200).json(result.Items);
  } catch (error) {
    console.error("Error fetching franchises:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
