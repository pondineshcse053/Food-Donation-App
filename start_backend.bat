@echo off
title Food Donation Backend Server
echo Starting FastAPI Backend Server on http://127.0.0.1:8000...
cd /d "%~dp0backend"
py -3.12 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
