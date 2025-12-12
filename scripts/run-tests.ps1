# =============================================================================
# Arkadaş ERP - Automated Test Runner (Windows)
# Runs all tests: Web (Unit + E2E), Mobile, PWA, Desktop, Docs
# =============================================================================

param(
    [switch]$Unit,
    [switch]$E2E,
    [switch]$Mobile,
    [switch]$Lint,
    [switch]$All
)

# If no specific flag, run all
if (-not ($Unit -or $E2E -or $Mobile -or $Lint)) {
    $All = $true
}

$ErrorCount = 0
$PassedTests = @()
$FailedTests = @()

function Write-Header($text) {
    Write-Host "`n========================================" -ForegroundColor Blue
    Write-Host "  $text" -ForegroundColor Blue
    Write-Host "========================================`n" -ForegroundColor Blue
}

function Run-Test($name, $command, $dir) {
    Write-Host "▶ Running: $name" -ForegroundColor Yellow
    
    $currentDir = Get-Location
    if ($dir) {
        Set-Location $dir
    }
    
    try {
        Invoke-Expression $command
        if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
            Write-Host "✓ $name passed" -ForegroundColor Green
            $script:PassedTests += $name
        } else {
            throw "Test failed with exit code $LASTEXITCODE"
        }
    }
    catch {
        Write-Host "✗ $name failed: $_" -ForegroundColor Red
        $script:FailedTests += $name
        $script:ErrorCount++
    }
    finally {
        Set-Location $currentDir
    }
    
    Write-Host ""
}

Write-Header "Arkadaş ERP Test Suite"

# =============================================================================
# WEB TESTS
# =============================================================================
if ($All -or $Unit) {
    Write-Host "📦 Web Unit Tests" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    Run-Test "Web Unit Tests (Vitest)" "npm run test:unit" "web"
}

if ($All -or $E2E) {
    Write-Host "🌐 Web E2E Tests" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    if (Test-Path "web\playwright.config.ts") {
        Run-Test "Web E2E Tests (Playwright)" "npm run test:e2e" "web"
    } else {
        Write-Host "Playwright config not found, skipping E2E" -ForegroundColor Yellow
    }
}

# =============================================================================
# MOBILE TESTS
# =============================================================================
if ($All -or $Mobile) {
    Write-Host "📱 Mobile Tests" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    if (Test-Path "mobile\jest.config.js") {
        Run-Test "Mobile Unit Tests (Jest)" "npm test" "mobile"
    } else {
        Write-Host "Jest config not found, skipping mobile tests" -ForegroundColor Yellow
    }
}

# =============================================================================
# LINT & TYPE CHECKS
# =============================================================================
if ($All -or $Lint) {
    Write-Host "🔍 Lint & Type Checks" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    Run-Test "Web ESLint" "npm run lint" "web"
    Run-Test "Web TypeScript" "npx tsc --noEmit" "web"
}

# =============================================================================
# DOCS BUILD
# =============================================================================
if ($All) {
    Write-Host "📚 Documentation Build" -ForegroundColor Cyan
    Write-Host "----------------------------------------"
    if (Test-Path "docs\mkdocs.yml") {
        Run-Test "MkDocs Build" "mkdocs build --strict" "docs"
    }
}

# =============================================================================
# RESULTS
# =============================================================================
Write-Header "Test Results Summary"

if ($PassedTests.Count -gt 0) {
    Write-Host "Passed:" -ForegroundColor Green
    foreach ($test in $PassedTests) {
        Write-Host "  ✓ $test" -ForegroundColor Green
    }
}

if ($FailedTests.Count -gt 0) {
    Write-Host "`nFailed:" -ForegroundColor Red
    foreach ($test in $FailedTests) {
        Write-Host "  ✗ $test" -ForegroundColor Red
    }
    Write-Host ""
    exit 1
} else {
    Write-Host "`nAll tests passed! 🎉" -ForegroundColor Green
    exit 0
}
