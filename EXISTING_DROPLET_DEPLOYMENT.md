# Deploy to Existing Digital Ocean Droplet

This guide shows you how to deploy your YourMark AI application to an **existing** Digital Ocean droplet.

## 🎯 Two Deployment Methods

### Method 1: Automated Script (Recommended)
One command deploys everything to your existing droplet.

### Method 2: GitHub Actions CI/CD
Automatically deploy every time you push to GitHub.

---

## 🚀 Method 1: Automated Script Deployment

### Prerequisites

1. **Existing Digital Ocean Droplet** running Ubuntu 20.04 or later
2. **SSH Access** to your droplet
3. **Droplet IP Address**

### Step 1: Ensure SSH Access

Make sure you can SSH into your droplet:

```bash
ssh root@YOUR_DROPLET_IP
```

If this works, you're ready to deploy!

### Step 2: Deploy with One Command

From your local machine:

```bash
# Set your droplet's IP address
export DROPLET_IP=123.45.67.89

# Deploy!
./deploy-existing.sh
```

That's it! The script will:
- ✅ Install all dependencies (Nginx, Node.js, Git)
- ✅ Clone your repository from GitHub
- ✅ Install npm packages
- ✅ Build your application
- ✅ Configure Nginx
- ✅ Start the web server

**Total time: ~2-3 minutes**

### Using a Different SSH Key

If your SSH key is not at `~/.ssh/id_rsa`:

```bash
export DROPLET_IP=123.45.67.89
export SSH_KEY=/path/to/your/ssh/key
./deploy-existing.sh
```

### Custom Domain

To deploy with a custom domain:

```bash
export DROPLET_IP=123.45.67.89
export DOMAIN=yourdomain.com
./deploy-existing.sh
```

Then set up SSL:
```bash
ssh root@$DROPLET_IP
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

---

## 🔄 Method 2: GitHub Actions (Automatic Deployment)

Deploy automatically every time you push code to GitHub.

### Step 1: Set Up SSH Key for GitHub Actions

If you don't already have an SSH key for your droplet:

```bash
# Generate a new SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_deploy

# Copy the public key
cat ~/.ssh/github_actions_deploy.pub
```

Add this public key to your droplet:

```bash
ssh root@YOUR_DROPLET_IP
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit
```

### Step 2: Add GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these two secrets:

| Secret Name | Value | How to Get It |
|------------|-------|---------------|
| `DROPLET_IP` | Your droplet's IP address | Check Digital Ocean dashboard |
| `SSH_PRIVATE_KEY` | Your SSH private key | `cat ~/.ssh/github_actions_deploy` |

**Important:** For `SSH_PRIVATE_KEY`, copy the **entire** private key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...entire key content...
-----END OPENSSH PRIVATE KEY-----
```

### Step 3: Initial Deployment

Run the script once to set up the droplet:

```bash
export DROPLET_IP=YOUR_DROPLET_IP
./deploy-existing.sh
```

### Step 4: Enable Auto-Deployment

Now every time you push to GitHub:

```bash
git add .
git commit -m "Update application"
git push
```

GitHub Actions will automatically:
1. ✅ Build your application
2. ✅ Deploy to your droplet
3. ✅ Restart Nginx

### Manual Trigger

You can also manually trigger deployment:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy to Digital Ocean**
4. Click **Run workflow** → **Run workflow**

---

## 🔧 What Changed from Auto-Deploy

If you were using `auto-deploy.sh` (which creates a new droplet), here's what's different:

| Feature | auto-deploy.sh | deploy-existing.sh |
|---------|---------------|-------------------|
| Creates new droplet | ✅ Yes | ❌ No |
| Needs DO API token | ✅ Yes | ❌ No |
| Needs droplet IP | ❌ No | ✅ Yes |
| Needs SSH access | ❌ No | ✅ Yes |
| Deployment time | 3-4 min | 2-3 min |

**Use `deploy-existing.sh` when:**
- ✅ You already have a droplet
- ✅ You want to use an existing server
- ✅ You have SSH access to the droplet

**Use `auto-deploy.sh` when:**
- ✅ You want to create a new droplet
- ✅ You want fully automated setup
- ✅ You have a Digital Ocean API token

---

## 📝 Common Tasks

### Redeploy After Making Changes

```bash
# 1. Push changes to GitHub
git add .
git commit -m "Your changes"
git push

# 2. Deploy to droplet
export DROPLET_IP=YOUR_DROPLET_IP
./deploy-existing.sh
```

Or if using GitHub Actions, just push and it auto-deploys!

### Check Deployment Status

```bash
ssh root@YOUR_DROPLET_IP

# Check if Nginx is running
systemctl status nginx

# View application files
ls -la /var/www/yourmark-ai/dist/

# Check Nginx logs
tail -f /var/log/nginx/access.log
```

### Manual Deployment (SSH Method)

If you prefer to deploy manually:

```bash
ssh root@YOUR_DROPLET_IP

# Update code
cd /var/www/yourmark-ai
git pull origin main

# Rebuild
npm install
npm run build

# Restart Nginx
systemctl restart nginx
```

### Update Node.js Version

If you need a newer Node.js version:

```bash
ssh root@YOUR_DROPLET_IP

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify version
node -v
npm -v
```

---

## 🆘 Troubleshooting

### "Cannot connect to droplet via SSH"

**Check SSH connection:**
```bash
ssh -v root@YOUR_DROPLET_IP
```

**Common fixes:**
1. Verify the IP address is correct
2. Check if the droplet is running in Digital Ocean console
3. Ensure your SSH key is added to the droplet
4. Check firewall settings (port 22 should be open)

**Add your SSH key to droplet:**
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@YOUR_DROPLET_IP
```

### "Permission denied (publickey)"

Your SSH key is not authorized on the droplet.

**Fix via Digital Ocean Console:**
1. Go to https://cloud.digitalocean.com/droplets
2. Click on your droplet
3. Click **Access** → **Launch Droplet Console**
4. Run:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   nano ~/.ssh/authorized_keys
   # Paste your public key (from cat ~/.ssh/id_rsa.pub)
   chmod 600 ~/.ssh/authorized_keys
   ```

### "npm install fails"

**Not enough memory:**
```bash
ssh root@YOUR_DROPLET_IP

# Create swap file (if droplet has < 2GB RAM)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Try deployment again
```

### "Nginx fails to start"

**Check configuration:**
```bash
ssh root@YOUR_DROPLET_IP
nginx -t
systemctl status nginx
tail -f /var/log/nginx/error.log
```

**Common fix:**
```bash
# Remove conflicting configs
rm -f /etc/nginx/sites-enabled/default

# Restart
systemctl restart nginx
```

### GitHub Actions Deployment Fails

**Check secrets are set correctly:**
1. Go to Settings → Secrets and variables → Actions
2. Verify `DROPLET_IP` and `SSH_PRIVATE_KEY` exist
3. Make sure `SSH_PRIVATE_KEY` includes the full key with headers

**Test SSH connection manually:**
```bash
# Save your private key to a file
nano test_key
# Paste the private key
chmod 600 test_key

# Test connection
ssh -i test_key root@YOUR_DROPLET_IP
```

### Application Shows Old Version

**Clear cache and rebuild:**
```bash
ssh root@YOUR_DROPLET_IP
cd /var/www/yourmark-ai
rm -rf node_modules dist
npm install
npm run build
systemctl restart nginx
```

**Hard refresh browser:**
- Chrome/Firefox: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Or open in incognito/private mode

---

## 🔐 Security Checklist

- [ ] SSH key authentication enabled (no password login)
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed (HTTPS)
- [ ] System packages updated regularly
- [ ] Nginx security headers configured

### Set Up Firewall

```bash
ssh root@YOUR_DROPLET_IP

# Configure UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

### Enable Automatic Security Updates

```bash
ssh root@YOUR_DROPLET_IP

apt-get install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### Disable Password Authentication

```bash
ssh root@YOUR_DROPLET_IP

# Edit SSH config
nano /etc/ssh/sshd_config

# Set these values:
# PasswordAuthentication no
# PubkeyAuthentication yes

# Restart SSH
systemctl restart sshd
```

---

## 📊 Monitoring

### Check Application Health

```bash
# From your local machine
curl -I http://YOUR_DROPLET_IP

# Should return: HTTP/1.1 200 OK
```

### Monitor Logs in Real-Time

```bash
ssh root@YOUR_DROPLET_IP

# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Check Resource Usage

```bash
ssh root@YOUR_DROPLET_IP

# CPU and memory
htop

# Disk space
df -h

# Network connections
netstat -tulpn | grep nginx
```

---

## 💡 Quick Reference

### Deploy to existing droplet:
```bash
export DROPLET_IP=123.45.67.89
./deploy-existing.sh
```

### Deploy with custom domain:
```bash
export DROPLET_IP=123.45.67.89
export DOMAIN=yourdomain.com
./deploy-existing.sh
```

### Use different SSH key:
```bash
export DROPLET_IP=123.45.67.89
export SSH_KEY=/path/to/key
./deploy-existing.sh
```

### Manual update on droplet:
```bash
ssh root@YOUR_DROPLET_IP
cd /var/www/yourmark-ai
git pull && npm install && npm run build && systemctl restart nginx
```

### View deployment:
```bash
curl http://YOUR_DROPLET_IP
```

---

## 🔄 Migration from Auto-Deploy

If you previously used `auto-deploy.sh` and want to switch to using your existing droplet:

1. **Get your droplet IP** from Digital Ocean dashboard
2. **Ensure SSH access** works: `ssh root@DROPLET_IP`
3. **Use the new script**:
   ```bash
   export DROPLET_IP=YOUR_DROPLET_IP
   ./deploy-existing.sh
   ```

That's it! The script will update your existing droplet with the latest code.

---

**Need help?** Check the other deployment guides:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Manual deployment guide
- [AUTOMATED_DEPLOYMENT.md](./AUTOMATED_DEPLOYMENT.md) - Auto-create new droplet guide
