# Weather App CI/CD in Docker - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Prerequisites
- Docker installed and running
- Git repository cloned
- Ports 8080 and 3000 available

### 2. Configure Environment (Optional)
```bash
cp .env.jenkins .env
# Edit .env with your values
```

### 3. Start Jenkins
```bash
# Linux/Mac
./setup-cicd.sh start

# Windows
setup-cicd.bat
```

### 4. Access Jenkins
- URL: http://localhost:8080
- Username: `admin`
- Password: `admin123`

### 5. Create Pipeline Job
1. Click "New Item"
2. Name: `weather-app-cicd`
3. Type: Pipeline
4. Configure:
   - Repository URL: Your Git repo
   - Branch: `main`
   - Script Path: `Jenkinsfile.docker`
5. Save and Build

## 📋 What Happens Next

1. **Build Stage**: Creates Docker image
2. **Test Stage**: Runs health checks
3. **Deploy Stage**: Runs app on port 3000
4. **Verify Stage**: Confirms deployment

## 🌐 Access Your App

After successful build: http://localhost:3000

## 🛑 Stop Everything

```bash
# Linux/Mac
./setup-cicd.sh stop

# Windows
docker-compose -f docker-compose.jenkins.yml down
```

## 🔧 Troubleshooting

**Jenkins not accessible:**
```bash
docker-compose -f docker-compose.jenkins.yml logs jenkins
```

**Build fails:**
- Check Docker is running
- Verify repository URL
- Check Jenkinsfile.docker exists

**Permission issues:**
```bash
# On Linux/Mac
sudo chmod 666 /var/run/docker.sock
```

## 📁 File Structure
```
weather-app/
├── Dockerfile              # App container
├── jenkins-dockerfile      # Jenkins container
├── docker-compose.yml      # App deployment
├── docker-compose.jenkins.yml  # Jenkins deployment
├── Jenkinsfile.docker      # CI/CD pipeline
├── setup-cicd.sh          # Linux/Mac setup
├── setup-cicd.bat         # Windows setup
├── .env.jenkins           # Environment template
└── README.md              # Full documentation
```

That's it! Your CI/CD pipeline is now running in Docker! 🎉