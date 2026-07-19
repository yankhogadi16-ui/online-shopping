import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import ContentManager from './components/ContentManager';
import AdminManagement from './components/AdminManagement';
import Profile from './components/Profile';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '1rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Content</Link>
        <Link to="/admins" style={{ color: '#fff', textDecoration: 'none' }}>Manage Admins</Link>
        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
        <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'transparent', color: '#fff', border: '1px solid #fff', cursor: 'pointer' }}>Logout</button>
      </nav>
      <div style={{ padding: '2rem' }}>
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
