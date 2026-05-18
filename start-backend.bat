@echo off
title OASIS - Python Backend
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
echo   Python FastAPI Backend Server
echo  ═══════════════════════════════════════
echo.

:: Check if python is installed
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Python topilmadi!
    pause
    exit /b
)

echo  [INFO] Starting OASIS backend server...
echo.
echo  API: http://localhost:8000
echo  Docs: http://localhost:8000/docs
echo.
echo  Bu oynani yopmang!
echo.

cd backend

:: Install dependencies
if not exist "venv" (
    echo  [INFO] Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

python run.py
pause
