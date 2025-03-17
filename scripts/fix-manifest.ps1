# Fix manifest issue diagnostic script

Write-Host "Testing TypeScript manifest endpoint..." -ForegroundColor Green

# Create directories if needed for service worker files
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path ".next/static" -Force -ErrorAction SilentlyContinue

# Verify app/manifest.ts file exists
if (Test-Path "app/manifest.ts") {
    Write-Host "✅ TypeScript manifest file exists: app/manifest.ts" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: TypeScript manifest file not found at app/manifest.ts" -ForegroundColor Red
    exit 1
}

Write-Host "Testing manifest endpoint accessibility..." -ForegroundColor Yellow
# Use Invoke-WebRequest to test if the manifest is accessible
try {
    $result = Invoke-WebRequest -Uri "http://localhost:3000/manifest" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($result.StatusCode -eq 200) {
        Write-Host "✅ Success! Manifest is accessible at /manifest" -ForegroundColor Green
        
        # Check if response is a valid JSON
        try {
            $jsonContent = $result.Content | ConvertFrom-Json
            Write-Host "✅ Manifest contains valid JSON data" -ForegroundColor Green
            
            # Check for important manifest properties
            if ($jsonContent.name -and $jsonContent.icons) {
                Write-Host "✅ Manifest has required properties (name and icons)" -ForegroundColor Green
            } else {
                Write-Host "⚠️ WARNING: Manifest is missing some required properties" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "❌ ERROR: Manifest response is not valid JSON" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ ERROR: Manifest returned status code $($result.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ ERROR: Could not access manifest at /manifest" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Note: This is expected if the server is not running." -ForegroundColor Yellow
}

Write-Host "Done. The manifest endpoint should be automatically served by Next.js." -ForegroundColor Green
