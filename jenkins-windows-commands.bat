@echo off
echo ===========================================
echo    Windows Jenkins Batch Commands Demo
echo ===========================================
echo.
echo These are the Windows batch commands used in Jenkins:
echo.
echo 1. Build Docker Image:
echo    docker build -t weather-app:%%BUILD_NUMBER%% .
echo    docker tag weather-app:%%BUILD_NUMBER%% weather-app:latest
echo.
echo 2. Test Application:
echo    docker run -d --name weather-app-test-%%BUILD_NUMBER%% -p 3001:3000 weather-app:%%BUILD_NUMBER%%
echo    timeout /t 30 /nobreak ^>nul
echo    powershell health check command...
echo    docker stop weather-app-test-%%BUILD_NUMBER%%
echo    docker rm weather-app-test-%%BUILD_NUMBER%%
echo.
echo 3. Deploy to Production:
echo    docker stop weather-app-prod
echo    docker rm weather-app-prod
echo    docker run -d --name weather-app-prod -p 3000:3000 --restart unless-stopped weather-app:%%BUILD_NUMBER%%
echo.
echo 4. Health Check (PowerShell):
echo    powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3000 -TimeoutSec 10;
echo    if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
echo.
echo 5. Cleanup:
echo    docker rmi weather-app:%%BUILD_NUMBER%%
echo    docker container prune -f
echo    docker image prune -f
echo.
echo ===========================================
echo Test these commands manually:
echo ===========================================
echo.
echo Testing current setup...
docker ps --filter name=weather-app --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
echo Testing health check...
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3000 -TimeoutSec 10; if ($response.StatusCode -eq 200) { Write-Host '✅ App is healthy' } else { Write-Host '❌ App returned status:' $response.StatusCode } } catch { Write-Host '❌ Health check failed:' $_.Exception.Message }"
echo.
pause