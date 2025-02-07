const router = require('express').Router();
const redisClient = require('../config/redisClient');

// Get leaderboard route

router.get('/:game', async (req, res) => {
  const { game } = req.params;

  if (!game) {
    return res.status(400).json({ message: 'Game is required,' });
  }

  try {
    // Fetch top 10 users from Redis sorted set for the specific game
    const key = `leaderboard:${game}`;
    const leaderboard = await redisClient.zRangeWithScores(key, 0, 9, {
      REV: true,
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user rank for a specific game
router.get('/:game/rank/:username', async (req, res) => {
  const { game, username } = req.params;

  if (!game || !username) {
    return res.status(400).json({ message: 'Game and username are required.' });
  }

  try {
    const key = `leaderboard:${game}`;
    const rank = await redisClient.zRevRank(key, username);
    const score = await redisClient.zScore(key, username);

    if (rank === null) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Redis returns zero-based index, so we add 1 for human-readable rank
    res.status(200).json({ rank: rank + 1, score, username });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get top N players for a specific game
router.get('/:game/top/:count', async (req, res) => {
  const { game, count } = req.params;

  if (!game || !count) {
    return res.status(400).json({ message: 'Game and count are required' });
  }

  try {
    const key = `leaderboard:${game}`;
    const topPlayers = await redisClient.zRangeWithScores(key, 0, count - 1, {
      REV: true,
    });

    res.status(200).json({ topPlayers });
  } catch (error) {
    console.error('Error fetching top players:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get global leaderboard route
router.get('/global', async (req, res) => {
  try {
    // Fetch top 10 users from the global leaderboard
    const key = 'leaderboard:global';
    const leaderboard = await redisClient.zRangeWithScores(key, 0, 9, {
      REV: true,
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get user rank globally
router.get('/global/rank/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const key = 'leaderboard:global';
    const rank = await redisClient.zRevRank(key, username);
    const score = await redisClient.zScore(key, username);

    if (rank === null) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Redis returns zero-based index, so we add 1 for human-readable rank
    res.status(200).json({ rank: rank + 1, score, username });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get top N players globally
router.get('/global/top/:count', async (req, res) => {
  const { count } = req.params;

  if (!count) {
    return res.status(400).json({ message: 'Count is required' });
  }

  try {
    const key = 'leaderboard:global';
    const topPlayers = await redisClient.zRangeWithScores(key, 0, count - 1, {
      REV: true,
    });

    res.status(200).json({ topPlayers });
  } catch (error) {
    console.error('Error fetching global top players:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
