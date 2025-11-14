import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { squadsAPI } from '../services/api';
import { FaSearch, FaUsers, FaPlus, FaLock, FaGlobe } from 'react-icons/fa';
import './SquadDiscovery.css';

const SquadDiscovery = () => {
  const [squads, setSquads] = useState([]);
  const [filteredSquads, setFilteredSquads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['all', 'fitness', 'productivity', 'learning', 'wellness', 'mixed'];

  useEffect(() => {
    fetchPublicSquads();
  }, []);

  useEffect(() => {
    filterSquads();
  }, [searchTerm, selectedCategory, squads]);

  const fetchPublicSquads = async () => {
    try {
      setLoading(true);
      const response = await squadsAPI.getAll({ public: true });
      setSquads(response.data);
      setFilteredSquads(response.data);
    } catch (error) {
      console.error('Error fetching squads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSquads = () => {
    let filtered = squads;

    if (searchTerm) {
      filtered = filtered.filter(squad =>
        squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        squad.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(squad => squad.category === selectedCategory);
    }

    setFilteredSquads(filtered);
  };

  const handleJoinSquad = async (squadId) => {
    try {
      await squadsAPI.join(squadId);
      fetchPublicSquads();
    } catch (error) {
      console.error('Error joining squad:', error);
    }
  };

  if (loading) {
    return <div className="loading">Finding squads...</div>;
  }

  return (
    <div className="squad-discovery-page page-container">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Discover Squads</h1>
            <p className="page-subtitle">Find your community and start building habits together</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Create Squad
          </button>
        </div>

        <div className="discovery-filters card">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search squads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredSquads.length > 0 ? (
          <div className="squads-grid">
            {filteredSquads.map(squad => (
              <div key={squad._id} className="squad-card card">
                <div className="squad-card-header">
                  <div className="squad-card-icon">{squad.icon}</div>
                  <div className="squad-card-badge">
                    {squad.isPublic ? (
                      <span className="badge badge-success">
                        <FaGlobe /> Public
                      </span>
                    ) : (
                      <span className="badge">
                        <FaLock /> Private
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="squad-card-title">{squad.name}</h3>
                <p className="squad-card-description">
                  {squad.description || 'No description provided'}
                </p>

                <div className="squad-card-stats">
                  <div className="stat">
                    <FaUsers />
                    <span>{squad.members.length}/{squad.maxMembers} members</span>
                  </div>
                  <div className="stat">
                    <span className="category-tag">{squad.category}</span>
                  </div>
                </div>

                <div className="squad-card-actions">
                  <Link to={`/squads/${squad._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleJoinSquad(squad._id)}
                    disabled={squad.members.length >= squad.maxMembers}
                  >
                    {squad.members.length >= squad.maxMembers ? 'Full' : 'Join Squad'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No squads found</div>
            <p>Try adjusting your search or create a new squad!</p>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create Squad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquadDiscovery;
