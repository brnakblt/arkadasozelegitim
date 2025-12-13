#!/bin/bash
#########################################################
# Arkadaş Özel Eğitim ERP - Arch Linux Setup Script
# Run with: sudo ./setup_arch.sh
#########################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} ${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if running as root for system packages
if [ "$EUID" -eq 0 ]; then
    ACTUAL_USER="${SUDO_USER:-$USER}"
    ACTUAL_HOME=$(getent passwd "$ACTUAL_USER" | cut -d: -f6)
else
    ACTUAL_USER="$USER"
    ACTUAL_HOME="$HOME"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Arkadaş Özel Eğitim ERP - Arch Linux Setup            ║"
echo "║     Setting up development environment                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

#########################################################
# 1. System Update
#########################################################
print_step "Updating system packages..."
if [ "$EUID" -eq 0 ]; then
    pacman -Syu --noconfirm
else
    print_warning "Run with sudo to update system packages"
fi

#########################################################
# 2. Install System Dependencies
#########################################################
print_step "Installing system dependencies..."

PACKAGES=(
    # Docker
    docker
    docker-compose
    # Database
    mariadb
    postgresql
    # Development tools
    git
    base-devel
    cmake
    # Python (for AI service)
    python
    python-pip
    python-virtualenv
    # Node.js (via nvm is preferred, but system fallback)
    nodejs
    npm
)

if [ "$EUID" -eq 0 ]; then
    pacman -S --needed --noconfirm "${PACKAGES[@]}"
else
    print_warning "Install packages manually: sudo pacman -S ${PACKAGES[*]}"
fi

#########################################################
# 3. Docker Setup
#########################################################
print_step "Configuring Docker..."
if [ "$EUID" -eq 0 ]; then
    systemctl start docker 2>/dev/null || true
    systemctl enable docker 2>/dev/null || true
    usermod -aG docker "$ACTUAL_USER" 2>/dev/null || true
    print_success "Docker configured. Log out/in to use without sudo."
else
    print_warning "Run with sudo to configure Docker service"
fi

#########################################################
# 4. NVM (Node Version Manager)
#########################################################
print_step "Setting up NVM (Node Version Manager)..."

NVM_DIR="$ACTUAL_HOME/.nvm"
if [ ! -d "$NVM_DIR" ]; then
    # Install nvm
    if [ "$EUID" -eq 0 ]; then
        sudo -u "$ACTUAL_USER" bash -c 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash'
    else
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi
    print_success "NVM installed"
else
    print_success "NVM already installed"
fi

# Load NVM
export NVM_DIR="$ACTUAL_HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

#########################################################
# 5. Node.js Setup
#########################################################
print_step "Installing Node.js 22 via NVM..."

if command -v nvm &> /dev/null; then
    nvm install 22
    nvm use 22
    nvm alias default 22
    print_success "Node.js $(node -v) installed"
else
    print_warning "NVM not loaded. Open a new terminal and run: nvm install 22"
fi

#########################################################
# 6. Python Setup (for AI Service)
#########################################################
print_step "Setting up Python environment for AI service..."

if [ -d "ai-service" ]; then
    cd ai-service
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python -m venv venv
        print_success "Python virtual environment created"
    fi
    
    # Activate and install dependencies
    source venv/bin/activate
    pip install --upgrade pip
    
    # Install dlib dependencies (Arch-specific)
    if [ "$EUID" -eq 0 ]; then
        pacman -S --needed --noconfirm openblas lapack
    fi
    
    pip install -r requirements.txt 2>/dev/null || print_warning "Some Python packages may need manual installation"
    
    deactivate
    cd ..
    print_success "Python AI service environment ready"
else
    print_warning "ai-service directory not found"
fi

#########################################################
# 7. NPM Dependencies
#########################################################
print_step "Installing NPM dependencies..."

# Root dependencies
if [ -f "package.json" ]; then
    npm install
    print_success "Root dependencies installed"
fi

# Strapi
if [ -d "strapi" ]; then
    cd strapi
    npm install
    cd ..
    print_success "Strapi dependencies installed"
fi

# Web (Next.js)
if [ -d "web" ]; then
    cd web
    npm install
    cd ..
    print_success "Web dependencies installed"
fi

# Mobile (React Native/Expo)
if [ -d "mobile" ]; then
    cd mobile
    npm install
    cd ..
    print_success "Mobile dependencies installed"
fi

# MEBBIS Service (Arkadaş MEBBIS Automation)
if [ -d "mebbis-service" ]; then
    cd mebbis-service
    npm install
    
    # Install Playwright browsers for automation
    npx playwright install chromium
    cd ..
    print_success "MEBBIS Service dependencies installed"
fi

#########################################################
# 8. Environment Files
#########################################################
print_step "Setting up environment files..."

# Strapi
if [ -f "strapi/.env.example" ] && [ ! -f "strapi/.env" ]; then
    cp strapi/.env.example strapi/.env
    print_success "Created strapi/.env from template"
fi

# Web
if [ -f "web/.env.example" ] && [ ! -f "web/.env.local" ]; then
    cp web/.env.example web/.env.local
    print_success "Created web/.env.local from template"
fi

# AI Service
if [ -f "ai-service/.env.example" ] && [ ! -f "ai-service/.env" ]; then
    cp ai-service/.env.example ai-service/.env
    print_success "Created ai-service/.env from template"
fi

# MEBBIS Service
if [ -f "mebbis-service/.env.example" ] && [ ! -f "mebbis-service/.env" ]; then
    cp mebbis-service/.env.example mebbis-service/.env
    print_success "Created mebbis-service/.env from template"
fi

#########################################################
# 9. Docker Infrastructure (Optional)
#########################################################
print_step "Docker infrastructure..."

if [ -d "infrastructure" ] && [ -f "infrastructure/docker-compose.yml" ]; then
    print_warning "To start infrastructure services (Nextcloud, etc.), run:"
    echo "    cd infrastructure && docker-compose up -d"
fi

#########################################################
# Summary
#########################################################
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! 🎉                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Open a new terminal (to load NVM)"
echo ""
echo "2. Start the development servers:"
echo "   # Option A - All at once:"
echo "   npm run dev"
echo ""
echo "   # Option B - Individually:"
echo "   npm run dev:strapi   # Backend      → localhost:1337"
echo "   npm run dev:web      # Frontend     → localhost:3000"
echo "   npm run dev:ai       # AI Service   → localhost:8000"
echo "   npm run dev:mebbis   # MEBBIS       → localhost:4000"
echo ""
echo "3. Access the applications:"
echo "   - Frontend:       http://localhost:3000"
echo "   - Strapi Admin:   http://localhost:1337/admin"
echo "   - AI API:         http://localhost:8000/docs"
echo "   - MEBBIS API:     http://localhost:4000/api"
echo ""
echo "4. Configure environment variables:"
echo "   - strapi/.env (Nextcloud, database)"
echo "   - web/.env.local (Google Maps API key)"
echo "   - mebbis-service/.env (MEBBIS credentials)"
echo ""
print_success "Happy coding! 🚀"

