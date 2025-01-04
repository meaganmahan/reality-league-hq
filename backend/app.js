const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const leaguesRoutes = require("./routes/leagues");
const draftsRoutes = require("./routes/drafts");
const scoresRoutes = require("./routes/scores");
const announcementsRoutes = require("./routes/announcements");
const feedbackRoutes = require("./routes/feedback");
const disputesRoutes = require("./routes/disputes");
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const franchisesRoutes = require("./routes/franchises");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leagues", leaguesRoutes);
app.use("/api/drafts", draftsRoutes);
app.use("/api/scores", scoresRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/disputes", disputesRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/franchises", franchisesRoutes);

app.use(cors({
  origin: ["http://localhost:5173", "https://www.realityleaguehq.com"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

  

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
