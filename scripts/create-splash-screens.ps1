# Create iOS splash screens for different device sizes
$splashSizes = @(
    "apple-splash-1668-2388.png",
    "apple-splash-1536-2048.png",
    "apple-splash-1242-2688.png",
    "apple-splash-1125-2436.png",
    "apple-splash-828-1792.png",
    "apple-splash-750-1334.png",
    "apple-splash-640-1136.png"
)

# Source icon
$sourceIcon = "public\images\math_tutor_ico.png"
$targetDir = "public\images\splash\"

# Check if source exists
if (-not (Test-Path $sourceIcon)) {
    Write-Error "Source icon not found: $sourceIcon"
    exit 1
}

# Create the splash screens
foreach ($size in $splashSizes) {
    $targetPath = Join-Path $targetDir $size
    Copy-Item -Path $sourceIcon -Destination $targetPath -Force
    Write-Host "Created $targetPath"
}

Write-Host "All splash screens created successfully."
