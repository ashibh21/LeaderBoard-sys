require("dotenv").config({ path: "./.env.dev" });
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const scoreRoutes = require("./src/routes/score");
const leaderboardRoutes = require("./src/routes/leaderboard");
require("./src/config/redisClient"); // Import the Redis client

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use the authentication routes
app.use("/auth", authRoutes);
app.use("/score", scoreRoutes);
app.use("/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Leaderboard Service is Running!");
});
console.log(process.env.REDIS_URL);
// Function to connect to all services
async function connectToServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to services:", error);
  }
}

// Initialize connections and start the server
connectToServices();
