#!/bin/bash

set -e

echo "🚀 Deploying YourMark AI to Existing Digital Ocean Droplet"
echo ""

if [ -z "$DROPLET_IP" ]; then
    echo "❌ Error: DROPLET_IP environment variable is not set"
    echo ""
    echo "Please set your droplet's IP address:"
    echo "  export DROPLET_IP=your_droplet_ip_address"
    echo ""
    echo "Example:"
    echo "  export DROPLET_IP=123.45.67.89"
    echo "  ./deploy-existing.sh"
    exit 1
fi

SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"
APP_DIR="/var/www/yourmark-ai"
REPO_URL="https://github.com/markyuzuk/YourMark.git"
DOMAIN="${DOMAIN:-_}"

echo "📋 Configuration:"
echo "  Droplet IP: $DROPLET_IP"
echo "  SSH Key: $SSH_KEY"
echo "  App Directory: $APP_DIR"
echo ""

echo "🔍 Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$DROPLET_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo "❌ Cannot connect to droplet via SSH"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if the IP address is correct: $DROPLET_IP"
    echo "  2. Ensure your SSH key is correct: $SSH_KEY"
    echo "  3. Verify the droplet is running in Digital Ocean console"
    echo "  4. Check if you can manually SSH: ssh root@$DROPLET_IP"
    echo ""
    echo "If using a different SSH key, set it:"
    echo "  export SSH_KEY=/path/to/your/key"
    exit 1
fi

echo "✅ SSH connection successful!"
echo ""

echo "📦 Installing system dependencies on droplet..."
ssh -i "$SSH_KEY" root@$DROPLET_IP << 'ENDSSH'
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx nodejs npm git curl

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"
ENDSSH

echo ""
echo "📥 Deploying application code..."

ssh -i "$SSH_KEY" root@$DROPLET_IP << ENDSSH
set -e

# Create app directory if it doesn't exist
mkdir -p $APP_DIR

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
    git pull origin main
else
    echo "Cloning repository..."
    rm -rf $APP_DIR/*
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo ""
echo "📦 Installing Node.js dependencies..."
npm install

echo ""
echo "🏗️  Building application..."
npm run build

echo ""
echo "⚙️  Configuring Nginx..."
cat > /etc/nginx/sites-available/yourmark-ai <<'NGINX'
server {
    listen 80;
    server_name $DOMAIN;
    root $APP_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
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
NGINX

# Enable site
ln -sf /etc/nginx/sites-available/yourmark-ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

echo ""
echo "✅ Testing Nginx configuration..."
nginx -t

echo ""
echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

echo ""
echo "✅ Deployment complete on droplet!"
ENDSSH

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Your application is now live at:"
echo "  http://$DROPLET_IP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo "  1. Visit http://$DROPLET_IP to see your app"
echo "  2. Set up a custom domain (optional):"
echo "     - Point your domain's A record to: $DROPLET_IP"
echo "     - Run: DOMAIN=yourdomain.com ./deploy-existing.sh"
echo "     - Then SSH and run: sudo certbot --nginx -d yourdomain.com"
echo ""
echo "💡 To redeploy after making changes:"
echo "  git push  # Push to GitHub first"
echo "  ./deploy-existing.sh  # Then deploy to droplet"
echo ""
