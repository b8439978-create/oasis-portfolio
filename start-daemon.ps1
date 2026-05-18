$log = "$PSScriptRoot\server.log"
$port = 3000
$dir = $PSScriptRoot

"Starting OASIS at $(Get-Date)" | Out-File $log

# Kill any existing node on this port
netstat -ano | Select-String ":$port " | ForEach-Object {
  $parts = $_ -split '\s+'
  $pid = $parts[-1]
  if ($pid -match '^\d+$') { try { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } catch {} }
}

Start-Sleep 2

$env:NODE_OPTIONS = "--max-old-space-size=4096"
$proc = Start-Process -FilePath "C:\Program Files\nodejs\node.exe" `
  -ArgumentList "node_modules\next\dist\bin\next", "dev", "--port", "$port" `
  -WorkingDirectory $dir -WindowStyle Hidden -PassThru

"PID: $($proc.Id)" | Out-File $log -Append

# Wait for server
Start-Sleep 10

# Open browser
try { Start-Process "http://localhost:$port" } catch {}
