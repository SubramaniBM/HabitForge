import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { habitsAPI, squadsAPI } from '../services/api';
import { FaPlus, FaFire, FaTrophy, FaUsers, FaChartLine, FaBullseye } from 'react-icons/fa';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import AchievementNotification from '../components/AchievementNotification';
import ConfirmDialog from '../components/ConfirmDialog';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [squads, setSquads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, habitId: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Display next achievement from queue
    console.log('Achievement queue:', achievementQueue, 'Current:', currentAchievement);
    if (achievementQueue.length > 0 && !currentAchievement) {
      console.log('Showing achievement:', achievementQueue[0]);
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [achievementQueue, currentAchievement]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [habitsRes, squadsRes, statsRes] = await Promise.all([
        habitsAPI.getAll(),
        squadsAPI.getAll({ my: true }),
        habitsAPI.getStats()
      ]);

      setHabits(habitsRes.data);
      setSquads(squadsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitComplete = async (habitId) => {
    try {
      const response = await habitsAPI.complete(habitId);
      console.log('Complete habit response:', response.data);
      console.log('New badges from completion:', response.data.newBadges);
      fetchDashboardData(); // Refresh data
      
      // Show achievement notifications
      if (response.data.newBadges && response.data.newBadges.length > 0) {
        console.log('Adding completion badges to queue:', response.data.newBadges);
        setAchievementQueue(prev => [...prev, ...response.data.newBadges]);
      }
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      const response = await habitsAPI.create(habitData);
      console.log('Create habit response:', response.data);
      console.log('New badges received:', response.data.newBadges);
      fetchDashboardData();
      setShowCreateModal(false);
      
      // Show achievement notifications
      if (response.data.newBadges && response.data.newBadges.length > 0) {
        console.log('Adding badges to queue:', response.data.newBadges);
        setAchievementQueue(prev => [...prev, ...response.data.newBadges]);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    setConfirmDialog({ isOpen: true, habitId });
  };

  const confirmDeleteHabit = async () => {
    try {
      await habitsAPI.delete(confirmDialog.habitId);
      setConfirmDialog({ isOpen: false, habitId: null });
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting habit:', error);
      setConfirmDialog({ isOpen: false, habitId: null });
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-page page-container">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Welcome back, {user?.username}! 👋</h1>
            <p className="page-subtitle">Let's make today count!</p>
          </div>
          <div className="user-stats-quick">
            <div className="stat-item">
              <FaTrophy className="stat-icon" />
              <div>
                <div className="stat-value">Level {user?.level}</div>
                <div className="stat-label">{user?.points} points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="stats-grid grid grid-4">
            <div className="stat-card card">
              <div className="stat-card-icon" style={{ backgroundColor: '#667eea' }}>
                <FaFire />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.longestStreak}</div>
                <div className="stat-card-label">Longest Streak</div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-card-icon" style={{ backgroundColor: '#50C878' }}>
                <FaChartLine />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.totalCompletions}</div>
                <div className="stat-card-label">Total Completions</div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-card-icon" style={{ backgroundColor: '#F39C12' }}>
                <FaTrophy />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.totalHabits}</div>
                <div className="stat-card-label">Active Habits</div>
              </div>
            </div>

            <div className="stat-card card">
              <div className="stat-card-icon" style={{ backgroundColor: '#E74C3C' }}>
                <FaUsers />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{squads.length}</div>
                <div className="stat-card-label">Squads Joined</div>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {/* Habits Section */}
          <div className="habits-section">
            <div className="section-header">
              <h2>My Habits</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> New Habit
              </button>
            </div>

            {habits.length > 0 ? (
              <div className="habits-grid">
                {habits.map(habit => (
                  <HabitCard
                    key={habit._id}
                    habit={habit}
                    onComplete={handleHabitComplete}
                    onDelete={handleDeleteHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-state-icon"><FaBullseye /></div>
                <div className="empty-state-text">No habits yet</div>
                <p>Create your first habit to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <FaPlus /> Create Habit
                </button>
              </div>
            )}
          </div>

          {/* Squads Section */}
          <div className="squads-section">
            <div className="section-header">
              <h2>My Squads</h2>
              <Link to="/squads/find" className="btn btn-primary">
                <FaUsers /> Find Squads
              </Link>
            </div>

            {squads.length > 0 ? (
              <div className="squads-list">
                {squads.map(squad => (
                  <Link 
                    key={squad._id} 
                    to={`/squads/${squad._id}`}
                    className="squad-item card"
                  >
                    <div className="squad-icon">{squad.icon}</div>
                    <div className="squad-info">
                      <h3>{squad.name}</h3>
                      <p>{squad.members.length} members</p>
                    </div>
                    <div className="squad-progress">
                      <div className="progress-label">
                        Weekly Goal: {squad.weeklyGoal.current}/{squad.weeklyGoal.target}
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min((squad.weeklyGoal.current / squad.weeklyGoal.target) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-state-icon">🤝</div>
                <div className="empty-state-text">No squads yet</div>
                <p>Join a squad to connect with others!</p>
                <Link to="/squads/find" className="btn btn-primary">
                  <FaUsers /> Browse Squads
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateHabit}
        />
      )}

      {currentAchievement && (
        <AchievementNotification
          badge={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, habitId: null })}
        onConfirm={confirmDeleteHabit}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};

export default Dashboard;
