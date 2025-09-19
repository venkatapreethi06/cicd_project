#!/bin/bash

# Weather App CI/CD Docker Setup Script
# This script sets up Jenkins in Docker for CI/CD

set -e

echo "🚀 Setting up Weather App CI/CD in Docker"
echo "=========================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to check if port 8080 is available
check_port() {
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port 8080 is already in use. Jenkins may not start properly."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to create necessary directories
setup_directories() {
    echo "📁 Creating necessary directories..."
    mkdir -p jenkins_home
    mkdir -p workspace
}

# Function to start Jenkins
start_jenkins() {
    echo "🐳 Starting Jenkins in Docker..."
    docker-compose -f docker-compose.jenkins.yml up -d

    echo "⏳ Waiting for Jenkins to start..."
    sleep 30

    # Check if Jenkins is running
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Jenkins is running!"
        echo "🌐 Access Jenkins at: http://localhost:8080"
        echo "👤 Default credentials:"
        echo "   Username: admin"
        echo "   Password: admin123"
    else
        echo "❌ Jenkins failed to start. Check logs:"
        echo "   docker-compose -f docker-compose.jenkins.yml logs"
        exit 1
    fi
}

# Function to setup initial job
setup_job() {
    echo "🔧 Setting up initial Jenkins job..."

    # Wait a bit more for Jenkins to be fully ready
    sleep 10

    # Create job using Jenkins CLI or REST API
    echo "📝 You can now create a new Pipeline job in Jenkins with:"
    echo "   - Job name: weather-app-cicd"
    echo "   - Pipeline script from SCM"
    echo "   - Repository URL: $(pwd)"
    echo "   - Script Path: Jenkinsfile.docker"
}

# Function to show usage
show_usage() {
    echo "Weather App CI/CD Docker Setup"
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start Jenkins in Docker (default)"
    echo "  stop      - Stop Jenkins"
    echo "  restart   - Restart Jenkins"
    echo "  logs      - Show Jenkins logs"
    echo "  cleanup   - Remove Jenkins containers and volumes"
    echo "  status    - Show Jenkins status"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs"
    echo "  $0 stop"
}

# Main logic
case "${1:-start}" in
    start)
        check_docker
        check_port
        setup_directories
        start_jenkins
        setup_job
        ;;
    stop)
        echo "🛑 Stopping Jenkins..."
        docker-compose -f docker-compose.jenkins.yml down
        ;;
    restart)
        echo "🔄 Restarting Jenkins..."
        docker-compose -f docker-compose.jenkins.yml restart
        ;;
    logs)
        echo "📋 Showing Jenkins logs..."
        docker-compose -f docker-compose.jenkins.yml logs -f
        ;;
    cleanup)
        echo "🧹 Cleaning up Jenkins..."
        docker-compose -f docker-compose.jenkins.yml down -v
        rm -rf jenkins_home
        ;;
    status)
        echo "📊 Jenkins Status:"
        if docker-compose -f docker-compose.jenkins.yml ps | grep -q "Up"; then
            echo "✅ Jenkins is running"
            echo "🌐 Access at: http://localhost:8080"
        else
            echo "❌ Jenkins is not running"
        fi
        ;;
    *)
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎯 CI/CD Setup Complete!"
echo "Next steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Login with admin/admin123"
echo "3. Create a new Pipeline job"
echo "4. Configure it to use Jenkinsfile.docker from this repository"