# PowerShell script to fix quoted COLORS.primary references
$files = Get-ChildItem -Path "app" -Filter "*.tsx" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName
    # Replace quoted 'COLORS.primary' with unquoted COLORS.primary
    $newContent = $content -replace "'COLORS\.primary'", 'COLORS.primary'
    $newContent | Set-Content $file.FullName
    Write-Host "Fixed: $($file.FullName)"
}
Write-Host "Done fixing quoted references!"
