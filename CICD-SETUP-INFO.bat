@echo off
echo ===========================================
echo    Weather App CI/CD Setup Complete!
echo ===========================================
echo.
echo 🌐 Jenkins Dashboard: http://localhost:8082
echo 🔑 Initial Admin Password: 7610928b056548eba4d37b4f6cdea7f2
echo 🌐 Weather App: http://localhost:3000
echo.
echo 📋 Next Steps:
echo 1. Open http://localhost:8082 in your browser
echo 2. Enter the admin password shown above
echo 3. Click "Install suggested plugins"
echo 4. Create admin user (optional)
echo 5. Click "Start using Jenkins"
echo 6. Create a new Pipeline job named "weather-app-pipeline"
echo 7. In job configuration:
echo    - Select "Pipeline script from SCM"
echo    - SCM: Git
echo    - Repository URL: https://github.com/ShaikMuktharBasha/cicd_weatherApp.git
echo    - Branch: main
echo    - Script Path: Jenkinsfile.cicd
echo 8. Save and click "Build Now"
echo.
echo 🎉 Your weather app will now automatically build and deploy on every code change!
echo.
pause