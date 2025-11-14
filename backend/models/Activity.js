const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  squad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Squad',
    required: true
  },
  type: {
    type: String,
    enum: ['habit_completed', 'level_up', 'badge_earned', 'streak_milestone', 'joined_squad'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    habitName: String,
    points: Number,
    streak: Number,
    level: Number,
    badgeName: String
  },
  cheers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ squad: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
