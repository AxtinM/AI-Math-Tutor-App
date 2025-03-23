# PWA Reset Script
# This script helps reset the PWA state for debugging purposes
# It clears cached files, unregisters service workers, and removes localStorage data

Write-Host "🧹 PWA Reset Tool" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Check if running in administrator mode
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️ Note: Some operations may require administrator privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Function to pause execution
function Pause {
    Write-Host "Press any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Function to reset browser data
function Reset-BrowserCache {
    param (
        [string]$BrowserName,
        [string]$Instructions
    )

    Write-Host "🌐 $BrowserName Cache Clearing" -ForegroundColor Blue
    Write-Host $Instructions -ForegroundColor White
    Write-Host ""
    Pause
}

# Main menu
function Show-Menu {
    Clear-Host
    Write-Host "🧹 PWA Reset Tool" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Select an option:" -ForegroundColor White
    Write-Host "1: Clear Browser Caches (Chrome, Edge, Firefox)" -ForegroundColor Green
    Write-Host "2: Rebuild and Restart PWA" -ForegroundColor Green
    Write-Host "3: Reset All PWA Data" -ForegroundColor Green
    Write-Host "Q: Quit" -ForegroundColor Red
    Write-Host ""
}

# Option 1: Clear browser caches
function Clear-BrowserCaches {
    Write-Host "🌐 Browser Cache Clearing" -ForegroundColor Blue
    Write-Host "=======================" -ForegroundColor Blue
    Write-Host ""

    Reset-BrowserCache -BrowserName "Chrome" -Instructions @"
To clear Chrome cache for PWA:
1. Open Chrome
2. Navigate to chrome://serviceworker-internals
3. Find any entries related to your site and click 'Unregister'
4. Navigate to chrome://settings/cookies
5. Click on 'See all cookies and site data'
6. Search for your site domain and remove entries
"@

    Reset-BrowserCache -BrowserName "Edge" -Instructions @"
To clear Edge cache for PWA:
1. Open Edge
2. Navigate to edge://settings/content/all
3. Find any entries related to your site and remove them
4. Navigate to edge://serviceworker-internals
5. Find any entries related to your site and click 'Unregister'
"@

    Reset-BrowserCache -BrowserName "Firefox" -Instructions @"
To clear Firefox cache for PWA:
1. Open Firefox
2. Navigate to about:serviceworkers
3. Find any entries related to your site and click 'Unregister'
4. Navigate to about:preferences#privacy
5. Click on 'Clear Data' under Cookies and Site Data
6. Select your site and clear data
"@

    Write-Host "Browser cache clearing instructions completed." -ForegroundColor Green
    Write-Host ""
    Pause
}

# Option 2: Rebuild and restart PWA
function Rebuild-PWA {
    Write-Host "🔄 Rebuilding and Restarting PWA" -ForegroundColor Blue
    Write-Host "============================" -ForegroundColor Blue
    Write-Host ""

    # Stop any running development servers
    Write-Host "Stopping any running Next.js servers..." -ForegroundColor Yellow
    try {
        $nextProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -match "next" }
        if ($nextProcesses) {
            foreach ($process in $nextProcesses) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped process ID: $($process.Id)" -ForegroundColor Green
            }
        }
        else {
            Write-Host "No running Next.js servers found." -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Error stopping processes: $_" -ForegroundColor Red
    }

    # Rebuild the application
    Write-Host ""
    Write-Host "Rebuilding the application..." -ForegroundColor Yellow
    
    Set-Location -Path (Get-Location)
    
    try {
        # Clean cache
        Write-Host "Cleaning cache..." -ForegroundColor Yellow
        Invoke-Expression "pnpm clean" -ErrorAction SilentlyContinue
        if (Test-Path ".next") {
            Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        # Install dependencies
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        Invoke-Expression "pnpm install"
        
        # Build the application
        Write-Host "Building the application..." -ForegroundColor Yellow
        Invoke-Expression "pnpm build"
        
        Write-Host "Rebuild completed successfully." -ForegroundColor Green
    }
    catch {
        Write-Host "Error rebuilding application: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Yellow
    try {
        $devCommand = "pnpm dev"
        Write-Host "Running: $devCommand" -ForegroundColor Cyan
        # Start the command in a new window
        Start-Process powershell -ArgumentList "-Command", "& {$devCommand; Read-Host 'Press Enter to close'}"
        Write-Host "Development server started in a new window." -ForegroundColor Green
    }
    catch {
        Write-Host "Error starting development server: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Pause
}

# Option 3: Reset all PWA data
function Reset-PWAData {
    Write-Host "🗑️ Resetting All PWA Data" -ForegroundColor Blue
    Write-Host "======================" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "This will reset all PWA-related data including:" -ForegroundColor Yellow
    Write-Host "- LocalStorage and IndexedDB data" -ForegroundColor Yellow
    Write-Host "- Service Worker registrations" -ForegroundColor Yellow
    Write-Host "- Browser caches for the application" -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "Are you sure you want to proceed? (Y/N)"
    if ($confirm -ne "Y" -and $confirm -ne "y") {
        Write-Host "Operation cancelled." -ForegroundColor Red
        Pause
        return
    }
    
    Write-Host ""
    Write-Host "Please follow these steps manually:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Open your browser's developer tools (F12)" -ForegroundColor White
    Write-Host "2. Go to the Application tab" -ForegroundColor White
    Write-Host "3. Clear the following under Storage:" -ForegroundColor White
    Write-Host "   - Local Storage" -ForegroundColor White
    Write-Host "   - Session Storage" -ForegroundColor White
    Write-Host "   - IndexedDB" -ForegroundColor White
    Write-Host "   - Web SQL" -ForegroundColor White
    Write-Host "   - Cookies" -ForegroundColor White
    Write-Host "4. Under Cache, clear Cache Storage" -ForegroundColor White
    Write-Host "5. Under Service Workers, unregister any service workers" -ForegroundColor White
    Write-Host ""
    Write-Host "After completing these steps, refresh the page or restart the browser." -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "PWA data reset instructions completed." -ForegroundColor Green
    Write-Host ""
    Pause
}

# Main loop
$option = ""
while ($option -ne "Q") {
    Show-Menu
    $option = Read-Host "Enter your choice"
    
    switch ($option) {
        "1" { Clear-BrowserCaches }
        "2" { Rebuild-PWA }
        "3" { Reset-PWAData }
        "Q" { Write-Host "Exiting..." -ForegroundColor Red }
        "q" { $option = "Q"; Write-Host "Exiting..." -ForegroundColor Red }
        default { Write-Host "Invalid option. Please try again." -ForegroundColor Red; Pause }
    }
}
