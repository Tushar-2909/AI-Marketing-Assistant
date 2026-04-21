@echo off
title Marketing Planning Generator - Backend & Frontend
echo.
echo Starting Marketing Planning Generator...
echo.

set BACKEND_PORT=8000
if not "%PORT%"=="" set BACKEND_PORT=%PORT%

REM Start Python backend
echo Starting backend server on http://localhost:%BACKEND_PORT%...
start /d "d:\6th sem ki padhai\agentic AI\marketing planning generator" cmd /k "python server.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo Starting frontend dev server on http://localhost:5173...
start /d "d:\6th sem ki padhai\agentic AI\marketing planning generator\marketing-muse-main\marketing-muse-main" cmd /k "npm run dev"

echo.
echo Both servers are starting!
echo.
echo Backend:  http://localhost:%BACKEND_PORT%
echo Frontend: http://localhost:5173
echo Docs:     http://localhost:%BACKEND_PORT%/docs
echo.
pause
