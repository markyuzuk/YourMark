# Digital Ocean Deployment Guide

This guide will help you deploy your YourMark AI application to a Digital Ocean droplet.

## Prerequisites

- A Digital Ocean account
- A droplet running Ubuntu 20.04 or later
- SSH access to your droplet
- Your domain name (optional, but recommended)

## Quick Deployment

### Step 1: Create a Digital Ocean Droplet

1. Log in to your Digital Ocean account
2. Click "Create" → "Droplets"
3. Choose:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month minimum recommended)
   - **CPU**: Regular (1GB RAM minimum)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH key (recommended) or password
4. Click "Create Droplet"
5. Note your droplet's IP address

### Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Run the Deployment Script

```bash
# Download and run the deployment script
curl -o deploy.sh https://raw.githubusercontent.com/markyuzuk/YourMark/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

That's it! Your application will be deployed and accessible at `http://YOUR_DROPLET_IP`

## Custom Domain Setup

If you have a domain name, you can set it up:

### Step 1: Configure DNS

1. Go to your domain registrar
2. Add an A record pointing to your droplet's IP address:
   - **Type**: A
   - **Name**: @ (or www)
   - **Value**: YOUR_DROPLET_IP
   - **TTL**: 3600

### Step 2: Deploy with Domain

```bash
DOMAIN=yourdomain.com ./deploy.sh
```

### Step 3: Set Up SSL (HTTPS)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

## Manual Deployment Steps

If you prefer to deploy manually, here are the detailed steps:

### 1. Install Dependencies

```bash
sudo apt-get update
sudo apt-get install -y nginx nodejs npm git
```

### 2. Clone Repository

```bash
sudo mkdir -p /var/www/yourmark-ai
sudo git clone https://github.com/markyuzuk/YourMark.git /var/www/yourmark-ai
cd /var/www/yourmark-ai
```

### 3. Install and Build

```bash
npm install
npm run build
```

### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/yourmark-ai
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
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
```

### 5. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/yourmark-ai /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Updating Your Application

To update your deployed application with new changes:

```bash
cd /var/www/yourmark-ai
git pull origin main
npm install
npm run build
sudo systemctl restart nginx
```

Or simply re-run the deployment script:

```bash
./deploy.sh
```

## Troubleshooting

### Check Nginx Status
```bash
sudo systemctl status nginx
```

### View Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check if Port 80 is Open
```bash
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Check Application Build
```bash
cd /var/www/yourmark-ai
npm run build
```

## Firewall Configuration

If you're using UFW (Uncomplicated Firewall):

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Performance Optimization

### Enable Nginx Caching

Add to your Nginx configuration:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
```

### PM2 for Process Management (Optional)

If you need a backend API later:

```bash
sudo npm install -g pm2
pm2 startup
```

## Security Best Practices

1. **Keep your system updated**:
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

2. **Set up automatic security updates**:
   ```bash
   sudo apt-get install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

3. **Configure firewall** (see Firewall Configuration above)

4. **Use SSH keys** instead of passwords

5. **Set up SSL/HTTPS** (see Custom Domain Setup above)

## Monitoring

### Check Application Status
```bash
curl -I http://YOUR_DROPLET_IP
```

### Monitor Nginx Access Logs
```bash
sudo tail -f /var/log/nginx/access.log
```

## Support

For issues or questions:
- Check the GitHub repository: https://github.com/markyuzuk/YourMark
- Review Digital Ocean documentation: https://docs.digitalocean.com
- Check Nginx documentation: https://nginx.org/en/docs/

## Cost Estimate

- **Basic Droplet**: $6/month (1GB RAM)
- **Domain Name**: $10-15/year (optional)
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$6/month + domain cost
