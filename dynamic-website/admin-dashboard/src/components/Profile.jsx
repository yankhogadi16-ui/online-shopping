import React, { useState } from 'react';
import api from '../api';

function Profile() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const email = localStorage.getItem('email');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admins/password', { newPassword });
      setMessage('Password updated successfully!');
      setNewPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Profile & Security</h2>
      <p>Logged in as: <strong>{email}</strong></p>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input 
          type="password" 
          placeholder="New Password" 
          value={newPassword} 
          onChange={e => setNewPassword(e.target.value)} 
          required 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', background: '#FFC107', color: '#000', border: 'none', cursor: 'pointer' }}>
          Change Password
        </button>
      </form>
    </div>
  );
}

export default Profile;
