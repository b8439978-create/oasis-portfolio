Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

' Kill any existing node processes
WshShell.Run "taskkill /F /IM node.exe", 0, True

' Wait a moment
WScript.Sleep 2000

' Start the server
WshShell.Run "cmd /c cd /d C:\Users\ABDURASULOV.B.N\Desktop\myprojects\oasis-portfolio && node node_modules\next\dist\bin\next dev --port 3000", 0, False

' Wait for server to start
WScript.Sleep 12000

' Open browser
WshShell.Run "cmd /c start http://localhost:3000", 0, False
