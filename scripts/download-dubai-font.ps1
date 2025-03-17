# PowerShell script to download Dubai font
$fontsDir = "public/fonts/dubai"

# Create array of font weights to download
$fontWeights = @(
    "300", # Light
    "400", # Regular
    "500", # Medium
    "700"  # Bold
)

foreach ($weight in $fontWeights) {
    $fileName = "Dubai-$weight.woff2"
    $outputPath = "$fontsDir/$fileName"
    
    Write-Host "Downloading $fileName..."
    
    # URLs for Dubai font - using Google Fonts API
    # Note: This is a placeholder URL. In a real scenario, you'd need the actual font URL
    $url = "https://fonts.gstatic.com/s/dubai/v$weight/$fileName"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath
        Write-Host "Downloaded $fileName successfully"
    }
    catch {
        Write-Host "Failed to download $fileName. Error: $_"
    }
}

Write-Host "Font download process completed."
