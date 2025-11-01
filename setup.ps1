# Qurbani Management System - Quick Setup Script
# Run this in PowerShell

Write-Host "🐄 Qurbani Management System - Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found! Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if .env exists
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "! .env file not found" -ForegroundColor Yellow
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✓ .env file created" -ForegroundColor Green
        Write-Host "⚠ Please edit .env and add your DATABASE_URL" -ForegroundColor Yellow
    } else {
        Write-Host "Creating default .env file..." -ForegroundColor Yellow
        $envContent = 'DATABASE_URL="postgresql://user:password@localhost:5432/qurbani_db?schema=public"'
        $envContent | Out-File -FilePath .env -Encoding utf8
        Write-Host "✓ .env file created" -ForegroundColor Green
        Write-Host "⚠ Please edit .env and update your DATABASE_URL" -ForegroundColor Yellow
    }
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host ""
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Ask user if they want to push database schema
Write-Host ""
Write-Host "Do you want to push the database schema now? (y/n)" -ForegroundColor Yellow
Write-Host "⚠ Make sure your DATABASE_URL is correct first!" -ForegroundColor Yellow
$pushDb = Read-Host "Push schema"

if ($pushDb -eq "y" -or $pushDb -eq "Y") {
    Write-Host "Pushing database schema..." -ForegroundColor Yellow
    npx prisma db push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database schema pushed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to push database schema" -ForegroundColor Red
        Write-Host "You can run 'npx prisma db push' manually later" -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping database push" -ForegroundColor Yellow
    Write-Host "Run 'npx prisma db push' when ready" -ForegroundColor Yellow
}

# Success message
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database URL" -ForegroundColor White
Write-Host "2. Run: npx prisma db push (if you haven't)" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Happy Qurbani Distribution! 🐄" -ForegroundColor Green
