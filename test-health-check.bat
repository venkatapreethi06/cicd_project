@echo off
echo 🧪 Testing PowerShell health check...
echo.

echo Testing current weather app on port 3000...
powershell -Command "try { Invoke-WebRequest -Uri http://localhost:3000 -TimeoutSec 10 -UseBasicParsing | Out-Null; Write-Host '✅ Port 3000 is accessible' } catch { Write-Host '❌ Port 3000 is not accessible'; exit 1 }"

echo.
echo Testing staging port 3001 (should fail if no staging)...
powershell -Command "try { Invoke-WebRequest -Uri http://localhost:3001 -TimeoutSec 5 -UseBasicParsing | Out-Null; Write-Host '✅ Port 3001 is accessible' } catch { Write-Host 'ℹ️ Port 3001 is not accessible (expected if no staging)' }"

echo.
echo 🎉 PowerShell health check test complete!