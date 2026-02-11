#!/bin/bash

set -e

echo "🔒 SSL Certificate Setup for YourMark.ai"
echo ""

DOMAIN="${DOMAIN:-yourmark.ai}"
WWW_DOMAIN="www.$DOMAIN"
DROPLET_IP="${DROPLET_IP:-204.48.31.51}"
EMAIL="${EMAIL:-}"

echo "📋 Configuration:"
echo "  Domain: $DOMAIN"
echo "  WWW Domain: $WWW_DOMAIN"
echo "  Droplet IP: $DROPLET_IP"
echo ""

# Check if DNS is propagated
echo "🔍 Checking DNS propagation..."
RESOLVED_IP=$(dig +short $DOMAIN | tail -n1)

if [ -z "$RESOLVED_IP" ]; then
    echo "❌ DNS not propagated yet for $DOMAIN"
    echo ""
    echo "Please wait for DNS to propagate. This can take:"
    echo "  - 15 minutes to 2 hours (typical)"
    echo "  - Up to 48 hours (maximum)"
    echo ""
    echo "Check DNS status at: https://dnschecker.org/#A/$DOMAIN"
    echo ""
    echo "Once DNS is ready, run this script again:"
    echo "  ./setup-ssl.sh"
    exit 1
fi

if [ "$RESOLVED_IP" != "$DROPLET_IP" ]; then
    echo "⚠️  DNS is propagated but points to wrong IP"
    echo "  Expected: $DROPLET_IP"
    echo "  Got: $RESOLVED_IP"
    echo ""
    echo "Please update your DNS A record to point to: $DROPLET_IP"
    exit 1
fi

echo "✅ DNS is properly configured!"
echo "  $DOMAIN → $RESOLVED_IP"
echo ""

# Check if we need email
if [ -z "$EMAIL" ]; then
    echo "📧 Email address required for Let's Encrypt notifications"
    echo ""
    read -p "Enter your email address: " EMAIL
    
    if [ -z "$EMAIL" ]; then
        echo "❌ Email is required"
        exit 1
    fi
fi

echo "📧 Using email: $EMAIL"
echo ""

# SSH into droplet and set up SSL
echo "🚀 Setting up SSL certificate on droplet..."
echo ""

ssh -o StrictHostKeyChecking=no root@$DROPLET_IP << ENDSSH
set -e

echo "📦 Installing Certbot..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y certbot python3-certbot-nginx

echo ""
echo "⚙️  Updating Nginx configuration..."

# Backup current config
cp /etc/nginx/sites-available/yourmark-ai /etc/nginx/sites-available/yourmark-ai.backup

# Update server_name
sed -i 's/server_name _;/server_name $DOMAIN $WWW_DOMAIN;/' /etc/nginx/sites-available/yourmark-ai

echo ""
echo "✅ Testing Nginx configuration..."
nginx -t

echo ""
echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo ""
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
echo ""

# Run certbot
certbot --nginx \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect

echo ""
echo "✅ SSL certificate installed successfully!"
echo ""
echo "🔄 Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "✅ Auto-renewal configured!"
echo "  Certificates will auto-renew every 90 days"
echo ""

# Test the renewal process
echo "🧪 Testing certificate renewal..."
certbot renew --dry-run

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🎉 SSL Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your site is now secure and accessible at:"
echo "  ✅ https://$DOMAIN"
echo "  ✅ https://$WWW_DOMAIN"
echo ""
echo "HTTP traffic will automatically redirect to HTTPS"
echo ""
ENDSSH

echo ""
echo "🎉 SSL Setup Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Your secure site is now live at:"
echo "  https://$DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Certificate Details:"
echo "  - Issuer: Let's Encrypt"
echo "  - Valid for: 90 days"
echo "  - Auto-renewal: Enabled"
echo "  - Renewal check: Every 12 hours"
echo ""
echo "💡 Useful Commands:"
echo "  - Check certificate: curl -vI https://$DOMAIN 2>&1 | grep 'SSL certificate'"
echo "  - View certificate details: ssh root@$DROPLET_IP 'certbot certificates'"
echo "  - Force renewal: ssh root@$DROPLET_IP 'certbot renew --force-renewal'"
echo ""
