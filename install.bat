@echo off
setlocal enabledelayedexpansion
title Installer
cls

echo Starting Installation...
echo.

set "bar=##########"
set "spaces=          "
for /L %%i in (1,1,10) do (
    cls
    set /a "pct=%%i*10"
    set "progress=!bar:~0,%%i!"
    set "remaining=!spaces:~%%i!"
    echo Installing: [!progress!!remaining!] !pct!%%
    timeout /t 1 >nul
)

echo.
echo Finalizing npm packages...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo Installation failed! Check your internet or package.json.
    pause
    exit /b
)

echo.
echo Done! Account creator is ready to use.
pause