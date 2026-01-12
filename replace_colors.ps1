# PowerShell script to replace #0096DC with COLORS.primary
$files = Get-ChildItem -Path "app" -Filter "*.tsx" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $newContent = $content -replace '#0096DC', 'COLORS.primary'
    $newContent | Set-Content $file.FullName
    Write-Host "Updated: $($file.FullName)"
}
Write-Host "Done!"
