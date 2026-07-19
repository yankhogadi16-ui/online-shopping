const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create admins table
            db.run(`CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password TEXT
            )`);

            // Create content table
            db.run(`CREATE TABLE IF NOT EXISTS content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE,
                value TEXT
            )`);

            // Seed admin user
            const seedEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const seedPassword = process.env.ADMIN_PASSWORD || 'password123';
            
            db.get(`SELECT * FROM admins WHERE email = ?`, [seedEmail], (err, row) => {
                if (err) {
                    console.error(err.message);
                } else if (!row) {
                    const saltRounds = 10;
                    bcrypt.hash(seedPassword, saltRounds, (err, hash) => {
                        if (err) {
                            console.error('Error hashing password', err);
                        } else {
                            db.run(`INSERT INTO admins (email, password) VALUES (?, ?)`, [seedEmail, hash], (err) => {
                                if (err) {
                                    console.error('Error seeding admin', err);
                                } else {
                                    console.log('Seed admin created successfully.');
                                }
                            });
                        }
                    });
                }
            });

            // Seed initial content if empty
            db.get(`SELECT COUNT(*) as count FROM content`, [], (err, row) => {
                if (err) {
                    console.error(err.message);
                } else if (row.count === 0) {
                    const stmt = db.prepare(`INSERT INTO content (key, value) VALUES (?, ?)`);
                    
                    // Basic strings
                    stmt.run('siteTitle', 'Y Cool Electronics Marketplace');
                    stmt.run('heroTitle', 'Buy Phones & Accessories Across Malawi');
                    stmt.run('heroSubtitle', 'Find trusted shops, compare prices, and order through WhatsApp.');
                    stmt.run('footerText', '© 2026 Y Cool Electronics Marketplace. All Rights Reserved.');

                    // JSON Strings for Lists
                    const categories = [
                        { id: 1, name: 'iPhones' },
                        { id: 2, name: 'android' },
                        { id: 3, name: 'Laptops' },
                        { id: 4, name: 'Accessories' },
                        { id: 5, name: 'Speakers' },
                        { id: 6, name: 'Smart Watches' }
                    ];
                    stmt.run('categories', JSON.stringify(categories));

                    const products = [
                        { id: 1, image: 'iph13.jpeg', title: 'iPhone 13 Pro', price: 'MWK 1,200,000', link: '#' },
                        { id: 2, image: 'samsang.jpeg', title: 'Samsung S23', price: 'MWK 1,100,000', link: '#' },
                        { id: 3, image: 'hp.jpeg', title: 'HP EliteBook', price: 'MWK 850,000', link: '#' },
                        { id: 4, image: 'pods.jpeg', title: 'AirPods Pro', price: 'MWK 150,000', link: '#' }
                    ];
                    stmt.run('products', JSON.stringify(products));

                    const features = [
                        { id: 1, title: 'Trusted Shops', description: 'All shops are verified before selling.' },
                        { id: 2, title: 'Secure Payments', description: 'Payments are confirmed by our agents.' },
                        { id: 3, title: 'Fast Delivery', description: 'Products delivered across Malawi.' }
                    ];
                    stmt.run('features', JSON.stringify(features));

                    stmt.finalize();
                    console.log('Seed content created successfully.');
                }
            });
        });
    }
});

module.exports = db;
