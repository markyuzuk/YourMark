#!/bin/bash

set -e

echo "🚀 Starting deployment for YourMark AI..."

APP_NAME="yourmark-ai"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/markyuzuk/YourMark.git"
DOMAIN="${DOMAIN:-_}"

echo "📦 Installing system dependencies..."
sudo apt-get update
sudo apt-get install -y nginx nodejs npm git

echo "📥 Cloning/Updating repository..."
if [ -d "$APP_DIR" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo "Cloning repository..."
    sudo mkdir -p $APP_DIR
    sudo git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

echo "📦 Installing Node.js dependencies..."
npm install

echo "🏗️  Building application..."
npm run build

echo "⚙️  Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
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
EOF

echo "🔗 Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo "✅ Testing Nginx configuration..."
sudo nginx -t

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "🎉 Deployment complete!"
echo "Your application is now running at http://$(curl -s ifconfig.me)"
echo ""
echo "📝 Next steps:"
echo "  - To set up a custom domain, run: DOMAIN=yourdomain.com ./deploy.sh"
echo "  - To set up SSL with Let's Encrypt, run: sudo certbot --nginx -d yourdomain.com"
