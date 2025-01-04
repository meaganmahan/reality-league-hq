const express = require("express");
const bcrypt = require("bcrypt");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = express.Router();
const USERS_TABLE = "Users"; // Replace with your actual table name

// Fetch User Data
router.get("/", authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: USERS_TABLE,
      Key: { email: req.user.email },
    };

    const user = await dynamoDB.get(params).promise();

    if (!user.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      displayName: user.Item.displayName,
      email: user.Item.email,
    });
  } catch (error) {
    console.error("Fetch User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update User Data
router.post("/update", authenticateToken, async (req, res) => {
  const { displayName, email, currentPassword, newPassword } = req.body;

  try {
    const params = {
      TableName: USERS_TABLE,
      Key: { email: req.user.email },
    };

    const user = await dynamoDB.get(params).promise();

    if (!user.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.Item.password);
    if (!isValidPassword) {
      return res.status(403).json({ message: "Current password is incorrect" });
    }

    // Update user data
    user.Item.displayName = displayName || user.Item.displayName;
    user.Item.email = email || user.Item.email;
    if (newPassword) {
      user.Item.password = await bcrypt.hash(newPassword, 10);
    }

    await dynamoDB.put({
      TableName: USERS_TABLE,
      Item: user.Item,
    }).promise();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
