# Weather App

A modern, responsive weather application built with HTML, CSS, and JavaScript. Features include current weather conditions, 5-day forecasts, weather maps, and a timeline view with precipitation data.

## Features

- 🌤️ Current weather conditions with beautiful glassmorphism UI
- 📍 Location-based weather using geolocation
- 🔍 City search functionality
- 🗺️ Interactive weather maps with Leaflet
- 📊 5-day weather forecast
- ⏰ Hourly weather timeline with precipitation indicators
- 📱 Fully responsive design
- 💌 Feedback system with email integration
- 🌍 World weather view

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API
- **Maps**: Leaflet.js
- **Icons**: Font Awesome
- **Email**: Formspree integration
- **Styling**: Glassmorphism design with CSS variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Deployment

#### Using Docker Compose (Recommended)

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

#### Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t weather-app .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 weather-app
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## API Configuration

The app uses the OpenWeatherMap API. Make sure to:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace the API key in the JavaScript files (`js/main.js`, `js/search.js`, `js/world.js`)

## Project Structure

```
weather-app/
├── index.html          # Main page
├── search.html         # Search page
├── world.html          # World view page
├── css/
│   ├── style.css       # Main styles
│   ├── search.css      # Search page styles
│   └── world.css       # World page styles
├── js/
│   ├── main.js         # Main page logic
│   ├── search.js       # Search functionality
│   └── world.js        # World view logic
├── img/                # Weather icons
├── public/             # Static assets
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose setup
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run serve` - Alternative server command

## Docker Commands

```bash
# Build the image
docker build -t weather-app .

# Run the container
docker run -p 3000:3000 weather-app

# Using Docker Compose
docker-compose up --build
docker-compose down
```

## CI/CD with Jenkins

This project includes complete CI/CD setup for Jenkins with Docker containerization.

### Prerequisites

- Jenkins server with Docker installed
- Docker registry access (optional)
- Git repository access

### Jenkins Pipeline Setup

#### Option 1: Declarative Pipeline (Recommended)

1. Create a new Pipeline job in Jenkins
2. Configure SCM to point to your repository
3. Copy the `Jenkinsfile` content into the pipeline script
4. Configure the following environment variables:
   - `DOCKER_REGISTRY`: Your Docker registry URL
   - `DOCKER_USERNAME`: Registry username
   - `DOCKER_PASSWORD`: Registry password

#### Option 2: Freestyle Job

1. Create a new Freestyle job
2. Configure Git repository
3. Add build steps using the commands from `jenkins-commands.txt`
4. Set environment variables as needed

### Environment Variables

Configure these in your Jenkins job:

```bash
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password
APP_PORT=80  # Port to run the application on
```

### Pipeline Stages

1. **Checkout**: Pulls latest code from repository
2. **Build**: Creates Docker image with build number tag
3. **Test**: Runs health checks on test container
4. **Push**: Uploads image to Docker registry (optional)
5. **Deploy**: Updates production container with new image

### Manual Commands

For manual deployment or testing, use the `jenkins-cicd.sh` script:

```bash
# Make script executable
chmod +x jenkins-cicd.sh

# Run CI/CD pipeline
./jenkins-cicd.sh
```

### Monitoring

The pipeline includes:
- Health checks during testing and deployment
- Automatic cleanup of old containers and images
- Build numbering for version tracking
- Error handling and rollback capabilities

### Security Notes

- Store Docker registry credentials securely in Jenkins
- Use non-root containers (already configured)
- Regularly update base images for security patches
- Monitor container logs for issues

## CI/CD with Jenkins in Docker

Run your entire CI/CD pipeline in Docker containers for easy deployment and management.

### Quick Start

1. **Start Jenkins in Docker:**
   ```bash
   chmod +x setup-cicd.sh
   ./setup-cicd.sh start
   ```

2. **Access Jenkins:**
   - URL: http://localhost:8080
   - Username: `admin`
   - Password: `admin123`

3. **Create Pipeline Job:**
   - Job Name: `weather-app-cicd`
   - Type: Pipeline
   - Repository: Your Git repository URL
   - Script Path: `Jenkinsfile.docker`

### Docker CI/CD Commands

```bash
# Start Jenkins
./setup-cicd.sh start

# Check status
./setup-cicd.sh status

# View logs
./setup-cicd.sh logs

# Stop Jenkins
./setup-cicd.sh stop

# Cleanup (removes all data)
./setup-cicd.sh cleanup
```

### Files Overview

- **`jenkins-dockerfile`** - Jenkins Docker image with Docker capabilities
- **`docker-compose.jenkins.yml`** - Jenkins orchestration with Docker-in-Docker
- **`Jenkinsfile.docker`** - Pipeline for containerized CI/CD
- **`setup-cicd.sh`** - Management script for Jenkins environment

### Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Jenkins       │    │   Docker Host   │
│   Container     │◄──►│   (DinD)        │
│                 │    │                 │
│ • Build Stage   │    │ • Docker Images │
│ • Test Stage    │    │ • Containers    │
│ • Deploy Stage  │    │ • Registry      │
└─────────────────┘    └─────────────────┘
```

### Environment Variables

Configure these in your Jenkins job:

```bash
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password
```

### Pipeline Stages

1. **Checkout** - Pull latest code
2. **Build** - Create Docker image
3. **Test** - Run health checks
4. **Push** - Upload to registry (optional)
5. **Deploy** - Update production
6. **Verify** - Post-deployment checks

### Troubleshooting

**Jenkins not starting:**
```bash
./setup-cicd.sh logs
docker-compose -f docker-compose.jenkins.yml ps
```

**Permission issues:**
```bash
# Ensure Docker socket permissions
sudo chmod 666 /var/run/docker.sock
```

**Port conflicts:**
```bash
# Check what's using port 8080
lsof -i :8080
```

### Security Notes

- Change default admin password after first login
- Configure proper authentication for production
- Use secrets management for credentials
- Regularly update Jenkins and Docker images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

This project is licensed under the MIT License.
