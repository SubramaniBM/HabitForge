@echo off
echo ========================================
echo Starting HabitForge Frontend
echo ========================================
echo.

cd frontend

if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first.
    pause
    exit
)

if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env
    pause
    exit
)

echo Starting React development server...
echo App will open at http://localhost:3000
echo Press Ctrl+C to stop
echo.

call npm start
