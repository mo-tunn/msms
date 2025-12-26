@echo off
title MSMS Launcher

REM Backend
start "MSMS Backend" cmd /k "cd /d C:\Users\metehan\Desktop\msms\backend && npm run dev"

REM Client
start "MSMS Client" cmd /k "cd /d C:\Users\metehan\Desktop\msms\frontend\client && npm run dev"

REM Python ML Engine
start "Python ML Engine" cmd /k "cd /d C:\Users\metehan\Desktop\msms\external-services\PythonMLEngine && python grpc_server.py"
