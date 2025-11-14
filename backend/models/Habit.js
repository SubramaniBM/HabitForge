const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['health', 'fitness', 'productivity', 'learning', 'mindfulness', 'social', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  targetDays: {
    type: [String], // ['monday', 'tuesday', etc.]
    default: []
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  completions: [{
    date: {
      type: Date,
      required: true
    },
    points: {
      type: Number,
      default: 10
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#4A90E2'
  }
}, {
  timestamps: true
});

// Method to complete habit
habitSchema.methods.complete = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if already completed today
  const alreadyCompleted = this.completions.some(completion => {
    const completionDate = new Date(completion.date);
    completionDate.setHours(0, 0, 0, 0);
    return completionDate.getTime() === today.getTime();
  });
  
  if (alreadyCompleted) {
    return { success: false, message: 'Already completed today' };
  }
  
  // Calculate points (base + streak bonus)
  const basePoints = 10;
  const streakBonus = Math.min(this.currentStreak * 2, 50); // Max 50 bonus
  const totalPoints = basePoints + streakBonus;
  
  // Add completion
  this.completions.push({
    date: today,
    points: totalPoints
  });
  
  // Update streak
  this.currentStreak += 1;
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  return { success: true, points: totalPoints, streak: this.currentStreak };
};

// Method to check and update streak
habitSchema.methods.updateStreak = function() {
  if (this.completions.length === 0) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastCompletion = this.completions[this.completions.length - 1];
  const lastDate = new Date(lastCompletion.date);
  lastDate.setHours(0, 0, 0, 0);
  
  // If last completion was not yesterday or today, reset streak
  if (lastDate.getTime() < yesterday.getTime()) {
    this.currentStreak = 0;
  }
};

module.exports = mongoose.model('Habit', habitSchema);
