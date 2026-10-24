// server/controllers/leaderboardController.js
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch top 10 users sorted by highestScore in descending order
    const topUsers = await User.find()
      .sort({ highestScore: -1 })
      .limit(10)
      .select('name highestScore levelsCompleted totalBricksDestroyed'); // Only send necessary data
    
    res.status(200).json(topUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};