# PowerShell script to build and run the PWA in production mode

Write-Host "Building Math Tutor PWA in production mode..." -ForegroundColor Green

# Set environment to production
$env:NODE_ENV = "production"

# Clean previous build if needed
if (Test-Path ".next") {
    Write-Host "Cleaning previous build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
}

# Remove previous service worker files
if (Test-Path "public/sw.js") {
    Write-Host "Removing previous service worker files..." -ForegroundColor Yellow
    Remove-Item -Force "public/sw.js"
    Remove-Item -Force "public/workbox-*.js" -ErrorAction SilentlyContinue
    Remove-Item -Force "public/fallback-*.js" -ErrorAction SilentlyContinue
}

# Ensure TypeScript manifest and icon files are present
Write-Host "Checking manifest and icons..." -ForegroundColor Yellow
if (Test-Path "app/manifest.ts") {
    Write-Host "TypeScript manifest file exists" -ForegroundColor Green
} else {
    Write-Host "ERROR: app/manifest.ts not found!" -ForegroundColor Red
    exit 1
}

if (Test-Path "public/images/math_tutor_ico.png") {
    Write-Host "PWA icon exists" -ForegroundColor Green
} else {
    Write-Host "ERROR: PWA icon not found at public/images/math_tutor_ico.png!" -ForegroundColor Red
    exit 1
}

# Run database migration
Write-Host "Running database migration..." -ForegroundColor Yellow
pnpm db:migrate

# Build the application
Write-Host "Building Next.js application..." -ForegroundColor Yellow
pnpm run build

# Run our manifest fix script
Write-Host "Running manifest fix script..." -ForegroundColor Yellow
powershell -File scripts/fix-manifest.ps1

# Make sure the build directory exists before running fix script
if (-Not (Test-Path ".next")) {
    Write-Host "ERROR: Build directory .next not found. Build may have failed." -ForegroundColor Red
    exit 1
}

# Ensure the manifest file is accessible in the build output
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path ".next/static" -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path ".next/server/pages" -Force -ErrorAction SilentlyContinue

# No need to copy manifest files as Next.js handles the TypeScript manifest automatically
Write-Host "Next.js will handle the manifest route automatically from app/manifest.ts" -ForegroundColor Green

# Start the server
Write-Host "Starting server in production mode..." -ForegroundColor Green
Write-Host "Open http://localhost:3000 in your browser to test PWA" -ForegroundColor Cyan
Write-Host "For PWA diagnostic page, visit http://localhost:3000/pwa-test.html" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
pnpm start
