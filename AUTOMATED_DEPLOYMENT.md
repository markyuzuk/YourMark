# Automated Deployment Guide

This guide shows you how to deploy your YourMark AI application to Digital Ocean **without manual SSH access**. Everything is automated!

## 🎯 Two Automated Deployment Options

### Option 1: One-Command Deployment (Recommended)
Creates and deploys to a new droplet automatically using the Digital Ocean API.

### Option 2: GitHub Actions CI/CD
Automatically deploys every time you push to GitHub.

---

## 🚀 Option 1: One-Command Deployment

### Prerequisites

1. **Digital Ocean Account** - Sign up at https://digitalocean.com
2. **API Token** - Get it from https://cloud.digitalocean.com/account/api/tokens
   - Click "Generate New Token"
   - Name it "YourMark Deployment"
   - Check both "Read" and "Write" scopes
   - Copy the token (you'll only see it once!)

### Step 1: Set Your API Token

```bash
export DO_TOKEN=your_digital_ocean_api_token_here
```

### Step 2: Run the Automated Deployment

```bash
./auto-deploy.sh
```

That's it! The script will:
- ✅ Create a new Digital Ocean droplet
- ✅ Install all dependencies (Nginx, Node.js, Git)
- ✅ Clone your repository
- ✅ Build your application
- ✅ Configure Nginx
- ✅ Start the web server
- ✅ Give you the live URL

**Total time: ~3-4 minutes**

### Customization Options

You can customize the droplet configuration:

```bash
# Custom droplet name
export DROPLET_NAME=my-custom-name

# Different region (default: nyc3)
# Options: nyc1, nyc3, sfo3, ams3, sgp1, lon1, fra1, tor1, blr1
export REGION=sfo3

# Different size (default: s-1vcpu-1gb = $6/month)
# Options: s-1vcpu-1gb, s-1vcpu-2gb, s-2vcpu-2gb, s-2vcpu-4gb
export SIZE=s-1vcpu-2gb

# Run deployment
./auto-deploy.sh
```

### What You'll See

```
🚀 Automated Digital Ocean Deployment for YourMark AI

📋 Configuration:
  Droplet Name: yourmark-ai
  Region: nyc3
  Size: s-1vcpu-1gb
  Image: ubuntu-22-04-x64

📦 Creating new droplet...
✅ Droplet created with ID: 123456789
⏳ Waiting for droplet to be ready...
✅ Droplet is active!
🌐 Droplet IP Address: 123.45.67.89
⏳ Waiting for deployment to complete (this may take 2-3 minutes)...

🎉 Deployment Complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Your application is now live at:
  http://123.45.67.89
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 Option 2: GitHub Actions CI/CD

Automatically deploy every time you push code to GitHub.

### Step 1: Get Your Digital Ocean Credentials

1. **API Token** - From https://cloud.digitalocean.com/account/api/tokens
2. **SSH Key** - Generate if you don't have one:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/do_deploy
   ```
3. **Add SSH Key to Digital Ocean**:
   - Go to https://cloud.digitalocean.com/account/security
   - Click "Add SSH Key"
   - Paste the contents of `~/.ssh/do_deploy.pub`
   - Name it "GitHub Actions Deploy"

### Step 2: Create Your Droplet (One Time)

You can use the automated script or create manually:

```bash
export DO_TOKEN=your_token
./auto-deploy.sh
```

Note the IP address that's displayed.

### Step 3: Add GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add these three secrets:

| Secret Name | Value |
|------------|-------|
| `DO_TOKEN` | Your Digital Ocean API token |
| `DROPLET_IP` | Your droplet's IP address (e.g., 123.45.67.89) |
| `SSH_PRIVATE_KEY` | Contents of `~/.ssh/do_deploy` (the private key) |

To get your private key contents:
```bash
cat ~/.ssh/do_deploy
```

### Step 4: Enable GitHub Actions

The workflow file is already in your repository at `.github/workflows/deploy.yml`.

### Step 5: Deploy!

Now every time you push to the `main` branch:

```bash
git add .
git commit -m "Update application"
git push
```

GitHub Actions will automatically:
1. ✅ Build your application
2. ✅ Deploy to your Digital Ocean droplet
3. ✅ Restart Nginx
4. ✅ Notify you of success/failure

### Manual Trigger

You can also trigger deployment manually:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy to Digital Ocean** workflow
4. Click **Run workflow**

---

## 🔧 Managing Your Deployment

### View Droplet Information

```bash
curl -X GET \
  -H "Authorization: Bearer $DO_TOKEN" \
  https://api.digitalocean.com/v2/droplets | jq
```

### Delete Droplet

```bash
# Get droplet ID first
DROPLET_ID=$(curl -s -X GET \
  -H "Authorization: Bearer $DO_TOKEN" \
  https://api.digitalocean.com/v2/droplets | \
  jq -r '.droplets[] | select(.name=="yourmark-ai") | .id')

# Delete it
curl -X DELETE \
  -H "Authorization: Bearer $DO_TOKEN" \
  https://api.digitalocean.com/v2/droplets/$DROPLET_ID
```

### SSH into Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Update Deployment

If you used Option 1 (auto-deploy.sh), just run it again:
```bash
./auto-deploy.sh
```

It will detect the existing droplet and update it.

If you're using GitHub Actions, just push your changes:
```bash
git push
```

---

## 🌐 Custom Domain Setup

### Step 1: Point Your Domain

Add an A record in your domain's DNS settings:
- **Type**: A
- **Name**: @ (or www)
- **Value**: YOUR_DROPLET_IP
- **TTL**: 3600

### Step 2: Update Nginx Configuration

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Edit the Nginx config:
```bash
nano /etc/nginx/sites-available/yourmark-ai
```

Change `server_name _;` to `server_name yourdomain.com www.yourdomain.com;`

Restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

### Step 3: Add SSL Certificate

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Your site will now be available at `https://yourdomain.com`!

---

## 📊 Monitoring & Logs

### View Deployment Logs (GitHub Actions)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the latest workflow run
4. View the logs for each step

### View Application Logs (On Droplet)

```bash
ssh root@YOUR_DROPLET_IP

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Check deployment status
cat /var/log/deployment-status.log
```

### Check Application Status

```bash
# Check if Nginx is running
systemctl status nginx

# Test the application
curl -I http://YOUR_DROPLET_IP
```

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| Basic Droplet (1GB RAM) | $6/month |
| Domain Name (optional) | $10-15/year |
| SSL Certificate | Free (Let's Encrypt) |
| **Total** | **~$6/month** |

---

## 🆘 Troubleshooting

### "Failed to create droplet"

**Check your API token:**
```bash
curl -X GET \
  -H "Authorization: Bearer $DO_TOKEN" \
  https://api.digitalocean.com/v2/account | jq
```

If you get an error, your token is invalid. Generate a new one.

### "No SSH keys found"

The script will create the droplet without SSH keys. You can still access it via the Digital Ocean console:
1. Go to https://cloud.digitalocean.com/droplets
2. Click on your droplet
3. Click "Access" → "Launch Droplet Console"

### GitHub Actions Deployment Fails

**Check your secrets:**
1. Go to Settings → Secrets and variables → Actions
2. Verify all three secrets are set correctly:
   - `DO_TOKEN`
   - `DROPLET_IP`
   - `SSH_PRIVATE_KEY`

**Test SSH connection:**
```bash
ssh -i ~/.ssh/do_deploy root@YOUR_DROPLET_IP
```

### Application Not Loading

**Check Nginx status:**
```bash
ssh root@YOUR_DROPLET_IP
systemctl status nginx
nginx -t
```

**Check if files were deployed:**
```bash
ls -la /var/www/yourmark-ai/dist/
```

**Rebuild manually:**
```bash
cd /var/www/yourmark-ai
git pull
npm install
npm run build
systemctl restart nginx
```

---

## 🔐 Security Best Practices

1. **Firewall**: The droplet is created with monitoring enabled
2. **SSH Keys**: Always use SSH keys instead of passwords
3. **SSL**: Set up HTTPS with Let's Encrypt (free)
4. **Updates**: Keep your droplet updated:
   ```bash
   apt-get update && apt-get upgrade -y
   ```
5. **Secrets**: Never commit API tokens or private keys to Git

---

## 📚 Additional Resources

- [Digital Ocean API Documentation](https://docs.digitalocean.com/reference/api/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## 🎉 Quick Reference

### Deploy from scratch (no SSH needed):
```bash
export DO_TOKEN=your_token
./auto-deploy.sh
```

### Deploy via GitHub Actions:
```bash
git push
```

### Update existing deployment:
```bash
./auto-deploy.sh  # or just git push if using GitHub Actions
```

### Delete deployment:
```bash
curl -X DELETE -H "Authorization: Bearer $DO_TOKEN" \
  https://api.digitalocean.com/v2/droplets/DROPLET_ID
```

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for manual deployment options.
