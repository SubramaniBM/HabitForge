const mongoose = require('mongoose');

const squadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    points: {
      type: Number,
      default: 0
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 10
  },
  weeklyGoal: {
    target: {
      type: Number,
      default: 100
    },
    current: {
      type: Number,
      default: 0
    },
    week: {
      type: Number,
      default: 0
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  category: {
    type: String,
    enum: ['fitness', 'productivity', 'learning', 'wellness', 'mixed'],
    default: 'mixed'
  },
  icon: {
    type: String,
    default: '🎯'
  }
}, {
  timestamps: true
});

// Method to add member
squadSchema.methods.addMember = function(userId) {
  if (this.members.length >= this.maxMembers) {
    return { success: false, message: 'Squad is full' };
  }
  
  const alreadyMember = this.members.some(
    member => member.user.toString() === userId.toString()
  );
  
  if (alreadyMember) {
    return { success: false, message: 'Already a member' };
  }
  
  this.members.push({ user: userId });
  return { success: true };
};

// Method to remove member
squadSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(
    member => member.user.toString() !== userId.toString()
  );
};

// Method to add points to a member
squadSchema.methods.addMemberPoints = function(userId, points) {
  const member = this.members.find(
    m => m.user.toString() === userId.toString()
  );
  
  if (member) {
    member.points += points;
    this.weeklyGoal.current += points;
    return true;
  }
  return false;
};

// Method to reset weekly goal
squadSchema.methods.resetWeeklyGoal = function() {
  const now = new Date();
  const currentWeek = this.getWeekNumber(now);
  const currentYear = now.getFullYear();
  
  if (this.weeklyGoal.week !== currentWeek || this.weeklyGoal.year !== currentYear) {
    this.weeklyGoal.current = 0;
    this.weeklyGoal.week = currentWeek;
    this.weeklyGoal.year = currentYear;
  }
};

// Helper to get week number
squadSchema.methods.getWeekNumber = function(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

module.exports = mongoose.model('Squad', squadSchema);
