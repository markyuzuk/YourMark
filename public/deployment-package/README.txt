SENSORIUM WEBSITE - DEPLOYMENT PACKAGE
Version 5.0 - February 12, 2026
=====================================

This folder contains all the files you need to deploy the Sensorium website
to https://www.yourmark.ai/SensoriumProject1

CONTENTS:
---------

HTML Pages (7 files):
  - landing-v4-patient-centric.html (Homepage)
  - for-patients-option3-visual-story.html
  - for-sponsors-option3-partnership.html
  - for-site-owners-option2-growth.html
  - about-us-option2-comprehensive.html
  - contact.html
  - join-clinical-trial.html

Backend Files (3 files):
  - server.js (Node.js backend server)
  - admin-dashboard.html (Admin interface)
  - package.json (Dependencies)

Assets:
  - MkiernanCEO.jpeg (CEO photo)
  - public/ (folder with additional HTML pages and assets)
  - pdfs/ (folder with PDF documents)

Documentation:
  - REFERRAL-SYSTEM-README.md (Backend setup guide)
  - CLIENT-REVIEW-INSTRUCTIONS.md (Client review guide)

DEPLOYMENT INSTRUCTIONS:
------------------------

1. Copy ALL files and folders from this directory to your server at:
   /var/www/html/SensoriumProject1/

2. Using FileZilla or any FTP/SFTP client:
   - Host: sftp://yourmark.ai
   - Port: 22
   - Username: [your SSH username]
   - Password: [your SSH password]
   
3. Navigate to /var/www/html/SensoriumProject1/ on the server

4. Drag and drop all files and folders from this deployment-package folder

5. After copying, SSH into your server and run:
   cd /var/www/html/SensoriumProject1
   sudo chown -R www-data:www-data .
   sudo chmod -R 755 .
   sudo npm install express sqlite3 bcrypt express-session body-parser
   pm2 start server.js --name sensorium
   pm2 save

6. Configure Nginx (see MANUAL-DEPLOYMENT-GUIDE.md in parent folder)

7. Access your site at:
   https://www.yourmark.ai/SensoriumProject1/landing-v4-patient-centric.html

ADMIN ACCESS:
-------------
URL: https://www.yourmark.ai/SensoriumProject1/admin
Username: admin
Password: admin123
(CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!)

SUPPORT:
--------
See MANUAL-DEPLOYMENT-GUIDE.md in the parent folder for detailed instructions.
