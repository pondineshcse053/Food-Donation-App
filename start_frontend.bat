@echo off
title Food Donation Frontend App
echo Starting React Vite Frontend Server on http://127.0.0.1:5173...
cd /d "%~dp0frontend"
npm.cmd run dev -- --host 127.0.0.1 --port 5173
pause
