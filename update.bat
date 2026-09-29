@echo off
title Dhruva Corp — Update & Deploy
color 0E
echo.
echo  ==========================================
echo   DHRUVA CORPORATION — Uploading Update
echo  ==========================================
echo.
cd /d "%~dp0"
git add .
git commit -m "Update %date% %time%"
git push
echo.
echo  Done! Site will update in 2-3 minutes.
echo  https://dhruva-corp.netlify.app
echo.
pause
