const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  squads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Squad'
  }],
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from points
userSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.points / 100) + 1;
  return this.level;
};

// Method to add points and check for level up
userSchema.methods.addPoints = function(points) {
  const oldLevel = this.level;
  this.points += points;
  this.calculateLevel();
  return this.level > oldLevel; // Returns true if leveled up
};

module.exports = mongoose.model('User', userSchema);
