# Weather App CI/CD - Windows Jenkins Setup

## Overview
This setup provides a complete CI/CD pipeline for the weather app using Jenkins on Windows with Docker.

## Files
- `Jenkinsfile.windows` - Windows-compatible Jenkins pipeline
- `Jenkinsfile.cicd` - Updated pipeline with Windows batch commands
- `docker-compose.cicd.yml` - Jenkins container configuration
- `jenkins-windows-commands.bat` - Demo of Windows batch commands

## Windows Batch Commands Used in Jenkins

### 1. Build Stage
```batch
docker build -t weather-app:%BUILD_NUMBER% .
docker tag weather-app:%BUILD_NUMBER% weather-app:latest
```

### 2. Test Stage
```batch
@echo off
echo Starting test container...
docker run -d --name weather-app-test-%BUILD_NUMBER% -p 3001:3000 weather-app:%BUILD_NUMBER%

echo Waiting 30 seconds for app to start...
timeout /t 30 /nobreak >nul

echo Testing health check...
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3001 -TimeoutSec 10; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

echo Cleaning up test container...
docker stop weather-app-test-%BUILD_NUMBER% >nul 2>&1
docker rm weather-app-test-%BUILD_NUMBER% >nul 2>&1
```

### 3. Deploy Stage
```batch
@echo off
echo Stopping existing production container...
docker stop weather-app-prod >nul 2>&1
docker rm weather-app-prod >nul 2>&1

echo Starting new production container...
docker run -d --name weather-app-prod -p 3000:3000 --restart unless-stopped weather-app:%BUILD_NUMBER%
```

### 4. Health Check (PowerShell)
```batch
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3000 -TimeoutSec 10; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
```

### 5. Cleanup Stage
```batch
@echo off
echo Removing build image...
docker rmi weather-app:%BUILD_NUMBER% >nul 2>&1

echo Pruning containers and images...
docker container prune -f >nul 2>&1
docker image prune -f >nul 2>&1
```

## Jenkins Pipeline Setup

1. **Start Jenkins**: Run `start-cicd.bat`
2. **Access Jenkins**: Go to http://localhost:8082
3. **Initial Setup**:
   - Enter admin password (shown in terminal)
   - Install suggested plugins
   - Create admin user

4. **Create Pipeline Job**:
   - New Item → Pipeline
   - Name: `weather-app-pipeline`
   - Pipeline script from SCM
   - Git repository: `https://github.com/ShaikMuktharBasha/cicd_weatherApp.git`
   - Script Path: `Jenkinsfile.windows`
   - Save and Build Now

## Environment Variables
- `%BUILD_NUMBER%` - Jenkins build number
- `%DOCKER_IMAGE%` - Docker image name (weather-app)
- `%DOCKER_TAG%` - Docker tag (build number)
- `%APP_PORT%` - Application port (3000)
- `%TEST_PORT%` - Test port (3001)

## Testing
Run `jenkins-windows-commands.bat` to test the commands manually.

## Troubleshooting
- Ensure Docker Desktop is running
- Check that ports 3000 and 8082 are available
- Use `docker logs <container-name>` for debugging
- Check Jenkins logs at http://localhost:8082/logs