@echo off
echo ========================================
echo Starting HabitForge Backend Server
echo ========================================
echo.

cd backend

if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first.
    pause
    exit
)

if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and configure it.
    pause
    exit
)

echo Starting backend server...
echo Server will run on http://localhost:5000
echo Press Ctrl+C to stop
echo.

call npm run dev
