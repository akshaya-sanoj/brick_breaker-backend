// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  highestScore: { type: Number, default: 0 },
  highestCombo: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  totalBricksDestroyed: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  unlockedSkins: { type: [String], default: ['#00f0ff'] }
}, { timestamps: true });

// Hash password before saving (Remove 'next' parameter completely)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);