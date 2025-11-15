const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Squad = require('../models/Squad');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @route   GET /api/squads
// @desc    Get all public squads or user's squads
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { public: isPublic, my } = req.query;
    
    let query = {};
    
    if (my === 'true') {
      // Get user's squads
      query = { 'members.user': req.userId };
    } else if (isPublic === 'true') {
      // Get public squads
      query = { isPublic: true };
    }
    
    const squads = await Squad.find(query)
      .populate('creator', 'username avatar level')
      .populate('members.user', 'username avatar level points')
      .sort({ createdAt: -1 });
    
    res.json(squads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/squads/:id
// @desc    Get single squad details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id)
      .populate('creator', 'username avatar level')
      .populate('members.user', 'username avatar level points');
    
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    
    // Check weekly goal
    squad.resetWeeklyGoal();
    await squad.save();
    
    res.json(squad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/squads
// @desc    Create a new squad
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic, maxMembers, category, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Squad name is required' });
    }
    
    const squad = new Squad({
      name,
      description,
      creator: req.userId,
      isPublic: isPublic !== undefined ? isPublic : true,
      maxMembers: maxMembers || 10,
      category: category || 'mixed',
      icon: icon || '🎯',
      members: [{ user: req.userId }]
    });
    
    // Set weekly goal
    const now = new Date();
    squad.weeklyGoal.week = squad.getWeekNumber(now);
    squad.weeklyGoal.year = now.getFullYear();
    
    await squad.save();
    
    // Add squad to user
    const user = await User.findById(req.userId);
    user.squads.push(squad._id);
    await user.save();
    
    await squad.populate('creator', 'username avatar level');
    await squad.populate('members.user', 'username avatar level points');
    
    res.status(201).json(squad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/squads/:id/join
// @desc    Join a squad
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id);
    
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    
    const result = squad.addMember(req.userId);
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    await squad.save();
    
    // Add squad to user
    const user = await User.findById(req.userId);
    if (!user.squads.includes(squad._id)) {
      user.squads.push(squad._id);
      await user.save();
    }
    
    // Create activity
    const activity = new Activity({
      user: req.userId,
      squad: squad._id,
      type: 'joined_squad',
      description: `joined the squad!`,
      metadata: {}
    });
    await activity.save();
    
    await squad.populate('creator', 'username avatar level');
    await squad.populate('members.user', 'username avatar level points');
    
    res.json(squad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/squads/:id/leave
// @desc    Leave a squad
// @access  Private
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id);
    
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    
    // Can't leave if you're the creator and there are other members
    if (squad.creator.toString() === req.userId && squad.members.length > 1) {
      return res.status(400).json({ message: 'Transfer ownership before leaving' });
    }
    
    // Remove squad from user
    const user = await User.findById(req.userId);
    user.squads = user.squads.filter(s => s.toString() !== squad._id.toString());
    await user.save();
    
    // If this is the last member, delete the squad
    if (squad.members.length === 1) {
      await Squad.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Left squad successfully. Squad has been deleted as you were the last member.' });
    }
    
    // Otherwise just remove the member
    squad.removeMember(req.userId);
    await squad.save();
    
    res.json({ message: 'Left squad successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/squads/:id/leaderboard
// @desc    Get squad leaderboard
// @access  Private
router.get('/:id/leaderboard', auth, async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id)
      .populate('members.user', 'username avatar level points');
    
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    
    // Sort members by points
    const leaderboard = squad.members
      .map(m => ({
        userId: m.user._id,
        username: m.user.username,
        avatar: m.user.avatar,
        level: m.user.level,
        squadPoints: m.points,
        totalPoints: m.user.points,
        joinedAt: m.joinedAt
      }))
      .sort((a, b) => b.squadPoints - a.squadPoints);
    
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/squads/:id
// @desc    Update squad details
// @access  Private (Creator only)
router.put('/:id', auth, async (req, res) => {
  try {
    const squad = await Squad.findById(req.params.id);
    
    if (!squad) {
      return res.status(404).json({ message: 'Squad not found' });
    }
    
    if (squad.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the creator can update squad details' });
    }
    
    const { name, description, isPublic, maxMembers, weeklyGoalTarget, category, icon } = req.body;
    
    if (name) squad.name = name;
    if (description !== undefined) squad.description = description;
    if (isPublic !== undefined) squad.isPublic = isPublic;
    if (maxMembers) squad.maxMembers = maxMembers;
    if (weeklyGoalTarget) squad.weeklyGoal.target = weeklyGoalTarget;
    if (category) squad.category = category;
    if (icon) squad.icon = icon;
    
    await squad.save();
    await squad.populate('creator', 'username avatar level');
    await squad.populate('members.user', 'username avatar level points');
    
    res.json(squad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
