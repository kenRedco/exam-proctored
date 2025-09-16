# This script restarts the TypeScript server in VS Code
$vsCodePid = Get-Process -Name "Code" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id
if ($vsCodePid) {
    # Get the TypeScript server process
    $tsServerProcess = Get-Process | Where-Object { $_.MainWindowTitle -like "*TypeScript*" }
    if ($tsServerProcess) {
        Stop-Process -Id $tsServerProcess.Id -Force
        Write-Host "TypeScript server restarted successfully."
    } else {
        Write-Host "TypeScript server process not found. It may restart automatically."
    }
} else {
    Write-Host "VS Code is not running. Please open VS Code and try again."
}
