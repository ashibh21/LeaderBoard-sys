const router = require('express').Router();
const redisClient = require('../config/redisClient');
const authenticateJWT = require('../middleware/auth');

// Submit score route
router.post('/submit', authenticateJWT, async (req, res) => {
  const { game, score } = req.body;
  const { username } = req.user; // Extract the username from the JWT token

  if (!game || !score) {
    return res
      .status(400)
      .json({ message: 'Username, game, and score are required' });
  }

  try {
    // Ensure score is an integer
    const parsedScore = parseInt(score, 10);

    // Add score to Redis sorted set for the specific game
    const key = `leaderboard:${game}`;
    await redisClient.zAdd(key, { score: parsedScore, value: username });

    // Optional: Add score to global leaderboard as well
    await redisClient.zAdd('leaderboard:global', {
      score: parsedScore,
      value: username,
    });

    res.status(200).json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
