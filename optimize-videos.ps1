# Video Optimization Script for Web Streaming
# Uses FFmpeg to optimize videos for better web performance

$ffmpegPath = "C:\Users\$env:USERNAME\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin\ffmpeg.exe"
$mediaDir = "A:\My-Portfolio\My-Portfolio\public\media\projects"

Write-Host "🎬 Starting Video Optimization..." -ForegroundColor Green
Write-Host "FFmpeg Path: $ffmpegPath" -ForegroundColor Yellow
Write-Host "Media Directory: $mediaDir" -ForegroundColor Yellow
Write-Host ""

# Get all MP4 files
$videoFiles = Get-ChildItem -Path $mediaDir -Filter "*.mp4"

foreach ($video in $videoFiles) {
    $inputPath = $video.FullName
    $outputPath = $inputPath -replace '\.mp4$', '_optimized.mp4'

    Write-Host "📹 Optimizing: $($video.Name)" -ForegroundColor Cyan
    Write-Host "Input: $inputPath" -ForegroundColor Gray
    Write-Host "Output: $outputPath" -ForegroundColor Gray

    # FFmpeg command for web optimization
    $arguments = @(
        "-i", $inputPath,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-y",
        $outputPath
    )

    try {
        & $ffmpegPath $arguments

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully optimized: $($video.Name)" -ForegroundColor Green

            # Get file sizes for comparison
            $originalSize = (Get-Item $inputPath).Length / 1MB
            $optimizedSize = (Get-Item $outputPath).Length / 1MB

            Write-Host "Original size: $([math]::Round($originalSize, 2)) MB" -ForegroundColor Gray
            Write-Host "Optimized size: $([math]::Round($optimizedSize, 2)) MB" -ForegroundColor Gray
            Write-Host "Space saved: $([math]::Round($originalSize - $optimizedSize, 2)) MB" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to optimize: $($video.Name)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error processing $($video.Name): $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
}

Write-Host '🎉 Video optimization complete!' -ForegroundColor Green
Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host '1. Replace original videos with optimized versions' -ForegroundColor White
Write-Host '2. Run: node migrate-to-gcp.js' -ForegroundColor White
Write-Host '3. Test the videos in your application' -ForegroundColor White
