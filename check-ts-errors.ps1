# This script checks for TypeScript errors in the project
$tscOutput = npx tsc --noEmit --pretty
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No TypeScript errors found!" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript errors found:" -ForegroundColor Red
    $tscOutput
}
