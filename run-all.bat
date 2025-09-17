@echo off
echo ============================================
echo    🌤️ WEATHER APP - ALL SERVICES
echo ============================================
echo.

echo Installing dependencies...
npm install

echo.
echo Starting all weather services...
echo - React App: http://localhost:5173
echo - Static Pages: http://localhost:3001
echo - Hub: http://localhost:3001/index.html
echo.

npm run dev:all

pause
