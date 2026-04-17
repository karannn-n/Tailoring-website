$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $projectRoot ".flask-server.pid"
$url = "http://127.0.0.1:5000"

function Test-SiteRunning {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

if (Test-SiteRunning) {
    Start-Process $url
    exit 0
}

$pythonCommand = if (Get-Command py -ErrorAction SilentlyContinue) { "py" } else { "python" }
$pythonArgs = if ($pythonCommand -eq "py") { @("-3", "app.py") } else { @("app.py") }

$serverProcess = Start-Process `
    -FilePath $pythonCommand `
    -ArgumentList $pythonArgs `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -PassThru

$serverProcess.Id | Set-Content -Path $pidFile

for ($attempt = 0; $attempt -lt 15; $attempt++) {
    Start-Sleep -Seconds 1
    if (Test-SiteRunning) {
        Start-Process $url
        exit 0
    }
}

throw "The local server did not start successfully."
