@echo off
title StepAudioEX Studio Server
cd /d "%~dp0"
echo ============================================================
echo   StepAudioEX Studio Server Launching...
echo ============================================================
.venv\Scripts\python.exe run_server.py
pause
