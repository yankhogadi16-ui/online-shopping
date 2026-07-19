const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Protected route to create a new admin
router.post('/', authenticateToken, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        db.run(`INSERT INTO admins (email, password) VALUES (?, ?)`, [email, hash], function(err) {
            if (err) {
                // Check if it's a unique constraint error
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Error creating user' });
            }
            res.status(201).json({ message: 'Admin created successfully', id: this.lastID, email });
        });
    });
});

// Protected route for an admin to change their own password
router.put('/password', authenticateToken, (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    const saltRounds = 10;
    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // We use req.user.id which comes from the verified JWT
        db.run(`UPDATE admins SET password = ? WHERE id = ?`, [hash, req.user.id], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating password' });
            }
            res.json({ message: 'Password updated successfully' });
        });
    });
});

module.exports = router;
