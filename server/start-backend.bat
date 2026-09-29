@echo off
title Dhruva Corp — Backend API
color 0A
echo.
echo  ==========================================
echo   DHRUVA CORPORATION — Backend API Server
echo  ==========================================
echo.
echo  Starting Express API on port 5000...
echo  URL: http://localhost:5000
echo.
cd /d "%~dp0"
npm run dev
pause
