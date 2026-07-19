import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import ContentManager from './components/ContentManager';
import AdminManagement from './components/AdminManagement';
import Profile from './components/Profile';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Y Cool Admin
      </div>
      <div className="sidebar-nav">
        <Link to="/" className={`sidebar-link ${isActive('/')}`}>Content Manager</Link>
        <Link to="/admins" className={`sidebar-link ${isActive('/admins')}`}>Manage Admins</Link>
        <Link to="/profile" className={`sidebar-link ${isActive('/profile')}`}>Profile Settings</Link>
      </div>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">Log Out</button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout><ContentManager /></Layout></PrivateRoute>} />
        <Route path="/admins" element={<PrivateRoute><Layout><AdminManagement /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
