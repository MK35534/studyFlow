# Installation automatique - Pronote Python Service
# PowerShell script pour Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StudyFlow - Pronote Python Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "[1/4] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Python 3.8+ from:" -ForegroundColor Yellow
    Write-Host "  - Microsoft Store: https://www.microsoft.com/store/productId/9NCVDN91XZQP" -ForegroundColor Yellow
    Write-Host "  - Official website: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check pip
Write-Host "[2/4] Checking pip..." -ForegroundColor Yellow
try {
    $pipVersion = python -m pip --version 2>&1
    Write-Host "  ✓ pip found: $pipVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ pip not found!" -ForegroundColor Red
    Write-Host "  Installing pip..." -ForegroundColor Yellow
    python -m ensurepip --upgrade
}

# Install dependencies
Write-Host "[3/4] Installing Python dependencies..." -ForegroundColor Yellow
$requirementsPath = "server\python\requirements.txt"

if (Test-Path $requirementsPath) {
    Write-Host "  Installing from $requirementsPath..." -ForegroundColor Gray
    python -m pip install -r $requirementsPath --quiet --disable-pip-version-check
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ✗ requirements.txt not found!" -ForegroundColor Red
    Write-Host "  Make sure you're in the studyFlow root directory" -ForegroundColor Yellow
    exit 1
}

# Run test
Write-Host "[4/4] Running setup test..." -ForegroundColor Yellow
$testScriptPath = "server\python\test_setup.py"

if (Test-Path $testScriptPath) {
    Write-Host ""
    python $testScriptPath
    Write-Host ""
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ Setup completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Start the dev server: npm run dev" -ForegroundColor White
        Write-Host "  2. Open http://localhost:3000" -ForegroundColor White
        Write-Host "  3. Go to Profile > Synchronisation Pronote" -ForegroundColor White
        Write-Host "  4. Enter your Pronote credentials" -ForegroundColor White
        Write-Host "  5. Click 'Synchroniser'" -ForegroundColor White
        Write-Host ""
        Write-Host "For troubleshooting, see: server\python\INSTALL.md" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ✗ Setup test failed" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please check the error messages above." -ForegroundColor Yellow
        Write-Host "For help, see: server\python\INSTALL.md" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
} else {
    Write-Host "  ✗ test_setup.py not found!" -ForegroundColor Red
    exit 1
}
