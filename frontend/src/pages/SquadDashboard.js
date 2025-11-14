import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { squadsAPI, activitiesAPI } from '../services/api';
import { FaTrophy, FaFire, FaHeart, FaUserPlus } from 'react-icons/fa';
import InviteModal from '../components/InviteModal';
import './SquadDashboard.css';

const SquadDashboard = () => {
  const { id } = useParams();
  const [squad, setSquad] = useState(null);
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchSquadData();
  }, [id]);

  const fetchSquadData = async () => {
    try {
      setLoading(true);
      const [squadRes, activitiesRes, leaderboardRes] = await Promise.all([
        squadsAPI.getById(id),
        activitiesAPI.getSquadFeed(id, { limit: 20 }),
        squadsAPI.getLeaderboard(id)
      ]);

      setSquad(squadRes.data);
      setActivities(activitiesRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (error) {
      console.error('Error fetching squad data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheer = async (activityId) => {
    try {
      await activitiesAPI.addCheer(activityId);
      fetchSquadData();
    } catch (error) {
      console.error('Error adding cheer:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading squad...</div>;
  }

  if (!squad) {
    return <div className="error">Squad not found</div>;
  }

  const goalProgress = (squad.weeklyGoal.current / squad.weeklyGoal.target) * 100;

  return (
    <div className="squad-dashboard-page page-container">
      <div className="container">
        <div className="squad-header card">
          <div className="squad-header-icon">{squad.icon}</div>
          <div className="squad-header-info">
            <h1 className="page-title">{squad.name}</h1>
            <p className="page-subtitle">{squad.description}</p>
            <div className="squad-meta">
              <span>{squad.members.length} members</span>
              <span>•</span>
              <span>{squad.category}</span>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
          >
            <FaUserPlus /> Invite Members
          </button>
        </div>

        <div className="squad-goal-card card">
          <h3>Weekly Team Goal</h3>
          <div className="goal-progress">
            <div className="goal-stats">
              <span className="goal-current">{squad.weeklyGoal.current}</span>
              <span className="goal-separator">/</span>
              <span className="goal-target">{squad.weeklyGoal.target} points</span>
            </div>
            <div className="progress-bar large">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(goalProgress, 100)}%` }}
              />
            </div>
            <p className="goal-message">
              {goalProgress >= 100 
                ? '🎉 Goal achieved! Amazing teamwork!' 
                : `${Math.round(100 - goalProgress)}% to go - keep it up!`}
            </p>
          </div>
        </div>

        <div className="squad-content">
          <div className="leaderboard-section">
            <h2><FaTrophy /> Leaderboard</h2>
            <div className="leaderboard card">
              {leaderboard.map((member, index) => (
                <div key={member.userId} className="leaderboard-item">
                  <div className="rank">{index + 1}</div>
                  <div className="member-avatar">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.username}</div>
                    <div className="member-level">Level {member.level}</div>
                  </div>
                  <div className="member-points">
                    {member.squadPoints} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-feed-section">
            <h2><FaFire /> Activity Feed</h2>
            <div className="activity-feed">
              {activities.length > 0 ? (
                activities.map(activity => (
                  <div key={activity._id} className="activity-item card">
                    <div className="activity-avatar">
                      {activity.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">
                        <strong>{activity.user?.username}</strong> {activity.description}
                      </p>
                      <div className="activity-meta">
                        <span className="activity-time">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                        {activity.metadata?.points && (
                          <span className="activity-points">
                            +{activity.metadata.points} points
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className={`cheer-btn ${activity.cheers?.some(c => c.user === activity.user?._id) ? 'cheered' : ''}`}
                      onClick={() => handleCheer(activity._id)}
                    >
                      <FaHeart /> {activity.cheers?.length || 0}
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state card">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">No activity yet</div>
                  <p>Complete habits to share your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <InviteModal
          squadId={id}
          squadName={squad.name}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default SquadDashboard;
