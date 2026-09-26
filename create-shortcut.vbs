Set WshShell = WScript.CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShortcut = WshShell.CreateShortcut(strDesktop & "\时间都去哪儿啦.lnk")
oShortcut.TargetPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
oShortcut.Arguments = "file:///C:/Users/xiaodou/AppData/Roaming/TRAE%20SOLO%20CN/ModularData/ai-agent/work-mode-projects/6a5f1e0697154f0cd87e13a3/time-tracker/index.html"
oShortcut.IconLocation = "C:\Users\xiaodou\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a5f1e0697154f0cd87e13a3\time-tracker\icon-256.ico"
oShortcut.Description = "时间都去哪儿啦 - 时间追踪应用"
oShortcut.Save
WScript.Echo "桌面快捷方式已创建！"
