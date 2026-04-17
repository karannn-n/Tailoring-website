Set shell = CreateObject("WScript.Shell")
scriptPath = Replace(WScript.ScriptFullName, "open_website.vbs", "start_website.ps1")
command = "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & scriptPath & """"
shell.Run command, 0, False
