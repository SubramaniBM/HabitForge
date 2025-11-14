const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

// @route   GET /api/activities/squad/:squadId
// @desc    Get activity feed for a squad
// @access  Private
router.get('/squad/:squadId', auth, async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    
    const activities = await Activity.find({ squad: req.params.squadId })
      .populate('user', 'username avatar level')
      .populate('cheers.user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/activities/:id/cheer
// @desc    Add a cheer to an activity
// @access  Private
router.post('/:id/cheer', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Check if user already cheered
    const alreadyCheered = activity.cheers.some(
      cheer => cheer.user.toString() === req.userId
    );
    
    if (alreadyCheered) {
      // Remove cheer (toggle)
      activity.cheers = activity.cheers.filter(
        cheer => cheer.user.toString() !== req.userId
      );
    } else {
      // Add cheer
      activity.cheers.push({ user: req.userId });
    }
    
    await activity.save();
    await activity.populate('user', 'username avatar level');
    await activity.populate('cheers.user', 'username avatar');
    
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/user/:userId
// @desc    Get activity feed for a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    
    const activities = await Activity.find({ user: req.params.userId })
      .populate('squad', 'name icon')
      .populate('cheers.user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
