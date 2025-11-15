import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaTrophy, FaSignOutAlt } from 'react-icons/fa';
import { GiAnvil } from 'react-icons/gi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <GiAnvil className="brand-icon" />
            <span>HabitForge</span>
          </Link>

          <div className="navbar-menu">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                  <FaTrophy /> Dashboard
                </Link>
                <Link to="/squads/find" className={`nav-link ${isActive('/squads/find')}`}>
                  <FaUsers /> Find Squads
                </Link>
                <Link to={`/profile/${user?.id}`} className={`nav-link ${isActive(`/profile/${user?.id}`)}`}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="nav-link logout-link">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
                <Link to="/login" className={`nav-link ${isActive('/login')}`}>Login</Link>
                <Link to="/register" className={`nav-link ${isActive('/register')}`}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
