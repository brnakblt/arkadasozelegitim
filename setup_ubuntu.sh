#!/bin/bash
#########################################################
# Arkadaş Özel Eğitim ERP - Ubuntu Server Setup Script
# Production deployment for Ubuntu 20.04 LTS / 22.04 LTS
# Run with: sudo ./setup_ubuntu.sh
#########################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo_step() { echo -e "${BLUE}==>${NC} ${GREEN}$1${NC}"; }
echo_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
echo_error() { echo -e "${RED}❌ $1${NC}"; }
echo_success() { echo -e "${GREEN}✅ $1${NC}"; }

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Arkadaş Özel Eğitim ERP - Ubuntu Production Setup     ║${NC}"
echo -e "${CYAN}║     Setting up for production deployment                  ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo_error "Please run as root (sudo ./setup_ubuntu.sh)"
   exit 1
fi

# Get the actual user (not root)
ACTUAL_USER="${SUDO_USER:-$USER}"
ACTUAL_HOME=$(eval echo ~$ACTUAL_USER)

echo_step "Setting up for user: $ACTUAL_USER"

#########################################################
# 1. System Update
#########################################################
echo_step "Updating system packages..."
apt-get update
apt-get upgrade -y
echo_success "System updated"

#########################################################
# 2. Install Essential Tools
#########################################################
echo_step "Installing essential tools..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    unattended-upgrades
echo_success "Essential tools installed"

#########################################################
# 3. Install Node.js (v22 LTS)
#########################################################
echo_step "Installing Node.js v22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node --version
npm --version
echo_success "Node.js installed"

#########################################################
# 4. Install Python 3.11
#########################################################
echo_step "Installing Python 3.11..."
add-apt-repository -y ppa:deadsnakes/ppa
apt-get update
apt-get install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    python-is-python3
echo_success "Python 3.11 installed"

#########################################################
# 5. Install PostgreSQL
#########################################################
echo_step "Installing PostgreSQL..."
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Create database and user
echo_step "Creating database and user..."
sudo -u postgres psql <<EOF
CREATE DATABASE arkadas_erp;
CREATE USER strapi WITH ENCRYPTED PASSWORD 'strapi_production_password_change_me';
GRANT ALL PRIVILEGES ON DATABASE arkadas_erp TO strapi;
ALTER DATABASE arkadas_erp OWNER TO strapi;
\q
EOF
echo_success "PostgreSQL configured"

#########################################################
# 6. Install Redis
#########################################################
echo_step "Installing Redis..."
apt-get install -y redis-server
systemctl start redis-server
systemctl enable redis-server

# Configure Redis for production
sed -i 's/supervised no/supervised systemd/g' /etc/redis/redis.conf
systemctl restart redis-server
echo_success "Redis configured"

#########################################################
# 7. Install NGINX
#########################################################
echo_step "Installing NGINX..."
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
echo_success "NGINX installed"

#########################################################
# 8. Install Docker (for Nextcloud)
#########################################################
echo_step "Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl start docker
systemctl enable docker

# Add user to docker group
usermod -aG docker $ACTUAL_USER
echo_success "Docker installed"

#########################################################
# 9. Install PM2 (Process Manager)
#########################################################
echo_step "Installing PM2..."
npm install -g pm2
pm2 startup systemd -u $ACTUAL_USER --hp $ACTUAL_HOME
echo_success "PM2 installed"

#########################################################
# 10. Setup Application Directory
#########################################################
echo_step "Setting up application directory..."
APP_DIR="/var/www/arkadas-erp"
if [ ! -d "$APP_DIR" ]; then
    mkdir -p $APP_DIR
    chown -R $ACTUAL_USER:$ACTUAL_USER $APP_DIR
    echo_success "Application directory created: $APP_DIR"
else
    echo_warn "Application directory already exists: $APP_DIR"
fi

#########################################################
# 11. Clone or Copy Application
#########################################################
echo_step "Preparing application files..."
echo_warn "Please copy your application files to: $APP_DIR"
echo_warn "Or clone from git: cd $APP_DIR && git clone <your-repo-url> ."

#########################################################
# 12. Install Application Dependencies
#########################################################
if [ -f "$APP_DIR/package.json" ]; then
    echo_step "Installing application dependencies..."
    cd $APP_DIR
    
    # Install root dependencies
    sudo -u $ACTUAL_USER npm install
    
    # Install service dependencies
    for dir in web strapi mobile mebbis-service; do
        if [ -d "$APP_DIR/$dir" ]; then
            echo_step "Installing $dir dependencies..."
            cd "$APP_DIR/$dir"
            sudo -u $ACTUAL_USER npm install
        fi
    done
    
    # Install Playwright for MEBBIS
    if [ -d "$APP_DIR/mebbis-service" ]; then
        cd "$APP_DIR/mebbis-service"
        sudo -u $ACTUAL_USER npx playwright install chromium
        sudo -u $ACTUAL_USER npx playwright install-deps
    fi
    
    echo_success "Application dependencies installed"
else
    echo_warn "package.json not found in $APP_DIR - skipping npm install"
fi

#########################################################
# 13. Setup Python AI Service
#########################################################
if [ -d "$APP_DIR/ai-service" ]; then
    echo_step "Setting up Python AI service..."
    cd "$APP_DIR/ai-service"
    
    # Create virtual environment
    sudo -u $ACTUAL_USER python3.11 -m venv venv
    
    # Install dependencies
    sudo -u $ACTUAL_USER bash <<'END_BASH'
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install core dependencies
pip install fastapi uvicorn[standard] python-multipart

# Install ML dependencies (requires build tools)
pip install numpy opencv-python Pillow pydantic pydantic-settings httpx sqlalchemy python-dotenv

# Try to install dlib and face-recognition
echo "Installing dlib (this may take 5-10 minutes)..."
pip install dlib || echo "Warning: dlib installation failed. Face recognition will not work."
pip install face-recognition || echo "Warning: face-recognition installation failed."

deactivate
END_BASH
    
    echo_success "Python AI service configured"
else
    echo_warn "ai-service directory not found - skipping Python setup"
fi

#########################################################
# 14. Build Production Assets
#########################################################
if [ -d "$APP_DIR/web" ]; then
    echo_step "Building web production bundle..."
    cd "$APP_DIR/web"
    sudo -u $ACTUAL_USER npm run build
    echo_success "Web bundle built"
fi

if [ -d "$APP_DIR/strapi" ]; then
    echo_step "Building Strapi admin..."
    cd "$APP_DIR/strapi"
    sudo -u $ACTUAL_USER npm run build
    echo_success "Strapi admin built"
fi

#########################################################
# 15. Setup Environment Files
#########################################################
echo_step "Setting up environment files..."
cd $APP_DIR

# Create .env files from examples if they don't exist
for envfile in strapi/.env web/.env.local ai-service/.env mebbis-service/.env; do
    if [ -f "${envfile}.example" ] && [ ! -f "$envfile" ]; then
        cp "${envfile}.example" "$envfile"
        chown $ACTUAL_USER:$ACTUAL_USER "$envfile"
        echo_success "Created $envfile from template"
    fi
done

echo_warn "IMPORTANT: Edit .env files with production credentials"

#########################################################
# 16. Setup PM2 Services
#########################################################
echo_step "Configuring PM2 services..."
cd $APP_DIR

# Create PM2 ecosystem file
cat > ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: './strapi',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      }
    },
    {
      name: 'web',
      cwd: './web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'mebbis-service',
      cwd: './mebbis-service',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'ai-service',
      cwd: './ai-service',
      script: './venv/bin/uvicorn',
      args: 'app.main:app --host 0.0.0.0 --port 8000',
      interpreter: 'none'
    }
  ]
};
EOF

chown $ACTUAL_USER:$ACTUAL_USER ecosystem.config.js
echo_success "PM2 ecosystem configured"

#########################################################
# 17. Setup NGINX Configuration
#########################################################
echo_step "Configuring NGINX..."

cat > /etc/nginx/sites-available/arkadas-erp <<'EOF'
# Arkadaş Özel Eğitim ERP - NGINX Configuration

# Upstream servers
upstream web_backend {
    server 127.0.0.1:3000;
}

upstream strapi_backend {
    server 127.0.0.1:1337;
}

upstream ai_backend {
    server 127.0.0.1:8000;
}

upstream mebbis_backend {
    server 127.0.0.1:4000;
}

# Main web application
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS (uncomment after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req zone=general burst=20 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Next.js web app
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Strapi CMS
    location /strapi/ {
        rewrite ^/strapi/(.*) /$1 break;
        proxy_pass http://strapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase upload size for media
        client_max_body_size 100M;
    }

    # AI Service
    location /ai/ {
        rewrite ^/ai/(.*) /$1 break;
        proxy_pass http://ai_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for AI processing
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # MEBBIS Service
    location /mebbis/ {
        rewrite ^/mebbis/(.*) /$1 break;
        proxy_pass http://mebbis_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for MEBBIS automation
        proxy_read_timeout 600s;
        proxy_connect_timeout 75s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# SSL configuration (uncomment after certbot setup)
# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name your-domain.com www.your-domain.com;
#
#     ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
#     include /etc/letsencrypt/options-ssl-nginx.conf;
#     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
#
#     # ... (copy location blocks from above)
# }
EOF

# Enable site
ln -sf /etc/nginx/sites-available/arkadas-erp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test NGINX configuration
nginx -t
systemctl reload nginx

echo_success "NGINX configured"
echo_warn "Edit /etc/nginx/sites-available/arkadas-erp and replace 'your-domain.com'"

#########################################################
# 18. Setup Firewall (UFW)
#########################################################
echo_step "Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
echo_success "Firewall configured"

#########################################################
# 19. Setup SSL with Let's Encrypt
#########################################################
echo_step "Installing Certbot for SSL..."
apt-get install -y certbot python3-certbot-nginx

echo_warn "To setup SSL, run after configuring your domain:"
echo "    sudo certbot --nginx -d your-domain.com -d www.your-domain.com"

#########################################################
# 20. Setup Automatic Security Updates
#########################################################
echo_step "Configuring automatic security updates..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::InstallOnShutdown "false";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades
echo_success "Automatic security updates enabled"

#########################################################
# Summary
#########################################################
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                  Setup Complete! 🎉                       ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo  -e "${GREEN}📋 Next Steps:${NC}"
echo ""
echo "1. Edit environment files:"
echo "   - $APP_DIR/strapi/.env (database credentials)"
echo "   - $APP_DIR/web/.env.local (API keys)"
echo "   - $APP_DIR/mebbis-service/.env (MEBBIS credentials)"
echo ""
echo "2. Update NGINX configuration:"
echo "   sudo nano /etc/nginx/sites-available/arkadas-erp"
echo "   # Replace 'your-domain.com' with your actual domain"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "3. Setup DNS records pointing to this server's IP"
echo ""
echo "4. Setup SSL certificate:"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "5. Start services with PM2:"
echo "   cd $APP_DIR"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo ""
echo "6. Check service status:"
echo "   pm2 status"
echo "   pm2 logs"
echo ""
echo "7. Setup monitoring (optional):"
echo "   pm2 install pm2-logrotate"
echo "   pm2 set pm2-logrotate:max_size 10M"
echo""
echo -e "${GREEN}🔒 Security Checklist:${NC}"
echo "  ✅ Firewall (UFW) enabled"
echo "  ✅ Fail2Ban installed"
echo "  ✅ Automatic security updates configured"
echo "  ⏳ SSL certificate (run certbot)"
echo "  ⏳ Change default database passwords"
echo "  ⏳ Configure SSH key authentication"
echo "  ⏳ Disable root SSH login"
echo ""
echo -e "${GREEN}📊 Service URLs (after domain setup):${NC}"
echo "  - Frontend:       https://your-domain.com"
echo "  - Strapi Admin:   https://your-domain.com/strapi/admin"
echo "  - AI API:         https://your-domain.com/ai/docs"
echo "  - MEBBIS API:     https://your-domain.com/mebbis/api"
echo ""
echo_success "Happy deploying! 🚀"
