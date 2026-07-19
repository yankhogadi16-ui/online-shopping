const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Public route to get all content
router.get('/', (req, res) => {
    db.all(`SELECT key, value FROM content`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving content' });
        }
        
        const content = {};
        rows.forEach(row => {
            try {
                // Attempt to parse JSON if it looks like an array or object
                if (row.value.startsWith('[') || row.value.startsWith('{')) {
                    content[row.key] = JSON.parse(row.value);
                } else {
                    content[row.key] = row.value;
                }
            } catch(e) {
                content[row.key] = row.value;
            }
        });
        res.json(content);
    });
});

// Protected route to update content
router.put('/', authenticateToken, (req, res) => {
    const updates = req.body; 
    
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO content (key, value) VALUES (?, ?)
                                 ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
        for (const key in updates) {
            if (Object.hasOwnProperty.call(updates, key)) {
                let val = updates[key];
                if (typeof val === 'object' && val !== null) {
                    val = JSON.stringify(val);
                }
                stmt.run(key, val);
            }
        }
        stmt.finalize((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating content' });
            }
            res.json({ message: 'Content updated successfully' });
        });
    });
});

module.exports = router;
