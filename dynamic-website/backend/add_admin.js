const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const email = 'Yankhogadi16@gmail.com';
const password = '12345678';

db.get(`SELECT * FROM admins WHERE email = ?`, [email], (err, row) => {
    if (err) {
        console.error(err.message);
    } else if (!row) {
        bcrypt.hash(password, 10, (err, hash) => {
            db.run(`INSERT INTO admins (email, password) VALUES (?, ?)`, [email, hash], (err) => {
                if (err) console.error('Error adding admin:', err);
                else console.log('Admin Yankhogadi16@gmail.com added successfully.');
                db.close();
            });
        });
    } else {
        console.log('Admin already exists.');
        db.close();
    }
});
