@echo off
cd /d "C:\Users\Miles\Desktop\modular website\modular"
echo.
echo Checking git status...
git status
echo.
echo Adding all updated files...
git add .
echo.
echo Committing changes...
git commit -m "Add individual pages for all project cards with detailed content and navigation"
echo.
echo Pushing to GitHub...
git push origin master:main
echo.
echo Done! Press any key to exit.
pause > nul