const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dynamoDB = require("../utils/dynamoClient");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
const USERS_TABLE = "Users";
const TOKEN_EXPIRATION = "1h";

// Signup Route
router.post("/signup", async (req, res) => {
    const { fullName, email, password, birthday, timezone } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await dynamoDB.get({ TableName: USERS_TABLE, Key: { email } }).promise();
        if (existingUser.Item) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to DynamoDB
        await dynamoDB.put({
            TableName: USERS_TABLE,
            Item: { email, fullName, password: hashedPassword, birthday, timezone },
        }).promise();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user from DynamoDB
        const user = await dynamoDB.get({ TableName: USERS_TABLE, Key: { email } }).promise();

        if (!user.Item || !(await bcrypt.compare(password, user.Item.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        res.status(200).json({
            token,
            user: { email: user.Item.email, fullName: user.Item.fullName },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Test Route for Authentication
router.get("/test-auth", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Authenticated successfully!", user: req.user });
});

module.exports = router;
