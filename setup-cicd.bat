@echo off
REM Weather App CI/CD Docker Setup Script for Windows
REM This script sets up Jenkins in Docker for CI/CD

echo 🚀 Setting up Weather App CI/CD in Docker
echo ==========================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if port 8080 is available
netstat -an | find "8080" | find "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 8080 is already in use. Jenkins may not start properly.
    choice /c yn /m "Continue anyway?"
    if %errorlevel% neq 1 exit /b 1
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist jenkins_home mkdir jenkins_home
if not exist workspace mkdir workspace

REM Start Jenkins
echo 🐳 Starting Jenkins in Docker...
docker-compose -f docker-compose.jenkins.yml up -d

echo ⏳ Waiting for Jenkins to start...
timeout /t 30 /nobreak > nul

REM Check if Jenkins is running
curl -f http://localhost:8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Jenkins is running!
    echo 🌐 Access Jenkins at: http://localhost:8080
    echo 👤 Default credentials:
    echo    Username: admin
    echo    Password: admin123
) else (
    echo ❌ Jenkins failed to start. Check logs:
    echo    docker-compose -f docker-compose.jenkins.yml logs
    pause
    exit /b 1
)

echo.
echo 🎯 CI/CD Setup Complete!
echo Next steps:
echo 1. Open http://localhost:8080 in your browser
echo 2. Login with admin/admin123
echo 3. Create a new Pipeline job
echo 4. Configure it to use Jenkinsfile.docker from this repository
echo.
pause