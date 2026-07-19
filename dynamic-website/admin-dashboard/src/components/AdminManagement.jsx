import React, { useState } from 'react';
import api from '../api';

function AdminManagement() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admins', { email, password });
      setMessage('Admin created successfully!');
      setEmail('');
      setPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Error creating admin.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Create New Admin</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          placeholder="New Admin Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="New Admin Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', background: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Create Admin
        </button>
      </form>
    </div>
  );
}

export default AdminManagement;
