# publish-document.ps1

# 1️⃣ Ask for document title
$title = Read-Host "Enter document title"

# 2️⃣ Ask for document body/content
$content = Read-Host "Enter document content (short description)"

# 3️⃣ Ask for a file to upload (optional)
$filePath = Read-Host "Enter full path of file to upload (or press Enter to skip)"
$uploadFileName = ""
if ($filePath -and (Test-Path $filePath)) {
    # Ensure uploads folder exists
    $uploadsFolder = ".\uploads"
    if (-Not (Test-Path $uploadsFolder)) { New-Item -ItemType Directory -Path $uploadsFolder }

    # Copy the file
    $uploadFileName = Split-Path $filePath -Leaf
    Copy-Item -Path $filePath -Destination (Join-Path $uploadsFolder $uploadFileName) -Force
    Write-Host "File '$uploadFileName' uploaded to '$uploadsFolder'."
} elseif ($filePath) {
    Write-Host "File not found at path '$filePath'. Skipping upload."
}

# 4️⃣ Create Markdown file in /documents
$documentsFolder = ".\documents"
if (-Not (Test-Path $documentsFolder)) { New-Item -ItemType Directory -Path $documentsFolder }

$date = Get-Date -Format "yyyy-MM-dd"
$fileNameSafe = ($title -replace '\s+', '-') -replace '[^a-zA-Z0-9\-]', ''
$mdFileName = "$date-$fileNameSafe.md"
$mdFilePath = Join-Path $documentsFolder $mdFileName

$mdContent = "# $title`n`n$content"
if ($uploadFileName) {
    $mdContent += "`n`n[Download File](../uploads/$uploadFileName)"
}

Set-Content -Path $mdFilePath -Value $mdContent
Write-Host "Markdown document created: $mdFileName"

# 5️⃣ Update documents.html page
$docFiles = Get-ChildItem -Path $documentsFolder -Filter *.md | Sort-Object Name
$htmlList = $docFiles | ForEach-Object {
    $linkTitle = $_.BaseName -replace '^\d{4}-\d{2}-\d{2}-','' -replace '-', ' '
    "<li><a href='../documents/$($_.Name)'>$linkTitle</a></li>"
}

$documentsHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Documents</title>
</head>
<body>
<h1>Documents</h1>
<ul>
$htmlList
</ul>
</body>
</html>
"@

$pagesFolder = ".\pages"
if (-Not (Test-Path $pagesFolder)) { New-Item -ItemType Directory -Path $pagesFolder }

$documentsHtmlPath = Join-Path $pagesFolder "documents.html"
Set-Content -Path $documentsHtmlPath -Value $documentsHtml
Write-Host "Documents page updated: documents.html"
