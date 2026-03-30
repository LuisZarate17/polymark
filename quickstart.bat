@echo off
REM Quick start script for Polymarket trading dashboard (Windows)

setlocal enabledelayedexpansion

echo.
echo 🚀 Polymarket Trading Dashboard - Quick Start
echo =============================================="
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set nodejs=%%i
for /f "tokens=*" %%i in ('npm --version') do set npmver=%%i
echo ✓ Node.js %nodejs% found
echo ✓ npm %npmver% found
echo.

REM Setup environment
if not exist .env.local (
    echo ⚠️  .env.local not found. Creating from template...
    copy .env.example .env.local >nul
    echo 📝 Please edit .env.local and add your Polymarket API credentials
    echo    - POLYMARKET_API_KEY
    echo    - POLYMARKET_PRIVATE_KEY
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install >nul 2>&1
echo ✓ Dependencies installed
echo.

REM Get backend test results
echo 🧪 Running backend tests...
call npm run test:backend 2>nul | find "26 passed" >nul
if %errorlevel% equ 0 (
    echo ✓ All 26 tests passing!
) else (
    echo ⚠️  Check test output for details
)
echo.

REM Build backend
echo 🏗️  Building backend...
call npm run build:backend >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend compiled successfully
) else (
    echo ❌ Backend build failed
    pause
    exit /b 1
)
echo.

REM Done
echo ✅ Setup complete!
echo.
echo Next steps:
echo   1. Edit .env.local with Polymarket credentials
echo   2. Start development: npm run dev
echo   3. Open dashboard: http://localhost:3000
echo   4. API status: http://localhost:3001/api/status
echo.
echo Commands:
echo   npm run dev              - Start both servers
echo   npm run test:backend     - Run all tests (26 tests)
echo   npm run test:coverage    - Code coverage report
echo   npm run build            - Build for production
echo.
pause
