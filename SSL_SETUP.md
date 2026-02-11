# SSL/HTTPS Setup Guide for YourMark.ai

This guide explains how to set up HTTPS with a free SSL certificate from Let's Encrypt for your yourmark.ai domain.

## Current Status

- ✅ Domain: yourmark.ai (configured with Digital Ocean DNS)
- ✅ Droplet IP: 204.48.31.51
- ⏳ DNS Propagation: In progress
- ❌ SSL Certificate: Not yet installed

## Prerequisites

- ✅ Domain name: yourmark.ai (from GoDaddy)
- ✅ Nameservers changed to Digital Ocean
- ✅ A record pointing to 204.48.31.51
- ⏳ DNS propagation (wait 15 min - 48 hours)

---

## Automated SSL Setup (Recommended)

### Step 1: Wait for DNS Propagation

Check if DNS has propagated:

```bash
nslookup yourmark.ai
```

You should see `204.48.31.51` in the response.

Or check online: https://dnschecker.org/#A/yourmark.ai

### Step 2: Run the SSL Setup Script

Once DNS is propagated:

```bash
# Set your email for Let's Encrypt notifications
export EMAIL=your@email.com

# Run the automated setup
./setup-ssl.sh
```

The script will:
- ✅ Verify DNS is properly configured
- ✅ Install Certbot on your droplet
- ✅ Update Nginx configuration with your domain
- ✅ Obtain SSL certificate from Let's Encrypt
- ✅ Configure HTTPS with auto-redirect
- ✅ Set up automatic certificate renewal

**Total time: ~2-3 minutes**

### Step 3: Verify HTTPS

Visit your site:
- https://yourmark.ai
- https://www.yourmark.ai

Both should work with a valid SSL certificate!

---

## Manual SSL Setup

If you prefer to set up SSL manually:

### Step 1: SSH into Droplet

```bash
ssh root@204.48.31.51
```

### Step 2: Install Certbot

```bash
apt-get update
apt-get install -y certbot python3-certbot-nginx
```

### Step 3: Update Nginx Configuration

```bash
nano /etc/nginx/sites-available/yourmark-ai
```

Change:
```nginx
server_name _;
```

To:
```nginx
server_name yourmark.ai www.yourmark.ai;
```

Save and exit (Ctrl+X, Y, Enter)

### Step 4: Test and Reload Nginx

```bash
nginx -t
systemctl reload nginx
```

### Step 5: Get SSL Certificate

```bash
certbot --nginx -d yourmark.ai -d www.yourmark.ai
```

Follow the prompts:
1. Enter your email address
2. Agree to terms of service (Y)
3. Choose to redirect HTTP to HTTPS (option 2)

### Step 6: Verify Auto-Renewal

```bash
# Enable auto-renewal timer
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run
```

---

## DNS Configuration Details

### Required DNS Records

In your Digital Ocean DNS settings for yourmark.ai:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 204.48.31.51 | 3600 |
| A | www | 204.48.31.51 | 3600 |

### Verify DNS

```bash
# Check main domain
dig +short yourmark.ai

# Check www subdomain
dig +short www.yourmark.ai

# Both should return: 204.48.31.51
```

---

## Certificate Details

### Let's Encrypt Certificate Info

- **Issuer**: Let's Encrypt
- **Validity**: 90 days
- **Auto-renewal**: Every 60 days (automatic)
- **Cost**: Free
- **Encryption**: TLS 1.2/1.3

### Certificate Locations

```
Certificate: /etc/letsencrypt/live/yourmark.ai/fullchain.pem
Private Key: /etc/letsencrypt/live/yourmark.ai/privkey.pem
```

---

## Troubleshooting

### DNS Not Propagating

**Check propagation status:**
```bash
nslookup yourmark.ai
```

**If it doesn't resolve:**
- Wait longer (can take up to 48 hours)
- Verify A records in Digital Ocean DNS
- Check nameservers are set to Digital Ocean in GoDaddy

### Certbot Fails with "DNS Problem"

**Error**: "DNS problem: NXDOMAIN looking up A for yourmark.ai"

**Solution**: DNS hasn't propagated yet. Wait and try again.

### Certbot Fails with "Connection Refused"

**Error**: "Failed authorization procedure"

**Solution**: 
```bash
# Make sure Nginx is running
systemctl status nginx

# Check if port 80 is accessible
curl -I http://yourmark.ai

# Check firewall
ufw status
ufw allow 'Nginx Full'
```

### Certificate Not Renewing

**Check renewal timer:**
```bash
systemctl status certbot.timer
```

**Manually renew:**
```bash
certbot renew
```

**Force renewal:**
```bash
certbot renew --force-renewal
```

---

## Verification Commands

### Check SSL Certificate

```bash
# From local machine
curl -vI https://yourmark.ai 2>&1 | grep -A 10 'SSL certificate'

# From droplet
ssh root@204.48.31.51 'certbot certificates'
```

### Test HTTPS

```bash
# Should return 200 OK
curl -I https://yourmark.ai

# Should redirect to HTTPS
curl -I http://yourmark.ai
```

### Check Certificate Expiry

```bash
ssh root@204.48.31.51 'certbot certificates'
```

---

## Nginx HTTPS Configuration

After SSL setup, your Nginx config will look like this:

```nginx
server {
    listen 80;
    server_name yourmark.ai www.yourmark.ai;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourmark.ai www.yourmark.ai;
    
    ssl_certificate /etc/letsencrypt/live/yourmark.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourmark.ai/privkey.pem;
    
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

---

## Security Best Practices

### SSL Labs Test

Test your SSL configuration:
https://www.ssllabs.com/ssltest/analyze.html?d=yourmark.ai

Target grade: A or A+

### Security Headers

Add these to your Nginx config for better security:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Firewall Configuration

```bash
# Allow HTTPS
ufw allow 443/tcp

# Check status
ufw status
```

---

## Maintenance

### Certificate Renewal

Certificates auto-renew, but you can manually renew:

```bash
ssh root@204.48.31.51
certbot renew
systemctl reload nginx
```

### Check Renewal Status

```bash
ssh root@204.48.31.51
certbot certificates
```

### Update Certificate (Add/Remove Domains)

```bash
ssh root@204.48.31.51
certbot --nginx -d yourmark.ai -d www.yourmark.ai
```

---

## Quick Reference

### Setup SSL (automated):
```bash
export EMAIL=your@email.com
./setup-ssl.sh
```

### Check DNS:
```bash
nslookup yourmark.ai
```

### Manual SSL setup:
```bash
ssh root@204.48.31.51
certbot --nginx -d yourmark.ai -d www.yourmark.ai
```

### Verify HTTPS:
```bash
curl -I https://yourmark.ai
```

### Check certificate:
```bash
ssh root@204.48.31.51 'certbot certificates'
```

---

## Timeline

1. **Now**: DNS propagation in progress
2. **15 min - 2 hours**: DNS should be ready (typical)
3. **After DNS ready**: Run `./setup-ssl.sh`
4. **2-3 minutes**: SSL certificate installed
5. **Done**: Site accessible via HTTPS

---

## Support Resources

- Let's Encrypt: https://letsencrypt.org/docs/
- Certbot: https://certbot.eff.org/
- DNS Checker: https://dnschecker.org/
- SSL Labs: https://www.ssllabs.com/ssltest/
