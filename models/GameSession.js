const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, default: 0 },
  bricksDestroyed: { type: Number, required: true, default: 0 },
  maxCombo: { type: Number, default: 0 },
  status: { type: String, enum: ['STARTED', 'COMPLETED', 'FAILED'], default: 'STARTED' }
}, { timestamps: true });

module.exports = mongoose.model('GameSession', gameSessionSchema);