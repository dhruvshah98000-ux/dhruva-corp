@echo off
title Dhruva Corp — Start All
color 0E
echo.
echo  ==========================================
echo   DHRUVA CORPORATION — Starting Both Servers
echo  ==========================================
echo.
echo  Opening Backend (port 5000) ...
start "Dhruva Backend" cmd /k "cd /d "%~dp0server" && color 0A && npm run dev"

echo  Opening Frontend (port 3000) ...
start "Dhruva Frontend" cmd /k "cd /d "%~dp0frontend" && color 0B && npm run dev"

echo.
echo  Both servers starting in separate windows.
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo.
timeout /t 3 >nul
exit
