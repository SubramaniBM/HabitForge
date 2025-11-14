@echo off
echo ========================================
echo HabitForge - Setup Script
echo ========================================
echo.

echo Step 1: Setting up Backend...
cd backend

if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit backend\.env with your MongoDB URI and JWT secret!
) else (
    echo .env file already exists.
)

cd ..

echo.
echo Step 2: Setting up Frontend...
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
) else (
    echo .env file already exists.
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Edit backend\.env with your settings
echo 3. Run 'npm run dev' in the backend folder
echo 4. Run 'npm start' in the frontend folder
echo.
echo For detailed instructions, see README.md
echo.
pause
