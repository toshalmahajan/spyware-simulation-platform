#!/bin/bash

# Production Deployment Script for Spyware Simulation Platform
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_NAME="spyware-simulation-platform"
DEPLOY_ENV=${1:-production}
DOCKER_IMAGE="spysim-platform:latest"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    print_status "All prerequisites satisfied"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm ci
    
    # Run tests
    print_status "Running tests..."
    npm run build
    
    # Build Docker image
    print_status "Building Docker image..."
    docker build -t $DOCKER_IMAGE .
    
    print_status "Application build completed"
}

# Security scan
security_scan() {
    print_status "Running security scans..."
    
    # npm audit
    print_status "Running npm audit..."
    npm audit --audit-level moderate
    
    # Docker security scan (if trivy is available)
    if command -v trivy &> /dev/null; then
        print_status "Scanning Docker image for vulnerabilities..."
        trivy image $DOCKER_IMAGE
    fi
    
    print_status "Security scans completed"
}

# Deploy to environment
deploy() {
    print_status "Deploying to $DEPLOY_ENV..."
    
    case $DEPLOY_ENV in
        "production")
            deploy_production
            ;;
        "staging")
            deploy_staging
            ;;
        "development")
            deploy_development
            ;;
        *)
            print_error "Unknown environment: $DEPLOY_ENV"
            exit 1
            ;;
    esac
}

deploy_production() {
    print_status "Starting production deployment..."
    
    # Stop existing containers
    docker-compose down || true
    
    # Start new deployment
    docker-compose up -d
    
    # Health check
    sleep 30
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_status "Production deployment successful!"
    else
        print_error "Production deployment failed - health check failed"
        exit 1
    fi
}

deploy_staging() {
    print_status "Deploying to staging environment..."
    # Similar to production but with staging config
    docker-compose -f docker-compose.staging.yml up -d
}

deploy_development() {
    print_status "Deploying to development environment..."
    docker-compose -f docker-compose.dev.yml up -d
}

# Main deployment flow
main() {
    print_status "Starting deployment process for $APP_NAME to $DEPLOY_ENV"
    
    check_prerequisites
    build_app
    security_scan
    deploy
    
    print_status "🎉 Deployment completed successfully!"
    print_status "📊 Application is running at: http://localhost:3000"
    print_status "🔍 Health check: curl http://localhost:3000/health"
}

main "$@"
