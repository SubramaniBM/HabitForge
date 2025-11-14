import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaUsers, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <FaFire className="brand-icon" />
            <span>HabitForge</span>
          </Link>

          <div className="navbar-menu">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  <FaTrophy /> Dashboard
                </Link>
                <Link to="/squads/find" className="nav-link">
                  <FaUsers /> Find Squads
                </Link>
                
                <div className="navbar-user">
                  <Link to={`/profile/${user?.id}`} className="user-profile">
                    <div className="user-avatar">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="username">{user?.username}</span>
                      <span className="user-level">Level {user?.level}</span>
                    </div>
                  </Link>
                  
                  <button onClick={handleLogout} className="btn-logout">
                    <FaSignOutAlt />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
