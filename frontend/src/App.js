import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SquadDashboard from './pages/SquadDashboard';
import SquadDiscovery from './pages/SquadDiscovery';
import Profile from './pages/Profile';
import About from './pages/About';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/squads/find" element={
              <PrivateRoute>
                <SquadDiscovery />
              </PrivateRoute>
            } />
            <Route path="/squads/:id" element={
              <PrivateRoute>
                <SquadDashboard />
              </PrivateRoute>
            } />
            <Route path="/profile/:id" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
