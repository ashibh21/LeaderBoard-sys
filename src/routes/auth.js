const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

// User registration route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if user already exist
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object and save to MongoDB
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  console.log("here3");

  try {
    // Find the user in MongoDB
    const user = await User.findOne(
      { username },
      { password: 1, countOfAttempts: 1, timestamp: 1 } 
    );
    console.log("here2");

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    if (user.timestamp && user.countOfAttempts >= 2) {
      const diff = Date.now() - user.timestamp;
      if (diff < 30000) {
        return res
          .status(401)
          .json({ message: "Account is locked. try after 30 sec" });
      }
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      if (user.countOfAttempts >= 2) {
        await User.findOneAndUpdate(
          { username },
          { $set: { timestamp: Date.now() } }
        );
        return res
          .status(401)
          .json({ message: "Account is locked. try after 30 sec" });
      }
      await User.findOneAndUpdate(
        { username },
        { $set: { countOfAttempts: user.countOfAttempts + 1 } } // Update timestamp in DB
      );
      return res.status(401).json({ message: "Invalid username or password." });
    } else {
      await User.findOneAndUpdate(
        { username },
        { $set: { countOfAttempts: 0 } } // Update timestamp in DB
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
