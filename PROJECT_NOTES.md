# Project Notes

## Production Deployment - April 13, 2026

### Sensorium Clinical Research Demo Sites & Client Portal Updates

#### Deployment Information
- **Domain**: https://www.yourmark.ai
- **Deployment Date**: April 13, 2026
- **Deployment Method**: SSH via deploy-existing.sh script
- **SSL Certificate**: Let's Encrypt (auto-renewing)
- **Status**: ✅ Successfully Deployed

#### What Was Deployed

**Sensorium Demo Sites:**
- Complete Rose-themed demo site (`/rose-demo/`)
- Complete Blue-themed demo site (`/blue-demo/`)
- 20+ HTML pages per theme including:
  - Landing pages (patient-centric)
  - About Us (comprehensive)
  - Origin Story pages
  - Our People (leadership team)
  - FAQ pages
  - Careers, Contact, Partnerships
  - For Patients, For Sponsors, For Site Owners pages
- All images and assets properly organized in `/images/` folders
- Logo images: `rose-thumbnail.png` and `blue-thumbnail.png`

**Client Portal Enhancements:**
- Demo cards now display actual screenshot thumbnails instead of circular badges
- Reorganized layout: demo cards on left (2/3 width), Design Principles on right (1/3 width)
- Added "Option 1" and "Option 2" labels to demo titles
- Updated version labels: "Rose Colored Version" and "Midnight Blue Version"
- Increased whitespace between page heading and demo cards (mb-20)
- Design Principles panel with sticky positioning
- Demos open in new window with 80% zoom level

**Bug Fixes:**
- Fixed all internal navigation links to use correct `/rose-demo/` and `/blue-demo/` paths
- Corrected logo image paths on all pages
- Fixed Origin Story button links (now points to actual origin-story.html pages)
- Fixed Our People button links (now points to actual our-people.html pages)
- Fixed FAQ links on about pages
- Ensured all images load correctly with proper paths

#### Deployment Process

1. **SSH Key Setup:**
   - Added SSH public key to Digital Ocean droplet via console
   - Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEOjkHvozPsE1h3h9HwXW5dkAkB6wa1yLTenoAgB06tp`

2. **Build & Deploy:**
   ```bash
   npm run build  # Build production version
   export DROPLET_IP=204.48.31.51
   ./deploy-existing.sh  # Deploy to server
   ```

3. **Domain Configuration:**
   - Updated Nginx config to serve `yourmark.ai` and `www.yourmark.ai`
   - Installed SSL certificate via certbot
   - Enabled HTTPS with automatic redirect

4. **Git Commit:**
   ```bash
   git add -A
   git commit -m "feat: Complete Sensorium demo fixes and Client Portal enhancements"
   git push origin main
   ```

#### Live URLs

**Production Site:**
- Main: https://www.yourmark.ai
- Client Portal: https://www.yourmark.ai/1 (Access code: `Welcome2026`)

**Demo Sites:**
- Rose Demo: https://www.yourmark.ai/rose-demo/landing-v4-patient-centric.html
- Blue Demo: https://www.yourmark.ai/blue-demo/landing-v4-patient-centric.html

#### Future Deployment Instructions

To deploy updates in the future:

1. **Make changes locally and test:**
   ```bash
   npm run dev  # Test locally at http://localhost:5173
   ```

2. **Commit changes to Git:**
   ```bash
   git add -A
   git commit -m "Description of changes"
   git push origin main
   ```

3. **Deploy to production:**
   ```bash
   export DROPLET_IP=204.48.31.51
   ./deploy-existing.sh
   ```

The deployment script will:
- Pull latest code from GitHub
- Install dependencies
- Build production version
- Update Nginx configuration
- Restart web server

#### SSH Connection Troubleshooting

If SSH connection fails:
1. Verify server is running in Digital Ocean console
2. Check SSH key is in server's `~/.ssh/authorized_keys`
3. Test connection: `ssh root@204.48.31.51`
4. If needed, add key via Digital Ocean console:
   ```bash
   echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEOjkHvozPsE1h3h9HwXW5dkAkB6wa1yLTenoAgB06tp markyuzuk@gmail.com" >> ~/.ssh/authorized_keys
   ```

---

## GitHub Repository Setup - February 11, 2026

### Repository Information
- **Repository URL**: https://github.com/markyuzuk/YourMark.git
- **Repository Name**: YourMark
- **Visibility**: Public
- **Branch**: main

### Setup Details
- Git repository initialized locally
- Initial commit created with 23 files (4,181 insertions)
- Remote origin connected to GitHub
- All files successfully pushed to GitHub

### Files Committed
- React application source files
- Vite configuration
- Tailwind CSS configuration
- Package dependencies (package.json, package-lock.json)
- README.md
- nginx.conf
- All component and page files

### Commands Used
```bash
git init
git add .
git commit -m "Initial commit: MyMark AI project"
git remote add origin https://github.com/markyuzuk/YourMark.git
git branch -M main
git push -u origin main
```

### Access
View the repository at: https://github.com/markyuzuk/YourMark

---

## Production Deployment - February 11, 2026

### Deployment Information
- **Droplet IP Address**: 204.48.31.51
- **Live URL**: http://204.48.31.51
- **Server**: Digital Ocean Droplet (Ubuntu)
- **Web Server**: Nginx 1.24.0
- **Application Directory**: /var/www/yourmark-ai
- **Deployment Status**: ✅ Successfully Deployed

### Deployment Method
Manual SSH deployment to existing Digital Ocean droplet

---

## Manual Deployment Instructions

### Prerequisites
- Digital Ocean droplet running Ubuntu 20.04 or later
- SSH access to the droplet
- Droplet IP address

### Step 1: SSH into Droplet
```bash
ssh root@204.48.31.51
```

### Step 2: Deploy Application
Run these commands on the droplet:

```bash
# Update system and install dependencies
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx nodejs npm git curl

# Create application directory
mkdir -p /var/www/yourmark-ai
cd /var/www/yourmark-ai

# Clone repository
git clone https://github.com/markyuzuk/YourMark.git .

# Install dependencies
npm install

# Build the application
npm run build

# Configure Nginx
cat > /etc/nginx/sites-available/yourmark-ai <<'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/yourmark-ai/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_vary on;
    gzip_min_length 1024;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/yourmark-ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### Step 3: Verify Deployment
Visit http://204.48.31.51 in your browser

---

## Updating the Deployment

When you make changes to the application:

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Your commit message"
git push
```

### Step 2: Update on Droplet
```bash
ssh root@204.48.31.51
cd /var/www/yourmark-ai
git pull origin main
npm install
npm run build
systemctl restart nginx
```

---

## Automated Deployment Options

### Option 1: Using deploy-existing.sh Script
```bash
export DROPLET_IP=204.48.31.51
./deploy-existing.sh
```

### Option 2: GitHub Actions CI/CD
Set up GitHub secrets:
- `DROPLET_IP`: 204.48.31.51
- `SSH_PRIVATE_KEY`: Your SSH private key

Then every `git push` automatically deploys.

---

## Deployment Files Created

### Deployment Scripts
- **deploy-existing.sh** - Deploy to existing droplet (requires SSH access)
- **auto-deploy.sh** - Create and deploy to new droplet (requires DO API token)
- **deploy.sh** - Original manual deployment script
- **.github/workflows/deploy.yml** - GitHub Actions CI/CD workflow

### Documentation
- **DEPLOYMENT.md** - Manual deployment guide
- **AUTOMATED_DEPLOYMENT.md** - Automated deployment with DO API
- **EXISTING_DROPLET_DEPLOYMENT.md** - Deploy to existing droplet guide

---

## Deployment Verification Results

### HTTP Server Status
- ✅ Nginx running correctly
- ✅ HTTP 200 OK response
- ✅ Server: nginx/1.24.0 (Ubuntu)

### Application Files
- ✅ HTML index file serving
- ✅ JavaScript bundles accessible
- ✅ CSS stylesheets accessible
- ✅ React application properly built and minified

### Configuration
- ✅ Gzip compression enabled
- ✅ Caching headers configured
- ✅ SPA routing configured (try_files)
- ✅ Static asset optimization enabled

---

## Next Steps (Optional)

### Custom Domain Setup
1. Point domain's A record to 204.48.31.51
2. Update Nginx server_name directive
3. Install SSL certificate with Let's Encrypt

### SSL Certificate Installation
```bash
ssh root@204.48.31.51
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

### Monitoring
```bash
# Check Nginx status
systemctl status nginx

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

---

## Domain and SSL Configuration - February 11, 2026

### Domain Information
- **Domain Name**: yourmark.ai
- **Registrar**: GoDaddy
- **DNS Provider**: Digital Ocean
- **A Record**: yourmark.ai → 204.48.31.51
- **WWW Record**: www.yourmark.ai → 204.48.31.51
- **DNS Status**: ⏳ Propagation in progress (15 min - 48 hours)

### SSL Certificate Setup
- **Certificate Provider**: Let's Encrypt (Free)
- **Certificate Type**: Domain Validated (DV)
- **Validity Period**: 90 days
- **Auto-Renewal**: Enabled (renews every 60 days)
- **Status**: ⏳ Ready to install once DNS propagates

### SSL Setup Script Created
**File**: `setup-ssl.sh`

Automated SSL setup that:
- Verifies DNS propagation
- Installs Certbot
- Updates Nginx configuration
- Obtains SSL certificate
- Configures HTTPS with auto-redirect
- Sets up automatic renewal

**Usage**:
```bash
export EMAIL=your@email.com
./setup-ssl.sh
```

### SSL Documentation
**File**: `SSL_SETUP.md`

Complete guide including:
- DNS verification steps
- Automated and manual setup options
- Troubleshooting guide
- Security best practices
- Maintenance commands

### Expected URLs After SSL Setup
- **Primary**: https://yourmark.ai
- **WWW**: https://www.yourmark.ai
- **HTTP Redirect**: http://yourmark.ai → https://yourmark.ai

---

## Complete File Structure

### Application Files
```
/Users/markyuzuk/CascadeProjects/MyMark/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Input.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── GetStarted.jsx
│   │   ├── ClientPortal.jsx
│   │   └── ScheduleConsultation.jsx
│   └── lib/
│       └── utils.js
├── public/
│   └── logo.svg
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── nginx.conf
```

### Deployment Scripts
```
├── deploy.sh                    # Original manual deployment
├── deploy-existing.sh           # Deploy to existing droplet
├── auto-deploy.sh              # Create and deploy new droplet
└── setup-ssl.sh                # Automated SSL setup
```

### GitHub Actions
```
└── .github/
    └── workflows/
        └── deploy.yml          # CI/CD workflow
```

### Documentation Files
```
├── README.md                   # Project overview
├── PROJECT_NOTES.md           # This file - complete reference
├── DEPLOYMENT.md              # Manual deployment guide
├── AUTOMATED_DEPLOYMENT.md    # Auto-create droplet guide
├── EXISTING_DROPLET_DEPLOYMENT.md  # Existing droplet guide
└── SSL_SETUP.md               # SSL/HTTPS setup guide
```

---

## Session Summary - February 11, 2026

### Tasks Completed

1. **Development Server Setup**
   - Started Vite dev server on http://localhost:5173
   - Browser preview enabled

2. **Git Repository Initialization**
   - Initialized local git repository
   - Created initial commit with 23 files
   - Connected to GitHub remote

3. **GitHub Repository Creation**
   - Created public repository: YourMark
   - Pushed all files to GitHub
   - Repository URL: https://github.com/markyuzuk/YourMark.git

4. **Deployment Scripts Created**
   - `deploy.sh` - Manual deployment to droplet
   - `auto-deploy.sh` - Automated droplet creation and deployment
   - `deploy-existing.sh` - Deploy to existing droplet
   - GitHub Actions workflow for CI/CD

5. **Documentation Created**
   - DEPLOYMENT.md - Manual deployment guide
   - AUTOMATED_DEPLOYMENT.md - API-based deployment
   - EXISTING_DROPLET_DEPLOYMENT.md - Existing droplet guide
   - PROJECT_NOTES.md - Complete project reference

6. **Production Deployment**
   - Deployed to existing Digital Ocean droplet (204.48.31.51)
   - Installed Nginx, Node.js, Git
   - Built and deployed React application
   - Configured Nginx for SPA routing
   - Enabled gzip compression and caching
   - Verified deployment: ✅ http://204.48.31.51

7. **Domain Configuration**
   - Domain: yourmark.ai (from GoDaddy)
   - Changed nameservers to Digital Ocean
   - Added A records pointing to 204.48.31.51
   - DNS propagation in progress

8. **SSL Setup Preparation**
   - Created `setup-ssl.sh` automated SSL setup script
   - Created `SSL_SETUP.md` comprehensive SSL guide
   - Ready to install Let's Encrypt certificate once DNS propagates

### Current Status

#### ✅ Completed
- Local development environment
- Git repository and GitHub setup
- Production deployment to Digital Ocean
- HTTP access working (http://204.48.31.51)
- Domain configured (yourmark.ai)
- SSL setup scripts ready

#### ⏳ In Progress
- DNS propagation for yourmark.ai
- SSL certificate installation (waiting for DNS)

#### 📝 Next Steps
1. Wait for DNS propagation (check with `nslookup yourmark.ai`)
2. Run `./setup-ssl.sh` to install SSL certificate
3. Access site at https://yourmark.ai

---

## Quick Reference Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build
```

### Git Operations
```bash
# Commit changes
git add .
git commit -m "Your message"
git push

# Check status
git status
```

### Deployment
```bash
# Deploy to existing droplet
export DROPLET_IP=204.48.31.51
./deploy-existing.sh

# Manual update on droplet
ssh root@204.48.31.51
cd /var/www/yourmark-ai
git pull && npm install && npm run build && systemctl restart nginx
```

### SSL Setup
```bash
# Check DNS propagation
nslookup yourmark.ai

# Install SSL certificate (after DNS propagates)
export EMAIL=your@email.com
./setup-ssl.sh
```

### Monitoring
```bash
# Check deployment
curl -I http://204.48.31.51

# Check HTTPS (after SSL setup)
curl -I https://yourmark.ai

# SSH to droplet
ssh root@204.48.31.51

# View logs
ssh root@204.48.31.51 'tail -f /var/log/nginx/access.log'
```

---

## Important URLs

- **GitHub Repository**: https://github.com/markyuzuk/YourMark
- **Current Live Site**: http://204.48.31.51
- **Future Live Site**: https://yourmark.ai (after SSL setup)
- **Dev Server**: http://localhost:5173
- **DNS Checker**: https://dnschecker.org/#A/yourmark.ai

---

## Technology Stack

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Vite 5.0.8
- Tailwind CSS 3.3.6
- Lucide React (icons)

### Build Tools
- Vite (bundler)
- PostCSS
- Autoprefixer

### Server
- Nginx 1.24.0
- Ubuntu (Digital Ocean)
- Node.js (for build process)

### Deployment
- Digital Ocean Droplet
- GitHub Actions (CI/CD)
- Let's Encrypt (SSL)

---

## Project Timeline

- **11:09 AM** - Started dev server
- **11:11 AM** - Checked GitHub status (not initialized)
- **11:12 AM** - Initialized git and created GitHub repository
- **11:25 AM** - Added project notes documentation
- **11:28 AM** - Committed project notes to GitHub
- **11:31 AM** - Created Digital Ocean deployment scripts
- **11:40 AM** - Created existing droplet deployment script
- **11:43 AM** - Deployed to production (204.48.31.51)
- **11:59 AM** - Verified deployment successful
- **12:01 PM** - Updated project notes with deployment details
- **12:06 PM** - Configured domain (yourmark.ai)
- **12:09 PM** - Created SSL setup automation
- **3:52 PM** - Final project notes update

---

## Support and Resources

### Documentation
- All deployment guides in repository root
- PROJECT_NOTES.md (this file) - complete reference
- SSL_SETUP.md - SSL configuration guide

### External Resources
- Digital Ocean Docs: https://docs.digitalocean.com
- Let's Encrypt: https://letsencrypt.org/docs/
- Nginx Docs: https://nginx.org/en/docs/
- Vite Docs: https://vitejs.dev/
- React Docs: https://react.dev/

### Troubleshooting
- Check deployment guides for common issues
- Review Nginx logs: `/var/log/nginx/error.log`
- Verify DNS: `nslookup yourmark.ai`
- Test SSL: https://www.ssllabs.com/ssltest/

---

## Session Summary - February 12, 2026

### Tasks Completed

1. **Development Server Started**
   - Started Vite dev server on http://localhost:5173
   - Browser preview enabled for testing

2. **PDF Directory Page Redesign**
   - Redesigned `/public/SensoriumProject1/deployment-package/public/pdf-directory.html`
   - Changed from card grid layout to clean table format
   - Implemented rose color gradient progression across sections:
     - Main Pages: Lightest rose (primary-100) with darkest buttons (primary-600-700)
     - For Patients: Light rose (primary-200) with dark buttons (primary-500-600)
     - For Sponsors: Medium rose (primary-300) with medium buttons (primary-400-500)
     - For Site Owners: Darker rose (primary-400) with lighter buttons (primary-300-400)
     - Resources: Darkest rose (primary-500) with lightest buttons (primary-200-300)
   - Updated section header from "Main Pages" to "Home/CTA/About"
   - Changed footer copyright from Sensorium to YourMark.ai

3. **Client Portal Updates** (`src/pages/ClientPortal.jsx`)
   - Added new "Rose Color Sandbox Area" tile (V5 - Sandbox)
   - Updated Version 5 tile to link to new tabular PDF directory
   - Changed Version 5 icon from text badge to table preview image (`/pdf-table-preview.png`)
   - Changed V5 - Sandbox icon to landing page screenshot (`/sandbox-preview.png`)
   - Added important note to V5 - Sandbox description: "Research and Insights Area not yet available"
   - Increased button sizes from `sm` to `lg` for better visibility
   - Added 80% opacity to preview images for subtle transparency effect
   - Both tiles configured with `isExternal: true` for proper navigation

4. **Landing Page Updates (Reverted)**
   - Temporarily added "Rose Colored Sandbox Area" section to landing page
   - Section removed per user request

5. **Resources & Insights Links (Reverted)**
   - Initially investigated broken links in about-us page
   - Attempted conversions from Next.js to HTML
   - All changes reverted, links restored to PDF paths

### Files Modified

#### Created/Updated
- `/public/SensoriumProject1/deployment-package/public/pdf-directory.html` - Complete redesign with table layout
- `/src/pages/ClientPortal.jsx` - Added V5 - Sandbox tile, updated icons and buttons
- `/public/sandbox-preview.png` - Landing page screenshot for V5 - Sandbox tile
- `/public/pdf-table-preview.png` - Table screenshot for Version 5 tile

#### Reverted
- `/public/resources/library/index.html` - Created then deleted
- `/public/resources/white-papers/index.html` - Created then deleted
- `/public/resources/news/index.html` - Created then deleted
- Landing page sandbox section - Added then removed

### Current Status

#### ✅ Production Ready
- Client Portal with two active rose-colored tiles
- Version 5: Links to redesigned tabular PDF directory
- V5 - Sandbox: Links to landing page with note about unavailable features
- All buttons enlarged for better UX
- Preview images with subtle transparency
- Footer updated with YourMark.ai branding

#### 🔧 Technical Details
- Dev server: http://localhost:5173
- Access code: Welcome2026
- External links configured for static file navigation
- Image opacity set to 80% for visual consistency

### Next Steps
- Deploy changes to production (204.48.31.51)
- Test all links and preview functionality
- Verify image loading on production server

---

**Last Updated**: February 12, 2026 at 6:30 PM

---

## Session Summary - February 18, 2026

### Tasks Completed

1. **Client Portal Image Opacity Update**
   - Removed 80% opacity from preview images in tiles
   - Changed `opacity-80` class back to full opacity for better image visibility
   - File: `/src/pages/ClientPortal.jsx`

2. **About Us Page - Resources & Insights Section (Attempted & Reverted)**
   - Initially added FAQs card to Resources & Insights section
   - Updated tagline to include "frequently asked questions"
   - Changed grid from 3 to 4 columns (md:grid-cols-2 lg:grid-cols-4)
   - Added rose-colored FAQs card with question mark icon
   - **Reverted all changes** per user request back to original 3-card layout
   - File: `/public/SensoriumProject1/deployment-package/about-us-option2-comprehensive.html`

3. **Tagline Brainstorming**
   - Provided 7 alternative tagline options for site network messaging
   - Focused on balancing network strength with community authenticity
   - Emphasized contrast with standardized/corporate networks

### Files Modified

#### Modified (Reverted to Original)
- `/public/SensoriumProject1/deployment-package/about-us-option2-comprehensive.html` - No net changes (added then removed FAQs)
- `/src/pages/ClientPortal.jsx` - Removed opacity-80 class from preview images

### Current Status

#### ✅ Active
- Dev server running on http://localhost:5173
- Client Portal accessible at /1 with access code: Welcome2026
- About Us page maintains original 3-card Resources & Insights layout
- Preview images display at full opacity

#### 📝 Notes
- User exploring tagline options for site network messaging
- Emphasis on community connection vs. standardized networks
- FAQs section considered but not implemented at this time

---

**Last Updated**: February 18, 2026 at 1:32 PM
