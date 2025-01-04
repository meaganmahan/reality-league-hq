const express = require("express");
const dynamoDB = require("../utils/dynamoClient");
const { authenticateToken } = require("../middleware/authenticateToken");
console.log("authenticateToken:", authenticateToken);

const router = express.Router(); // Initialize the router

// Test Route
router.get("/test", (req, res) => {
    res.send("Announcements route is working!");
});

//Post an Announcement
router.post("/create", authenticateToken, async (req, res) => {
    try {
      const { title, content } = req.body;
  
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required." });
      }
  
      const announcementId = Date.now().toString();
      const newAnnouncement = {
        announcementId,
        title,
        content,
        createdAt: new Date().toISOString(),
      };
  
      await dynamoDB.put({
        TableName: "Announcements",
        Item: newAnnouncement,
      }).promise();
  
      res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// View Announcements
router.get("/:leagueId", authenticateToken, async (req, res) => {
    const { leagueId } = req.params;

    try {
        const params = {
            TableName: "Announcements",
            KeyConditionExpression: "leagueId = :leagueId",
            ExpressionAttributeValues: {
                ":leagueId": leagueId,
            },
        };

        const result = await dynamoDB.query(params).promise();
        res.status(200).json({ announcements: result.Items });
    } catch (error) {
        console.error("View Announcements Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//Pin/Unpin Announcement
router.put("/pin", authenticateToken, async (req, res) => {
    const { leagueId, announcementId, pinned } = req.body;

    try {
        const params = {
            TableName: "Announcements",
            Key: {
                leagueId,
                announcementId,
            },
            UpdateExpression: "set pinned = :pinned",
            ExpressionAttributeValues: {
                ":pinned": Boolean(pinned),
            },
        };

        await dynamoDB.update(params).promise();
        res.status(200).json({ message: `Announcement ${pinned ? "pinned" : "unpinned"} successfully` });
    } catch (error) {
        console.error("Pin/Unpin Announcement Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Announcement
router.delete("/delete", authenticateToken, async (req, res) => {
    const { leagueId, announcementId } = req.body;
    console.log("Delete Announcement:", { leagueId, announcementId });

    try {
        const params = {
            TableName: "Announcements",
            Key: {
                leagueId,
                announcementId,
            },
        };

        await dynamoDB.delete(params).promise();
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Delete Announcement Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//Edit Announcement
router.put("/edit", authenticateToken, async (req, res) => {
    const { leagueId, announcementId, title, message, expiresAt } = req.body;
    console.log("Edit Announcement:", { leagueId, announcementId, title, message, expiresAt });

    try {
        const params = {
            TableName: "Announcements",
            Key: {
                leagueId,
                announcementId,
            },
            UpdateExpression: "set title = :title, message = :message, expiresAt = :expiresAt",
            ExpressionAttributeValues: {
                ":title": title,
                ":message": message,
                ":expiresAt": expiresAt || null,
            },
        };

        await dynamoDB.update(params).promise();
        res.status(200).json({ message: "Announcement updated successfully" });
    } catch (error) {
        console.error("Edit Announcement Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Export the router
module.exports = router;
