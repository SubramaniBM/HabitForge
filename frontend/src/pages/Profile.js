import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaTrophy, FaMedal, FaUsers, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import ConfirmDialog from '../components/ConfirmDialog';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, step: 1 });

  const isOwnProfile = !id || id === currentUser?.id;

  useEffect(() => {
    fetchUserProfile();
  }, [id, currentUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // If no id provided, use current user's id
      const profileId = id || currentUser?.id;
      
      if (!profileId) {
        setLoading(false);
        return;
      }
      
      const response = await usersAPI.getProfile(profileId);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setConfirmDialog({ isOpen: true, step: 1 });
  };

  const confirmDeleteAccount = async () => {
    if (confirmDialog.step === 1) {
      setConfirmDialog({ isOpen: true, step: 2 });
    } else {
      try {
        await usersAPI.deleteAccount();
        setConfirmDialog({ isOpen: false, step: 1 });
        logout();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        setConfirmDialog({ isOpen: false, step: 1 });
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-page page-container">
      <div className="container">
        <div className="profile-header card">
          <div className="profile-avatar-large">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-username">{user.username}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-stats-bar">
              <div className="profile-stat">
                <FaTrophy className="profile-stat-icon level" />
                <span className="profile-stat-label">Level</span>
                <span className="profile-stat-value">{user.level}</span>
              </div>
              <div className="profile-stat">
                <FaMedal className="profile-stat-icon points" />
                <span className="profile-stat-label">Points</span>
                <span className="profile-stat-value">{user.points}</span>
              </div>
              <div className="profile-stat">
                <FaUsers className="profile-stat-icon squads" />
                <span className="profile-stat-label">Squads</span>
                <span className="profile-stat-value">{user.squads?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="badges-section">
            <h2><FaMedal /> Achievements</h2>
            {user.badges && user.badges.length > 0 ? (
              <div className="badges-grid">
                {user.badges.map((badge, index) => (
                  <div key={index} className="badge-item card">
                    <div className="badge-icon">{badge.icon || <FaTrophy />}</div>
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-date">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-state-icon">🏅</div>
                <div className="empty-state-text">No badges yet</div>
                <p>Complete habits to earn achievements!</p>
              </div>
            )}
          </div>

          <div className="squads-section">
            <h2><FaUsers /> Squads</h2>
            {user.squads && user.squads.length > 0 ? (
              <div className="profile-squads-list">
                {user.squads.map(squad => (
                  <div key={squad._id} className="profile-squad-item card">
                    <div className="profile-squad-icon">{squad.icon || <FaUsers />}</div>
                    <div className="profile-squad-info">
                      <h3>{squad.name}</h3>
                      <p>{squad.members?.length || 0} members</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-state-icon">🤝</div>
                <div className="empty-state-text">Not in any squads</div>
                <p>Join a squad to connect with others!</p>
              </div>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="danger-zone card">
            <h3><FaExclamationTriangle /> Danger Zone</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button className="btn btn-danger-solid" onClick={handleDeleteAccount}>
              <FaTrash /> Delete Account
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, step: 1 })}
        onConfirm={confirmDeleteAccount}
        title={confirmDialog.step === 1 ? "Delete Account" : "Final Confirmation"}
        message={confirmDialog.step === 1 
          ? "Are you sure you want to delete your account? This action cannot be undone. All your habits, squads, and data will be permanently deleted."
          : "This is your last chance! Are you absolutely sure you want to delete your account?"
        }
        confirmText={confirmDialog.step === 1 ? "Continue" : "Delete Forever"}
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};

export default Profile;
