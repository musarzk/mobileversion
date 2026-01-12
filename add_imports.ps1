# PowerShell script to add COLORS import to files that use it but don't import it
$files = Get-ChildItem -Path "app" -Filter "*.tsx" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file uses COLORS but doesn't import it
    if ($content -match "COLORS\." -and $content -notmatch "import.*COLORS.*from.*theme") {
        # Find the last import statement
        if ($content -match "(?s)(import[^;]*;)\s*\n\s*(?!import)") {
            $lastImport = $matches[1]
            # Add the COLORS import after the last import
            $newContent = $content -replace [regex]::Escape($lastImport), "$lastImport`r`nimport { COLORS } from '../../constants/theme';"
            $newContent | Set-Content $file.FullName
            Write-Host "Added import to: $($file.Name)"
        }
    }
}
Write-Host "Done adding imports!"
