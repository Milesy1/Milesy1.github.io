# Save this as push.ps1 in your project folder

# Go to the repo folder (edit this path if needed)
Set-Location "C:\Users\Miles\TouchDesigner\Milesy1.github.io"

# Stage all changes
git add --all

# Commit with a timestamped message
$time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-commit at $time"

# Push to GitHub
git push origin main

# Show latest commit on GitHub (origin/main)
Write-Host "`n--- Latest commit on GitHub ---" -ForegroundColor Green
git log origin/main -1 --pretty=format:"%h %s (%cr)"
