@echo off
title Push to GitHub - Food Donation App
echo ======================================================================
echo   Pushing to https://github.com/pondineshcse053/Food-Donation-App.git
echo ======================================================================
echo.
cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Successfully pushed to GitHub repository!
) else (
    echo [ERROR] Git push encountered an issue. Check credentials above.
)
echo.
pause
