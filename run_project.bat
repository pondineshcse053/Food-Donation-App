@echo off
title AI Food Donation System Launcher
echo ======================================================================
echo   AI-Based Smart Food Donation, Tracking ^& Redistribution System
echo ======================================================================
echo.
echo Starting FastAPI Backend Server on port 8000...
start "Food Donation - Backend (FastAPI)" cmd /k "cd /d %~dp0backend && py -3.12 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Vite React Frontend on port 5173...
start "Food Donation - Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://127.0.0.1:5173...
start http://127.0.0.1:5173

echo.
echo ======================================================================
echo System is now live!
echo Frontend: http://127.0.0.1:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo ======================================================================
pause
