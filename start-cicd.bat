@echo off
echo 🚀 Starting Weather App CI/CD Container...
echo.

REM Stop any existing containers
docker-compose -f docker-compose.cicd.yml down 2>nul

REM Start the new CI/CD container
docker-compose -f docker-compose.cicd.yml up -d

echo.
echo ⏳ Waiting for Jenkins to start up...
timeout /t 10 /nobreak >nul

REM Check container status
docker ps --filter name=weather-app-cicd --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 🎉 CI/CD Container started successfully!
echo 🌐 Jenkins UI: http://localhost:8082
echo 🔑 Initial admin password: docker exec weather-app-cicd cat /var/jenkins_home/secrets/initialAdminPassword
echo.
echo 📝 Next steps:
echo 1. Open http://localhost:8082 in your browser
echo 2. Enter the initial admin password shown above
echo 3. Install suggested plugins
echo 4. Create admin user
echo 5. Create a new pipeline job using Jenkinsfile.cicd
echo.
pause