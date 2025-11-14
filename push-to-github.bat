@echo off
echo ========================================
echo Pushing Changes to GitHub
echo ========================================
echo.

cd "c:\Users\madap\Desktop\College\WebTech\Webtech Project"

echo Step 1: Adding all changes...
git add .

echo.
echo Step 2: What did you change?
set /p message="Enter a short description (e.g., 'Fixed login bug'): "

echo.
echo Step 3: Committing changes...
git commit -m "%message%"

echo.
echo Step 4: Pushing to GitHub...
git push

echo.
echo ========================================
echo Done! Your changes are now on GitHub.
echo ========================================
pause
