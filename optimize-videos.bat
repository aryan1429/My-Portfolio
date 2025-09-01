@echo off
REM Video Optimization Script for Web Streaming
REM Uses FFmpeg to optimize videos for better web performance

set FFMPEG_PATH=C:\Users\%USERNAME%\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0-full_build\bin\ffmpeg.exe
set MEDIA_DIR=A:\My-Portfolio\My-Portfolio\public\media\projects

echo 🎬 Starting Video Optimization...
echo FFmpeg Path: %FFMPEG_PATH%
echo Media Directory: %MEDIA_DIR%
echo.

cd /d %MEDIA_DIR%

REM Process each MP4 file
for %%f in (*.mp4) do (
    echo 📹 Optimizing: %%~nf.mp4
    echo Input: %%f
    echo Output: %%~nf_optimized.mp4

    "%FFMPEG_PATH%" -i "%%f" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart -y "%%~nf_optimized.mp4"

    if %ERRORLEVEL% EQU 0 (
        echo ✅ Successfully optimized: %%~nf.mp4

        REM Get file sizes (approximate)
        for %%A in ("%%f") do set "original_size=%%~zA"
        for %%A in ("%%~nf_optimized.mp4") do set "optimized_size=%%~zA"

        echo Original size: %original_size% bytes
        echo Optimized size: %optimized_size% bytes
    ) else (
        echo ❌ Failed to optimize: %%~nf.mp4
    )

    echo.
)

echo 🎉 Video optimization complete!
echo.
echo Next steps:
echo 1. Replace original videos with optimized versions
echo 2. Run: node migrate-to-gcp.js
echo 3. Test the videos in your application

pause