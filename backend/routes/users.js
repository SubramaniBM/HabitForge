const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Private
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('squads', 'name icon');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('squads', 'name icon members');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (username && username !== user.username) {
      // Check if username is taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    })
    .select('username avatar level points')
    .limit(10);
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account and all associated data
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const Habit = require('../models/Habit');
    const Squad = require('../models/Squad');
    const Activity = require('../models/Activity');

    // Delete user's habits
    await Habit.deleteMany({ user: req.userId });

    // Remove user from all squads and delete empty squads
    const squads = await Squad.find({ 'members.user': req.userId });
    for (const squad of squads) {
      squad.removeMember(req.userId);
      
      // If squad becomes empty, delete it
      if (squad.members.length === 0) {
        await Squad.findByIdAndDelete(squad._id);
      } else {
        await squad.save();
      }
    }

    // Delete user's activities
    await Activity.deleteMany({ user: req.userId });

    // Delete user account
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
