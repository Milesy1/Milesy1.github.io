@echo off
cd /d C:\Users\Miles\TouchDesigner\Milesy1.github.io

set /p msg=Enter commit message: 

git add .
git commit -m "%msg%"
git push origin main

echo.
echo ✅ Push complete!
pause
