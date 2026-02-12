const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
    secret: 'sensorium-referral-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 } // 1 hour
}));

// Initialize SQLite database
const db = new sqlite3.Database('./referrals.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create tables
function initializeDatabase() {
    // Referrals table
    db.run(`CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_name TEXT NOT NULL,
        referrer_email TEXT NOT NULL,
        friend_name TEXT NOT NULL,
        friend_email TEXT NOT NULL,
        friend_phone TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Admin users table (default admin: username=admin, password=admin123)
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (!err) {
            // Create default admin user if not exists
            const defaultPassword = 'admin123';
            bcrypt.hash(defaultPassword, 10, (err, hash) => {
                if (!err) {
                    db.run(`INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)`,
                        ['admin', hash],
                        (err) => {
                            if (!err) {
                                console.log('Default admin user created (username: admin, password: admin123)');
                                console.log('IMPORTANT: Please change the default password after first login!');
                            }
                        }
                    );
                }
            });
        }
    });
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.adminId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// API Routes

// Submit referral
app.post('/api/referrals', (req, res) => {
    const { referrerName, referrerEmail, friendName, friendEmail, friendPhone, message } = req.body;

    if (!referrerName || !referrerEmail || !friendName || !friendEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `INSERT INTO referrals (referrer_name, referrer_email, friend_name, friend_email, friend_phone, message)
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [referrerName, referrerEmail, friendName, friendEmail, friendPhone, message], function(err) {
        if (err) {
            console.error('Error inserting referral:', err);
            return res.status(500).json({ error: 'Failed to save referral' });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                req.session.adminId = user.id;
                req.session.username = user.username;
                res.json({ success: true, username: user.username });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Check admin session
app.get('/api/admin/check', (req, res) => {
    if (req.session.adminId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Get all referrals (admin only)
app.get('/api/admin/referrals', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM referrals ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Error fetching referrals:', err);
            return res.status(500).json({ error: 'Failed to fetch referrals' });
        }
        res.json(rows);
    });
});

// Delete referral (admin only)
app.delete('/api/admin/referrals/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM referrals WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete referral' });
        }
        res.json({ success: true, deleted: this.changes });
    });
});

// Change admin password
app.post('/api/admin/change-password', isAuthenticated, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password required' });
    }

    db.get('SELECT * FROM admin_users WHERE id = ?', [req.session.adminId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'User not found' });
        }

        bcrypt.compare(currentPassword, user.password_hash, (err, result) => {
            if (!result) {
                return res.status(401).json({ error: 'Current password incorrect' });
            }

            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to hash password' });
                }

                db.run('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, req.session.adminId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update password' });
                    }
                    res.json({ success: true });
                });
            });
        });
    });
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});
