# backup.ps1
# PowerShell script to backup your GitHub site folder, zip it, and log the operation

# Source folder
$source = "C:\Users\Miles\TouchDesigner\Milesy1.github.io"

# Backup destination root
$backupRoot = "C:\Users\Miles\TouchDesigner\Backups"

# Create timestamped folder
$date = Get-Date -Format "yyyyMMdd_HHmm"
$destinationFolder = Join-Path $backupRoot "Milesy1_$date"

# Create destination folder
New-Item -ItemType Directory -Path $destinationFolder -Force

# Copy files recursively
Copy-Item $source $destinationFolder -Recurse -Force

# Create zip file
$zipPath = "$destinationFolder.zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($destinationFolder, $zipPath)

# Optionally remove the unzipped folder to save space
Remove-Item $destinationFolder -Recurse -Force

# Logging
$logFile = Join-Path $backupRoot "backup_log.txt"
$logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Backup created: $zipPath"
Add-Content -Path $logFile -Value $logEntry

Write-Output "Backup completed and zipped successfully to $zipPath"
