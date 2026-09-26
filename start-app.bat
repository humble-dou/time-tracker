@echo off
cd /d "C:\Users\xiaodou\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a5f1e0697154f0cd87e13a3\time-tracker"
start /b python -m http.server 8766
timeout /t 2 /nobreak >nul
start msedge "http://localhost:8766/index.html"
