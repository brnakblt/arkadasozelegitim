#########################################################
# Arkadaş Özel Eğitim ERP - Windows PowerShell Setup Script
# Run with: .\setup_windows.ps1
# May need: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#########################################################

$ErrorActionPreference = "Stop"

# Colors
function Write-Step { param($Message) Write-Host "==> " -NoNewline -ForegroundColor Blue; Write-Host $Message -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Arkadaş Özel Eğitim ERP - Windows Setup               ║" -ForegroundColor Cyan
Write-Host "║     Setting up development environment                     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

#########################################################
# 1. Check Prerequisites
#########################################################
Write-Step "Checking prerequisites..."

# Check if running as Administrator for optional features
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Check for winget
$hasWinget = Get-Command winget -ErrorAction SilentlyContinue

#########################################################
# 2. Install Node.js via NVM-Windows (if needed)
#########################################################
Write-Step "Checking Node.js installation..."

$nvmPath = "$env:APPDATA\nvm"
$hasNvm = Test-Path $nvmPath

if (-not $hasNvm) {
    Write-Warning "NVM for Windows not found."
    Write-Host "Please install NVM for Windows from: https://github.com/coreybutler/nvm-windows/releases"
    Write-Host "After installation, run this script again."
    Write-Host ""
    
    if ($hasWinget) {
        $install = Read-Host "Would you like to install NVM via winget? (y/n)"
        if ($install -eq 'y') {
            winget install CoreyButler.NVMforWindows
            Write-Success "NVM installed. Please restart PowerShell and run this script again."
            exit 0
        }
    }
}
else {
    Write-Success "NVM for Windows found"
}

# Check for Node.js
$hasNode = Get-Command node -ErrorAction SilentlyContinue
if ($hasNode) {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion installed"
}
else {
    Write-Warning "Node.js not found. Install with: nvm install 22 && nvm use 22"
}

#########################################################
# 3. Check Python Installation
#########################################################
Write-Step "Checking Python installation..."

$hasPython311 = $false
try {
    $py311 = py -3.11 --version 2>&1
    if ($py311 -match "Python 3.11") {
        $hasPython311 = $true
        Write-Success "Python 3.11 found"
    }
}
catch {
    # Python 3.11 not found
}

if (-not $hasPython311) {
    $hasPython = Get-Command python -ErrorAction SilentlyContinue
    if ($hasPython) {
        $pyVersion = python --version
        Write-Warning "Python found ($pyVersion) but Python 3.11 is recommended for AI service"
        Write-Host "Install from: https://www.python.org/downloads/release/python-3119/"
    }
    else {
        Write-Warning "Python not found. Install Python 3.11 for AI service."
    }
}

#########################################################
# 4. Install NPM Dependencies
#########################################################
Write-Step "Installing NPM dependencies..."

# Root dependencies
if (Test-Path "package.json") {
    Write-Host "Installing root dependencies..."
    npm install
    Write-Success "Root dependencies installed"
}

# Strapi
if (Test-Path "strapi") {
    Write-Host "Installing Strapi dependencies..."
    Push-Location strapi
    npm install
    Pop-Location
    Write-Success "Strapi dependencies installed"
}

# Web (Next.js)
if (Test-Path "web") {
    Write-Host "Installing Web dependencies..."
    Push-Location web
    npm install
    Pop-Location
    Write-Success "Web dependencies installed"
}

# Mobile (React Native/Expo)
if (Test-Path "mobile") {
    Write-Host "Installing Mobile dependencies..."
    Push-Location mobile
    npm install
    Pop-Location
    Write-Success "Mobile dependencies installed"
}

# MEBBIS Service (Arkadaş MEBBIS Automation)
if (Test-Path "mebbis-service") {
    Write-Host "Installing MEBBIS Service dependencies..."
    Push-Location mebbis-service
    npm install
    
    # Install Playwright browsers for automation
    Write-Host "Installing Playwright browsers..."
    npx playwright install chromium
    Pop-Location
    Write-Success "MEBBIS Service dependencies installed"
}

#########################################################
# 5. Python AI Service Setup
#########################################################
Write-Step "Setting up Python AI service..."

if (Test-Path "ai-service") {
    Push-Location ai-service
    
    # Create virtual environment
    if (-not (Test-Path "venv")) {
        Write-Host "Creating Python virtual environment..."
        if ($hasPython311) {
            py -3.11 -m venv venv
        }
        else {
            python -m venv venv
        }
        Write-Success "Virtual environment created"
    }
    
    # Activate and install dependencies
    Write-Host "Installing Python dependencies..."
    & .\venv\Scripts\Activate.ps1
    
    pip install --upgrade pip
    
    # Check if dlib wheel exists on desktop
    $dlibWheel = "$env:USERPROFILE\Desktop\dlib-19.24.1-cp311-cp311-win_amd64.whl"
    if (Test-Path $dlibWheel) {
        Write-Host "Installing dlib from local wheel..."
        pip install $dlibWheel
    }
    
    # Install other requirements
    pip install -r requirements.txt 2>$null
    
    deactivate
    Pop-Location
    Write-Success "Python AI service environment ready"
}
else {
    Write-Warning "ai-service directory not found"
}

#########################################################
# 6. Environment Files
#########################################################
Write-Step "Setting up environment files..."

# Strapi
if ((Test-Path "strapi\.env.example") -and -not (Test-Path "strapi\.env")) {
    Copy-Item "strapi\.env.example" "strapi\.env"
    Write-Success "Created strapi\.env from template"
}

# Web
if ((Test-Path "web\.env.example") -and -not (Test-Path "web\.env.local")) {
    Copy-Item "web\.env.example" "web\.env.local"
    Write-Success "Created web\.env.local from template"
}

# AI Service
if ((Test-Path "ai-service\.env.example") -and -not (Test-Path "ai-service\.env")) {
    Copy-Item "ai-service\.env.example" "ai-service\.env"
    Write-Success "Created ai-service\.env from template"
}

# MEBBIS Service
if ((Test-Path "mebbis-service\.env.example") -and -not (Test-Path "mebbis-service\.env")) {
    Copy-Item "mebbis-service\.env.example" "mebbis-service\.env"
    Write-Success "Created mebbis-service\.env from template"
}

#########################################################
# 7. Docker Desktop Check
#########################################################
Write-Step "Checking Docker Desktop..."

$hasDocker = Get-Command docker -ErrorAction SilentlyContinue
if ($hasDocker) {
    try {
        docker info 2>$null | Out-Null
        Write-Success "Docker Desktop is running"
    }
    catch {
        Write-Warning "Docker Desktop is installed but not running. Start it for infrastructure services."
    }
}
else {
    Write-Warning "Docker Desktop not found. Install from: https://www.docker.com/products/docker-desktop/"
}

#########################################################
# Summary
#########################################################
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    Setup Complete! 🎉                      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Start the development servers:" -ForegroundColor White
Write-Host ""
Write-Host "   # Option A - All at once:" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "   # Option B - Individually:" -ForegroundColor Gray
Write-Host "   npm run dev:strapi   # Backend      → localhost:1337" -ForegroundColor Yellow
Write-Host "   npm run dev:web      # Frontend     → localhost:3000" -ForegroundColor Yellow
Write-Host "   npm run dev:ai       # AI Service   → localhost:8000" -ForegroundColor Yellow
Write-Host "   npm run dev:mebbis   # MEBBIS       → localhost:4000" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Access the applications:" -ForegroundColor White
Write-Host "   - Frontend:       http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Strapi Admin:   http://localhost:1337/admin" -ForegroundColor Cyan
Write-Host "   - AI API:         http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   - MEBBIS API:     http://localhost:4000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Configure environment variables:" -ForegroundColor White
Write-Host "   - strapi\.env (Nextcloud, database)" -ForegroundColor Gray
Write-Host "   - web\.env.local (Google Maps API key)" -ForegroundColor Gray
Write-Host "   - mebbis-service\.env (MEBBIS credentials)" -ForegroundColor Gray
Write-Host ""

# Create helper batch files
Write-Step "Creating helper scripts..."

# start-dev.ps1
$startDevScript = @'
# Start all development servers
Write-Host "Starting development servers..." -ForegroundColor Green

# Start Strapi in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd strapi; npm run develop"

# Wait a bit for Strapi to initialize
Start-Sleep -Seconds 3

# Start Web in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

# Start AI Service in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

# Start MEBBIS Service in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mebbis-service; npm run dev"

Write-Host ""
Write-Host "All servers starting in separate windows!" -ForegroundColor Green
Write-Host "- Strapi:      http://localhost:1337/admin" -ForegroundColor Cyan
Write-Host "- Web:         http://localhost:3000" -ForegroundColor Cyan
Write-Host "- AI API:      http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "- MEBBIS API:  http://localhost:4000/api" -ForegroundColor Cyan
'@

Set-Content -Path "start-dev.ps1" -Value $startDevScript
Write-Success "Created start-dev.ps1 helper script"

Write-Success "Happy coding! 🚀"
