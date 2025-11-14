import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaSearch, FaLink, FaCheck } from 'react-icons/fa';
import { usersAPI, squadsAPI } from '../services/api';
import './InviteModal.css';

const InviteModal = ({ squadId, squadName, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [inviting, setInviting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const squadLink = `${window.location.origin}/squads/${squadId}`;

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const response = await usersAPI.search(query);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleInvite = async (userId) => {
    try {
      setInviting(true);
      // In a real app, you'd send an invite notification
      // For now, we'll just show the squad link they can share
      alert(`Share this link with the user:\n${squadLink}`);
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setInviting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(squadLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Invite to {squadName}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="invite-section">
            <h3><FaLink /> Share Squad Link</h3>
            <p className="section-description">Anyone with this link can view and join the squad</p>
            <div className="link-box">
              <input 
                type="text" 
                value={squadLink} 
                readOnly 
                onClick={(e) => e.target.select()}
              />
              <button 
                className={`btn ${linkCopied ? 'btn-success' : 'btn-primary'}`}
                onClick={handleCopyLink}
              >
                {linkCopied ? <><FaCheck /> Copied!</> : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="invite-section">
            <h3><FaUserPlus /> Invite by Username</h3>
            <p className="section-description">Search for users and share the squad link</p>
            
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(user => (
                  <div key={user._id} className="user-result">
                    <div className="user-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.username}</div>
                      <div className="user-level">Level {user.level} • {user.points} points</div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleInvite(user._id)}
                      disabled={inviting}
                    >
                      Share Link
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="no-results">
                <p>No users found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
