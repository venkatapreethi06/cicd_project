# Weather App - Run All Services
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   🌤️ WEATHER APP - ALL SERVICES" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "Starting all weather services..." -ForegroundColor Green
Write-Host "- React App: http://localhost:5173" -ForegroundColor White
Write-Host "- Static Pages: http://localhost:3001" -ForegroundColor White
Write-Host "- Hub: http://localhost:3001/index.html" -ForegroundColor White
Write-Host ""

npm run dev:all
