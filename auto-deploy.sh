#!/bin/bash

set -e

echo "🚀 Automated Digital Ocean Deployment for YourMark AI"
echo ""

if [ -z "$DO_TOKEN" ]; then
    echo "❌ Error: DO_TOKEN environment variable is not set"
    echo ""
    echo "Please set your Digital Ocean API token:"
    echo "  export DO_TOKEN=your_digital_ocean_api_token"
    echo ""
    echo "Get your token at: https://cloud.digitalocean.com/account/api/tokens"
    exit 1
fi

DROPLET_NAME="${DROPLET_NAME:-yourmark-ai}"
REGION="${REGION:-nyc3}"
SIZE="${SIZE:-s-1vcpu-1gb}"
IMAGE="${IMAGE:-ubuntu-22-04-x64}"
SSH_KEY_NAME="${SSH_KEY_NAME:-default}"

echo "📋 Configuration:"
echo "  Droplet Name: $DROPLET_NAME"
echo "  Region: $REGION"
echo "  Size: $SIZE"
echo "  Image: $IMAGE"
echo ""

check_droplet_exists() {
    curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        "https://api.digitalocean.com/v2/droplets" | \
        grep -q "\"name\":\"$DROPLET_NAME\""
}

get_droplet_ip() {
    curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        "https://api.digitalocean.com/v2/droplets" | \
        jq -r ".droplets[] | select(.name==\"$DROPLET_NAME\") | .networks.v4[] | select(.type==\"public\") | .ip_address" | head -n 1
}

get_droplet_id() {
    curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        "https://api.digitalocean.com/v2/droplets" | \
        jq -r ".droplets[] | select(.name==\"$DROPLET_NAME\") | .id"
}

if check_droplet_exists; then
    echo "✅ Droplet '$DROPLET_NAME' already exists"
    DROPLET_IP=$(get_droplet_ip)
    DROPLET_ID=$(get_droplet_id)
    echo "   IP Address: $DROPLET_IP"
    echo "   Droplet ID: $DROPLET_ID"
else
    echo "📦 Creating new droplet..."
    
    SSH_KEY_ID=$(curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        "https://api.digitalocean.com/v2/account/keys" | \
        jq -r '.ssh_keys[0].id')
    
    if [ "$SSH_KEY_ID" == "null" ] || [ -z "$SSH_KEY_ID" ]; then
        echo "⚠️  No SSH keys found. Creating droplet without SSH key..."
        SSH_KEY_JSON="[]"
    else
        echo "🔑 Using SSH key ID: $SSH_KEY_ID"
        SSH_KEY_JSON="[$SSH_KEY_ID]"
    fi
    
    USER_DATA=$(cat <<'EOF'
#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx nodejs npm git curl jq

mkdir -p /var/www/yourmark-ai
cd /var/www/yourmark-ai

git clone https://github.com/markyuzuk/YourMark.git .
npm install
npm run build

cat > /etc/nginx/sites-available/yourmark-ai <<'NGINX'
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
NGINX

ln -sf /etc/nginx/sites-available/yourmark-ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "Deployment complete" > /var/log/deployment-status.log
EOF
)
    
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        -d "{
            \"name\": \"$DROPLET_NAME\",
            \"region\": \"$REGION\",
            \"size\": \"$SIZE\",
            \"image\": \"$IMAGE\",
            \"ssh_keys\": $SSH_KEY_JSON,
            \"backups\": false,
            \"ipv6\": false,
            \"user_data\": $(echo "$USER_DATA" | jq -Rs .),
            \"monitoring\": true,
            \"tags\": [\"yourmark-ai\", \"production\"]
        }" \
        "https://api.digitalocean.com/v2/droplets")
    
    DROPLET_ID=$(echo $CREATE_RESPONSE | jq -r '.droplet.id')
    
    if [ "$DROPLET_ID" == "null" ] || [ -z "$DROPLET_ID" ]; then
        echo "❌ Failed to create droplet"
        echo "$CREATE_RESPONSE" | jq .
        exit 1
    fi
    
    echo "✅ Droplet created with ID: $DROPLET_ID"
    echo "⏳ Waiting for droplet to be ready..."
    
    for i in {1..60}; do
        STATUS=$(curl -s -X GET \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $DO_TOKEN" \
            "https://api.digitalocean.com/v2/droplets/$DROPLET_ID" | \
            jq -r '.droplet.status')
        
        if [ "$STATUS" == "active" ]; then
            echo "✅ Droplet is active!"
            break
        fi
        
        echo "   Status: $STATUS (attempt $i/60)"
        sleep 5
    done
    
    DROPLET_IP=$(curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_TOKEN" \
        "https://api.digitalocean.com/v2/droplets/$DROPLET_ID" | \
        jq -r '.droplet.networks.v4[] | select(.type=="public") | .ip_address')
    
    echo "🌐 Droplet IP Address: $DROPLET_IP"
    echo ""
    echo "⏳ Waiting for deployment to complete (this may take 2-3 minutes)..."
    sleep 120
fi

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
echo "     - SSH into droplet and run: sudo certbot --nginx -d yourdomain.com"
echo ""
echo "💡 Useful Commands:"
echo "  - View droplet info: curl -X GET -H \"Authorization: Bearer \$DO_TOKEN\" https://api.digitalocean.com/v2/droplets/$DROPLET_ID | jq"
echo "  - Delete droplet: curl -X DELETE -H \"Authorization: Bearer \$DO_TOKEN\" https://api.digitalocean.com/v2/droplets/$DROPLET_ID"
echo "  - SSH to droplet: ssh root@$DROPLET_IP"
echo ""
