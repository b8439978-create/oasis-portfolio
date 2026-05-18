$logFile = "$PSScriptRoot\server.log"
$port = 3000

"Starting OASIS server at $(Get-Date)..." | Out-File $logFile

$process = Start-Process -FilePath "C:\Program Files\nodejs\node.exe" `
    -ArgumentList "node_modules\next\dist\bin\next", "dev", "--port", $port `
    -WorkingDirectory $PSScriptRoot `
    -WindowStyle Minimized `
    -PassThru

"Process ID: $($process.Id)" | Out-File $logFile -Append
"Server should be at http://localhost:$port" | Out-File $logFile -Append

Start-Sleep -Seconds 10
Start-Process "http://localhost:$port"
