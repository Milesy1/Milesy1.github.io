@echo off
cd /d C:\Users\Miles\TouchDesigner\Milesy1.github.io
echo === Adding all changes ===
git add --all
echo === Committing changes ===
git commit -m "update site"
echo === Pushing to GitHub ===
git push origin main
echo === Done! ===
pause
