const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken } = require("../middleware/authenticateToken");
console.log("authenticateToken:", authenticateToken);

const router = express.Router();
const USERS_TABLE = "Users";
const TOKEN_EXPIRATION = "1h";

// Signup Route
router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    console.log("Signup request received:", req.body);

    try {
        // Check if the user already exists
        const existingUser = await dynamoDB.get({ 
            TableName: USERS_TABLE, 
            Key: { email } 
        }).promise();
        console.log("Existing user check:", existingUser);

        if (existingUser.Item) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully");

        // Save the user to DynamoDB
        await dynamoDB.put({
            TableName: USERS_TABLE,
            Item: { email, fullName, password: hashedPassword },
        }).promise();
        console.log("User saved successfully");

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
//Fortgotten Password
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" }); // Replace with your SES region

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const params = {
      TableName: USERS_TABLE,
      Key: { email },
    };

    const user = await dynamoDB.get(params).promise();

    if (!user.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send reset email
    const ses = new AWS.SES();
    const emailParams = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Text: {
            Data: `Use the following link to reset your password: http://localhost:5173/reset-password?token=${resetToken}`,
          },
        },
        Subject: { Data: "Password Reset Request" },
      },
      Source: "your-verified-email@example.com", // Replace with your verified email
    };

    await ses.sendEmail(emailParams).promise();
    console.log("Password reset email sent!");
    res.status(200).json({ message: "Password reset link sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
 //Send Authentication Email
 router.post("/send-authentication-email", async (req, res) => {
  const { email } = req.body;

  try {
    const authToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Send authentication email
    const ses = new AWS.SES();
    const emailParams = {
      Destination: { ToAddresses: [email] },
      Message: {
        Body: {
          Text: {
            Data: `Click the link to verify your account: http://localhost:5173/verify-account?token=${authToken}`,
          },
        },
        Subject: { Data: "Verify Your Account" },
      },
      Source: "your-verified-email@example.com",
    };

    await ses.sendEmail(emailParams).promise();
    console.log("Authentication email sent!");
    res.status(200).json({ message: "Authentication email sent!" });
  } catch (error) {
    console.error("Send Authentication Email Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify Account
router.post("/verify-account", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const params = {
      TableName: USERS_TABLE,
      Key: { email: decoded.email },
      UpdateExpression: "set verified = :true",
      ExpressionAttributeValues: { ":true": true },
    };

    await dynamoDB.update(params).promise();
    res.status(200).json({ message: "Account verified successfully!" });
  } catch (error) {
    console.error("Verify Account Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});


// Reset Password
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;
  
      const params = {
        TableName: USERS_TABLE,
        Key: { email },
      };
  
      const user = await dynamoDB.get(params).promise();
  
      if (!user.Item) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.Item.password = await bcrypt.hash(newPassword, 10);
  
      await dynamoDB.put({
        TableName: USERS_TABLE,
        Item: user.Item,
      }).promise();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Invalid or expired token" });
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
