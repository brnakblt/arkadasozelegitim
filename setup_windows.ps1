#########################################################
# Arkadaş Özel Eğitim ERP - Windows PowerShell Setup Script
# Updated: 2025-12-13
# Run with: .\setup_windows.ps1
# May need: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#########################################################

$ErrorActionPreference = "Stop"

# Colors
function Write-Step { param($Message) Write-Host "==> " -NoNewline -ForegroundColor Blue; Write-Host $Message -ForegroundColor Green }
function Write-Warn { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Err { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Arkadaş Özel Eğitim ERP - Windows Setup  v2.0          ║" -ForegroundColor Cyan
Write-Host "║     Setting up development environment                     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

#########################################################
# 1. Check Prerequisites
#########################################################
Write-Step "Checking prerequisites..."

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$hasWinget = Get-Command winget -ErrorAction SilentlyContinue

#########################################################
# 2. Install Node.js via NVM-Windows (if needed)
#########################################################
Write-Step "Checking Node.js installation..."

$nvmPath = "$env:APPDATA\nvm"
$hasNvm = Test-Path $nvmPath

if (-not $hasNvm) {
    Write-Warn "NVM for Windows not found."
    Write-Host "Please install NVM for Windows from: https://github.com/coreybutler/nvm-windows/releases"
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

# Check for Node.js v22
$hasNode = Get-Command node -ErrorAction SilentlyContinue
if ($hasNode) {
    $nodeVersion = node --version
    if ($nodeVersion -match "v22") {
        Write-Success "Node.js $nodeVersion installed"
    }
    else {
        Write-Warn "Node.js $nodeVersion found, but v22 is recommended"
        Write-Host "Install with: nvm install 22 && nvm use 22"
    }
}
else {
    Write-Warn "Node.js not found. Install with: nvm install 22 && nvm use 22"
}

#########################################################
# 3. Check Python 3.11 Installation
#########################################################
Write-Step "Checking Python 3.11 installation..."

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
        Write-Warn "Python found ($pyVersion) but Python 3.11 is recommended for AI service"
        Write-Host "Install from: https://www.python.org/downloads/release/python-3119/"
    }
    else {
        Write-Warn "Python not found. Install Python 3.11 for AI service."
    }
}

#########################################################
# 4. Check Visual Studio Build Tools (for dlib)
#########################################################
Write-Step "Checking Visual Studio Build Tools..."

$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
$hasBuildTools = $false

if (Test-Path $vswhere) {
    $vsInstalls = & $vswhere -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64
    if ($vsInstalls) {
        $hasBuildTools = $true
        Write-Success "Visual Studio Build Tools found"
    }
}

if (-not $hasBuildTools) {
    Write-Warn "Visual Studio Build Tools not found (required for dlib/face-recognition)"
    Write-Host "Download: https://aka.ms/vs/17/release/vs_BuildTools.exe"
    Write-Host "Select: 'Desktop development with C++'"
}

#########################################################
# 5. Install NPM Dependencies
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

# MEBBIS Service
if (Test-Path "mebbis-service") {
    Write-Host "Installing MEBBIS Service dependencies..."
    Push-Location mebbis-service
    npm install
    
    Write-Host "Installing Playwright browsers..."
    npx playwright install chromium
    Pop-Location
    Write-Success "MEBBIS Service dependencies installed"
}

#########################################################
# 6. Python AI Service Setup
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
    
    # Install requirements
    Write-Host "Installing AI service dependencies..."
    pip install -r requirements.txt
    
    # Check if dlib is installed
    $dlibInstalled = pip list 2>$null | Select-String "dlib"
    if (-not $dlibInstalled) {
        Write-Warn "dlib not installed - face recognition features will not work"
        Write-Host "To install dlib, you need Visual Studio Build Tools"
        Write-Host "See: docs/face-recognition-setup.md"
    }
    else {
        Write-Success "dlib is installed - face recognition ready!"
    }
    
    deactivate
    Pop-Location
    Write-Success "Python AI service environment ready"
}
else {
    Write-Warn "ai-service directory not found"
}

#########################################################
# 7. Environment Files
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
# 8. Docker Desktop Check
#########################################################
Write-Step "Checking Docker Desktop..."

$hasDocker = Get-Command docker -ErrorAction SilentlyContinue
if ($hasDocker) {
    try {
        docker info 2>$null | Out-Null
        Write-Success "Docker Desktop is running"
    }
    catch {
        Write-Warn "Docker Desktop is installed but not running. Start it for Redis/infrastructure."
    }
}
else {
    Write-Warn "Docker Desktop not found (required for Redis/MEBBIS service)"
    Write-Host "Install from: https://www.docker.com/products/docker-desktop/"
}

#########################################################
# 9. Install Context7 MCP (optional)
#########################################################
Write-Step "Checking Context7 MCP..."

$hasContext7 = npm list -g @upstash/context7-mcp 2>$null
if ($hasContext7 -match "context7-mcp") {
    Write-Success "Context7 MCP installed"
}
else {
    Write-Warn "Context7 MCP not installed (optional AI coding assistant)"
    $installContext7 = Read-Host "Would you like to install Context7 MCP? (y/n)"
    if ($installContext7 -eq 'y') {
        npm install -g @upstash/context7-mcp
        Write-Success "Context7 MCP installed. Configure in your IDE's MCP settings."
    }
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
Write-Host "1. Configure environment variables:" -ForegroundColor White
Write-Host "   - strapi\.env (Database: SQLite or PostgreSQL)" -ForegroundColor Gray
Write-Host "   - web\.env.local (Google Maps API key)" -ForegroundColor Gray
Write-Host "   - mebbis-service\.env (Redis URL, MEBBIS credentials)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Docker Desktop (for Redis):" -ForegroundColor White
Write-Host "   docker compose -f infrastructure/docker-compose.yml up -d" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Start the development servers:" -ForegroundColor White
Write-Host ""
Write-Host "   # Option A - All at once:" -ForegroundColor Gray
Write-Host "   npm run dev:all" -ForegroundColor Yellow
Write-Host ""
Write-Host "   # Option B - Individually:" -ForegroundColor Gray
Write-Host "   npm run dev:strapi   # Backend      → localhost:1337" -ForegroundColor Yellow
Write-Host "   npm run dev:web      # Frontend     → localhost:3000" -ForegroundColor Yellow
Write-Host "   npm run dev:ai       # AI Service   → localhost:8000" -ForegroundColor Yellow
Write-Host "   npm run dev:mebbis   # MEBBIS       → localhost:4000" -ForegroundColor Yellow
Write-Host "   npm run dev:mobile   # Mobile App   → localhost:8082" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Access the applications:" -ForegroundColor White
Write-Host "   - Frontend:       http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - Strapi Admin:   http://localhost:1337/admin" -ForegroundColor Cyan
Write-Host "   - AI API Docs:    http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   - MEBBIS API:     http://localhost:4000/api" -ForegroundColor Cyan
Write-Host "   - Mobile:         Expo Go app" -ForegroundColor Cyan
Write-Host ""

if (-not $hasBuildTools) {
    Write-Host "⚠️  Face Recognition Setup:" -ForegroundColor Yellow
    Write-Host "   To enable face recognition features:" -ForegroundColor White
    Write-Host "   1. Install Visual Studio Build Tools" -ForegroundColor Gray
    Write-Host "   2. cd ai-service" -ForegroundColor Gray
    Write-Host "   3. .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
    Write-Host "   4. pip install dlib face-recognition" -ForegroundColor Gray
    Write-Host ""
}

# Create helper batch file
Write-Step "Creating helper script..."

$startDevScript = @'
# Start all development servers in separate windows
Write-Host "Starting development servers..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "Waiting for Docker to start (15 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
}

# Start infrastructure
Write-Host "Starting infrastructure..." -ForegroundColor Green
docker compose -f infrastructure/docker-compose.yml up -d

# Start all services
Write-Host "Starting all services..." -ForegroundColor Green
npm run dev:all

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host "- Strapi:      http://localhost:1337/admin" -ForegroundColor Cyan
Write-Host "- Web:         http://localhost:3000" -ForegroundColor Cyan
Write-Host "- AI API:      http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "- MEBBIS API:  http://localhost:4000/api" -ForegroundColor Cyan
Write-Host "- Mobile:      http://localhost:8082" -ForegroundColor Cyan
'@

Set-Content -Path "start-dev.ps1" -Value $startDevScript
Write-Success "Created start-dev.ps1 helper script"

Write-Success "Happy coding! 🚀"
