# Sensorium Referral System - Setup Guide

## Overview
This is a complete backend referral system for the Sensorium Clinical Research website. It allows patients to refer friends to clinical trials, with all referrals stored in a database and accessible through a password-protected admin dashboard.

## Features
- ✅ Patient referral form submission
- ✅ SQLite database for data storage
- ✅ Password-protected admin dashboard
- ✅ View all referrals with statistics
- ✅ Delete referrals
- ✅ Change admin password
- ✅ Thank you popup with auto-redirect
- ✅ Session-based authentication

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
cd /Users/markyuzuk/CascadeProjects/Sensorium
npm install --save express sqlite3 bcrypt express-session body-parser
npm install --save-dev nodemon
```

Or use the package-referral.json file:
```bash
cp package-referral.json package.json
npm install
```

### Step 2: Start the Server
```bash
node server.js
```

Or for development with auto-restart:
```bash
npm run dev
```

The server will start on **http://localhost:3000**

## Usage

### For Users (Patients)
1. Navigate to the "For Patients" page: http://localhost:3000/for-patients-option3-visual-story.html
2. Scroll to the "Refer a Friend" section
3. Fill out the form with your information and your friend's information
4. Click "Send Referral"
5. A thank you popup will appear for 3 seconds
6. You'll be redirected back to the For Patients page

### For Administrators

#### First Time Login
1. Navigate to: **http://localhost:3000/admin**
2. Login with default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. **IMPORTANT:** Change the default password immediately after first login!

#### Admin Dashboard Features
- **View Statistics:** See total referrals, this week's referrals, and this month's referrals
- **View All Referrals:** See complete list with referrer info, friend info, and messages
- **Delete Referrals:** Remove referrals from the database
- **Change Password:** Update your admin password for security

## File Structure
```
/Users/markyuzuk/CascadeProjects/Sensorium/
├── server.js                              # Backend server
├── admin-dashboard.html                   # Admin interface
├── for-patients-option3-visual-story.html # Updated with referral form
├── referrals.db                           # SQLite database (created automatically)
├── package-referral.json                  # Dependencies
└── REFERRAL-SYSTEM-README.md             # This file
```

## Database Schema

### Referrals Table
- `id` - Auto-incrementing primary key
- `referrer_name` - Name of person making referral
- `referrer_email` - Email of person making referral
- `friend_name` - Name of referred friend
- `friend_email` - Email of referred friend
- `friend_phone` - Phone number of referred friend (optional)
- `message` - Additional message (optional)
- `created_at` - Timestamp of referral

### Admin Users Table
- `id` - Auto-incrementing primary key
- `username` - Admin username
- `password_hash` - Bcrypt hashed password
- `created_at` - Timestamp of account creation

## API Endpoints

### Public Endpoints
- `POST /api/referrals` - Submit a new referral

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check` - Check if authenticated
- `GET /api/admin/referrals` - Get all referrals
- `DELETE /api/admin/referrals/:id` - Delete a referral
- `POST /api/admin/change-password` - Change admin password

## Security Features
- Passwords are hashed using bcrypt
- Session-based authentication
- CSRF protection through session cookies
- Admin-only routes protected by middleware
- SQL injection prevention through parameterized queries

## Switching from Static Server to Backend Server

### Current Setup (Static Server)
You're currently running: `python3 -m http.server 8080`

### New Setup (Backend Server)
1. Stop the Python server (Ctrl+C)
2. Start the Node.js server: `node server.js`
3. Access your site at: **http://localhost:3000** (instead of :8080)

### Running Both Servers (Optional)
If you want to keep the static server running:
- Static server: http://localhost:8080 (for other pages)
- Backend server: http://localhost:3000 (for referral system)

Note: The referral form will only work when accessing through port 3000.

## Production Deployment

### Important Security Changes for Production
1. **Change the session secret** in `server.js`:
   ```javascript
   secret: 'your-very-long-random-secret-key-here'
   ```

2. **Enable HTTPS** and set secure cookies:
   ```javascript
   cookie: { secure: true, maxAge: 3600000 }
   ```

3. **Use environment variables** for sensitive data:
   ```javascript
   const PORT = process.env.PORT || 3000;
   const SESSION_SECRET = process.env.SESSION_SECRET;
   ```

4. **Use a production database** (PostgreSQL, MySQL) instead of SQLite

5. **Add rate limiting** to prevent abuse

6. **Set up proper logging** and monitoring

## Troubleshooting

### "Cannot find module 'express'"
Run: `npm install`

### "Port 3000 already in use"
Change the PORT in server.js or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill
```

### "Database locked" error
Close any other connections to the database file

### Referral form not submitting
1. Check if server is running: `http://localhost:3000`
2. Check browser console for errors (F12)
3. Verify you're accessing the site through port 3000, not 8080

### Can't login to admin dashboard
1. Verify default credentials: admin / admin123
2. Check server console for errors
3. Delete `referrals.db` to reset (will lose all data)

## Support
For issues or questions, check the server console logs for detailed error messages.

## License
Proprietary - Sensorium Clinical Research
