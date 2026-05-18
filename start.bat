@echo off
title OASIS - Portfolio Website
color 0B
cls
echo.
echo   ██████╗  █████╗ ███████╗██╗███████╗
echo  ██╔═══██╗██╔══██╗██╔════╝██║██╔════╝
echo  ██║   ██║███████║███████╗██║███████╗
echo  ██║   ██║██╔══██║╚════██║██║╚════██║
echo  ╚██████╔╝██║  ██║███████║██║███████║
echo   ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝
echo.
echo  ═══════════════════════════════════════
echo   Crafting Futuristic Digital Experiences
echo  ═══════════════════════════════════════
echo.

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Node.js topilmadi! Iltimos Node.js ni o'rnating.
    echo  Download: https://nodejs.org
    pause
    exit /b
)

echo  [INFO] Starting OASIS development server...
echo.
echo  Frontend: http://localhost:3000
echo  Admin:    http://localhost:3000/admin
echo  Login:    admin / oasis2024
echo.
echo  Website brauzeringizda ochiladi...
echo  Bu oynani yopmang!
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo  [INFO] Installing dependencies...
    call npm install
)

:: Start the server
start http://localhost:3000
node node_modules\next\dist\bin\next dev --port 3000

pause
