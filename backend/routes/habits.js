const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @route   GET /api/habits
// @desc    Get all habits for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId, isActive: true })
      .sort({ createdAt: -1 });
    
    // Update streaks
    habits.forEach(habit => habit.updateStreak());
    
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits
// @desc    Create a new habit
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, frequency, targetDays, color } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const habit = new Habit({
      title,
      description,
      category,
      frequency,
      targetDays,
      color,
      user: req.userId
    });
    
    await habit.save();
    
    // Check and award badges for creating habit
    const user = await User.findById(req.userId);
    const newBadges = [];
    
    // First habit badge
    const habitCount = await Habit.countDocuments({ user: req.userId });
    console.log('Creating habit - habitCount:', habitCount, 'existing badges:', user.badges.map(b => b.name));
    if (habitCount === 1 && !user.badges.some(b => b.name === 'Beginner')) {
      const badge = {
        name: 'Beginner',
        icon: '🎯',
        description: 'Created your first habit',
        earnedAt: new Date()
      };
      user.badges.push(badge);
      newBadges.push(badge);
    }
    
    // Multitasker badge (5 habits)
    if (habitCount === 5 && !user.badges.some(b => b.name === 'Multitasker')) {
      const badge = {
        name: 'Multitasker',
        icon: '🎨',
        description: 'Created 5 different habits',
        earnedAt: new Date()
      };
      user.badges.push(badge);
      newBadges.push(badge);
    }
    
    // Habit Collector badge (10 habits)
    if (habitCount === 10 && !user.badges.some(b => b.name === 'Habit Collector')) {
      const badge = {
        name: 'Habit Collector',
        icon: '📚',
        description: 'Created 10 different habits',
        earnedAt: new Date()
      };
      user.badges.push(badge);
      newBadges.push(badge);
    }
    
    if (newBadges.length > 0) {
      await user.save();
      console.log('Awarded new badges:', newBadges.map(b => b.name));
    }
    
    console.log('Sending response with newBadges:', newBadges);
    res.status(201).json({ habit, newBadges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/habits/:id/complete
// @desc    Mark habit as complete for today
// @access  Private
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    const result = habit.complete();
    
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    
    await habit.save();
    
    // Add points to user
    const user = await User.findById(req.userId);
    const leveledUp = user.addPoints(result.points);
    
    // Check and award badges
    const newBadges = await checkAndAwardBadges(user, habit, result.streak);
    console.log('Habit completed - newBadges:', newBadges.map(b => b.name));
    
    await user.save();
    
    // Create activities for user's squads
    if (user.squads && user.squads.length > 0) {
      const Squad = require('../models/Squad');
      
      for (const squadId of user.squads) {
        // Add points to squad member
        const squad = await Squad.findById(squadId);
        if (squad) {
          squad.addMemberPoints(req.userId, result.points);
          await squad.save();
          
          // Create activity
          const activity = new Activity({
            user: req.userId,
            squad: squadId,
            type: 'habit_completed',
            description: `completed "${habit.title}"`,
            metadata: {
              habitName: habit.title,
              points: result.points,
              streak: result.streak
            }
          });
          await activity.save();
        }
      }
      
      // Check for level up activity
      if (leveledUp) {
        for (const squadId of user.squads) {
          const activity = new Activity({
            user: req.userId,
            squad: squadId,
            type: 'level_up',
            description: `reached Level ${user.level}!`,
            metadata: {
              level: user.level
            }
          });
          await activity.save();
        }
      }
      
      // Check for streak milestone
      if (result.streak % 7 === 0 && result.streak > 0) {
        for (const squadId of user.squads) {
          const activity = new Activity({
            user: req.userId,
            squad: squadId,
            type: 'streak_milestone',
            description: `achieved a ${result.streak}-day streak on "${habit.title}"! 🔥`,
            metadata: {
              habitName: habit.title,
              streak: result.streak
            }
          });
          await activity.save();
        }
      }
      
      // Badge earned activities
      if (newBadges.length > 0) {
        for (const badge of newBadges) {
          for (const squadId of user.squads) {
            const activity = new Activity({
              user: req.userId,
              squad: squadId,
              type: 'badge_earned',
              description: `earned the "${badge.name}" badge! ${badge.icon}`,
              metadata: {
                badgeName: badge.name
              }
            });
            await activity.save();
          }
        }
      }
    }
    
    res.json({
      habit,
      points: result.points,
      streak: result.streak,
      leveledUp,
      userLevel: user.level,
      userPoints: user.points,
      newBadges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to check and award badges
async function checkAndAwardBadges(user, habit, currentStreak) {
  const newBadges = [];
  
  // Helper to check if user already has a badge
  const hasBadge = (badgeName) => {
    return user.badges.some(b => b.name === badgeName);
  };
  
  // Helper to award badge
  const awardBadge = (name, icon, description) => {
    if (!hasBadge(name)) {
      const badge = { name, icon, description, earnedAt: new Date() };
      user.badges.push(badge);
      newBadges.push(badge);
    }
  };
  
  // Get total habit completions
  const allHabits = await Habit.find({ user: user._id });
  let totalCompletions = 0;
  allHabits.forEach(h => {
    totalCompletions += h.completions.length;
  });
  
  // First Habit Badge
  if (allHabits.length === 1 && totalCompletions === 1) {
    awardBadge('First Step', '🌱', 'Created and completed your first habit');
  }
  
  // Streak Badges
  if (currentStreak >= 7 && !hasBadge('Week Warrior')) {
    awardBadge('Week Warrior', '🔥', 'Maintained a 7-day streak');
  }
  
  if (currentStreak >= 30 && !hasBadge('Month Master')) {
    awardBadge('Month Master', '⚡', 'Achieved a 30-day streak');
  }
  
  if (currentStreak >= 100 && !hasBadge('Century Champion')) {
    awardBadge('Century Champion', '💯', 'Reached an incredible 100-day streak');
  }
  
  // Completion Badges
  if (totalCompletions >= 10 && !hasBadge('Dedicated')) {
    awardBadge('Dedicated', '🎯', 'Completed 10 habits');
  }
  
  if (totalCompletions >= 50 && !hasBadge('Committed')) {
    awardBadge('Committed', '💪', 'Completed 50 habits');
  }
  
  if (totalCompletions >= 100 && !hasBadge('Hundred Club')) {
    awardBadge('Hundred Club', '🏆', 'Reached 100 total completions');
  }
  
  if (totalCompletions >= 365 && !hasBadge('Year Long')) {
    awardBadge('Year Long', '🎊', 'Completed 365 habits - a full year!');
  }
  
  // Level Badges
  if (user.level >= 5 && !hasBadge('Rising Star')) {
    awardBadge('Rising Star', '⭐', 'Reached Level 5');
  }
  
  if (user.level >= 10 && !hasBadge('Habit Hero')) {
    awardBadge('Habit Hero', '🦸', 'Reached Level 10');
  }
  
  if (user.level >= 20 && !hasBadge('Legendary')) {
    awardBadge('Legendary', '👑', 'Reached Level 20');
  }
  
  if (user.level >= 50 && !hasBadge('Master Forger')) {
    awardBadge('Master Forger', '🔨', 'Reached Level 50 - True Master!');
  }
  
  // Habit Count Badges
  if (allHabits.length >= 5 && !hasBadge('Multitasker')) {
    awardBadge('Multitasker', '🎨', 'Created 5 different habits');
  }
  
  if (allHabits.length >= 10 && !hasBadge('Habit Collector')) {
    awardBadge('Habit Collector', '📚', 'Created 10 different habits');
  }
  
  return newBadges;
}

// @route   PUT /api/habits/:id
// @desc    Update a habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, frequency, targetDays, color } = req.body;
    
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    if (title) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (category) habit.category = category;
    if (frequency) habit.frequency = frequency;
    if (targetDays) habit.targetDays = targetDays;
    if (color) habit.color = color;
    
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/habits/:id
// @desc    Delete (archive) a habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    habit.isActive = false;
    await habit.save();
    
    res.json({ message: 'Habit archived successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/habits/stats
// @desc    Get habit statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId, isActive: true });
    
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
    const avgStreak = habits.length > 0 
      ? habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length 
      : 0;
    const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
    
    res.json({
      totalHabits,
      totalCompletions,
      avgStreak: Math.round(avgStreak * 10) / 10,
      longestStreak
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
