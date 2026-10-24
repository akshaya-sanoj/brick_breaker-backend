// server/controllers/gameController.js
const GameSession = require('../models/GameSession');
const User = require('../models/User');

// Start a new game session
exports.startGame = async (req, res) => {
  try {
    const session = await GameSession.create({
      user: req.user._id,
      status: 'STARTED'
    });

    res.status(201).json({ sessionId: session._id, message: 'Game started' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Complete a game session and update user stats
// Complete a game session and update user stats
exports.completeGame = async (req, res) => {
  try {
    const { sessionId, score, bricksDestroyed, maxCombo } = req.body;

    const session = await GameSession.findById(sessionId);
    
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found or unauthorized' });
    }

    if (session.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Session already completed' });
    }

    // Update Session
    session.score = score;
    session.bricksDestroyed = bricksDestroyed;
    session.maxCombo = maxCombo;
    session.status = 'COMPLETED';
    await session.save();

    // Update User Stats
    const user = await User.findById(req.user._id);
    user.totalGames += 1;
    user.totalBricksDestroyed += bricksDestroyed;
    
    if (score > user.highestScore) user.highestScore = score;
    if (maxCombo > user.highestCombo) user.highestCombo = maxCombo;

    // --- NEW: ECONOMY MATH ---
    // Award 1 coin for every 10 points scored
    const coinsEarned = Math.floor(score / 10);
    user.coins += coinsEarned;

    await user.save();

    // Return the updated user object (including their new coin total) to the frontend
    res.status(200).json({ 
      message: 'Game data saved successfully', 
      stats: user,
      coinsEarned: coinsEarned
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};// Add or verify this controller function in server/controllers/gameController.js
exports.buySkin = async (req, res) => {
  try {
    const { skinColor, cost } = req.body;
    const userId = req.user.id; // From auth middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.coins < cost) {
      return res.status(400).json({ message: 'Not enough coins' });
    }

    if (user.unlockedSkins.includes(skinColor)) {
      return res.status(400).json({ message: 'Skin already unlocked' });
    }

    user.coins -= cost;
    user.unlockedSkins.push(skinColor);
    await user.save();

    res.status(200).json({ 
      message: 'Skin purchased successfully', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        coins: user.coins, 
        unlockedSkins: user.unlockedSkins 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};