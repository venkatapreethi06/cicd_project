@echo off
echo 🔍 Testing Weather App CI/CD Setup...
echo.

REM Test weather app
echo 🌐 Testing Weather App...
curl -f --max-time 5 http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Weather App is running on port 3000
) else (
    echo ❌ Weather App is not accessible
)

echo.

REM Test Jenkins
echo 🤖 Testing Jenkins CI/CD Server...
curl -f --max-time 5 http://localhost:8082/login >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Jenkins is running on port 8082
) else (
    echo ❌ Jenkins is not accessible
)

echo.
echo 📊 Container Status:
docker ps --filter "name=weather-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🎯 CI/CD Pipeline Ready!
echo Run CICD-SETUP-INFO.bat for setup instructions
echo.