$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $projectRoot ".flask-server.pid"

if (-not (Test-Path $pidFile)) {
    Write-Output "No saved server PID was found."
    exit 0
}

$pidValue = Get-Content -Path $pidFile | Select-Object -First 1
if (-not $pidValue) {
    Remove-Item -LiteralPath $pidFile -Force
    Write-Output "The PID file was empty, so it was removed."
    exit 0
}

$process = Get-Process -Id ([int]$pidValue)
if ($process) {
    Stop-Process -Id $process.Id -Force
    Write-Output "Stopped local server process $($process.Id)."
} else {
    Write-Output "The saved server process was not running."
}

Remove-Item -LiteralPath $pidFile -Force
