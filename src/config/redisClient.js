const redis = require('redis');

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Connect Redis when this module is loaded
async function connectRedis() {
  await redisClient.connect();
  console.log('Connected to Redis');
}

connectRedis(); // Automatically connect when imported

module.exports = redisClient;
