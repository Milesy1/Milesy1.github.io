# pull.ps1
# Pull latest changes from GitHub

# Go to the repository folder (optional if running in repo folder)
# Set-Location "C:\Users\Miles\TouchDesigner\Milesy1.github.io"

Write-Host "Fetching latest changes from GitHub..." -ForegroundColor Cyan
git fetch origin

Write-Host "Resetting local branch to match origin/main..." -ForegroundColor Cyan
git reset --hard origin/main

Write-Host "Pull complete. Current branch state:" -ForegroundColor Green
git status
git log --oneline -5
