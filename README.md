# Cloud Run Deployment Example

A production-ready Flask application demonstrating deployment to Google Cloud Run and local Docker environments. The application serves a simple JSON API that returns a greeting message and the container hostname.

## Project Structure

```
├── Dockerfile              # Container configuration for the application
├── docker-compose.yml     # Multi-container orchestration configuration
├── main.py               # Main Flask application code
├── requirements.txt      # Python dependencies
├── deploy-to-cloud-run.txt    # Instructions for Cloud Run deployment
└── deploy-to-local-docker.txt # Instructions for local Docker deployment
```

## Features

- Production-ready Flask application with Gunicorn WSGI server
- Docker containerization with optimized Python 3.11 slim image
- Google Cloud Run deployment support
- Local Docker development environment
- Docker Compose configuration for multi-container setup
- Health check endpoints
- Resource management and monitoring
- Scalable architecture

## Prerequisites

- Python 3.11 or later
- Docker Desktop
- Google Cloud SDK (for Cloud Run deployment)
- A Google Cloud Project (for Cloud Run deployment)

## Quick Start

### Local Python Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application (default port 8080)
python main.py

# Run on a different port (e.g., port 5000)
$env:PORT=5000; python main.py    # PowerShell
# OR
set PORT=5000 && python main.py   # Windows Command Prompt
# OR
PORT=5000 python main.py          # Linux/Mac

# Access the API at http://localhost:8080 (default)
# Or http://localhost:5000 (if using custom port)
```

### Local Docker Development

#### Using Docker Compose (Recommended)

```bash
# Development Environment (default)
docker-compose up -d --build

# Staging Environment
ENV=staging docker-compose up -d --build

# Production Environment
ENV=prod TAG=v1.0 docker-compose up -d --build

# Custom port (any environment)
HOST_PORT=5000 docker-compose up -d --build

# Access the API:
# http://localhost:8080 (default)
# http://localhost:5000 (when using HOST_PORT=5000)
```

#### Using Docker Directly

```bash
# Build with specific tag
docker build -t cloud-run-deploy:latest .

# Run with default port 8080
docker run -p 8080:8080 cloud-run-deploy:latest

# Run on a different host port
docker run -p 5000:8080 cloud-run-deploy:latest

# Run with environment variables
docker run -e PORT=3000 -p 3000:3000 cloud-run-deploy:latest

# Run in detached mode
docker run -d -p 5000:8080 cloud-run-deploy:latest
```

### Cloud Run Deployment

```bash
# Build and submit to Google Cloud
gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy

# Deploy to Cloud Run (default port 8080)
gcloud run deploy cloud-run-deploy-python-service \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

# Deploy with custom port (e.g., port 3000)
gcloud run deploy cloud-run-deploy-python-service \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 3000

# Deploy with environment variables and custom port
gcloud run deploy cloud-run-deploy-python-service \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 5000 \
    --set-env-vars "PORT=5000,PYTHONUNBUFFERED=1"

# List your Cloud Run services and get the URL
gcloud run services list

# Note: Cloud Run automatically handles port mapping to HTTPS (443)
# Your service will be available at: https://cloud-run-deploy-python-service-xxxxx.run.app
# regardless of the internal container port
```

## Detailed Documentation

- For Cloud Run deployment instructions, see [deploy-to-cloud-run.txt](deploy-to-cloud-run.txt)
- For local Docker deployment instructions, see [deploy-to-local-docker.txt](deploy-to-local-docker.txt)

## Docker Compose Features

The project includes a `docker-compose.yml` that supports:
- Multiple service orchestration
- Resource limits and monitoring
- Health checks
- Network isolation
- Persistent volumes
- Example configurations for:
  - Databases
  - Caching
  - Monitoring

## API Endpoints

- `GET /`: Returns a JSON response with:
  - Greeting message
  - Container hostname

## Environment Configuration

The project supports multiple environments through environment-specific configuration files:

### Environment Files
- `.env.dev`: Development environment settings
- `.env.staging`: Staging environment settings
- `.env.prod`: Production environment settings

### Environment Variables
Common variables across all environments:
- `HOST_PORT`: External port mapping (default: 8080)
- `ENV`: Environment name (dev/staging/prod)
- `TAG`: Docker image tag
- `PYTHONUNBUFFERED`: Ensures proper logging
- `DEBUG`: Enable/disable debug mode

### Usage with Docker Compose
```bash
# Development
docker-compose up -d --build

# Staging
ENV=staging docker-compose up -d --build

# Production
ENV=prod TAG=v1.0 docker-compose up -d --build

# Custom port
HOST_PORT=5000 docker-compose up -d --build
```

### Environment-Specific Deployments
- Development: Uses `.env.dev` with debug mode enabled
- Staging: Uses `.env.staging` for testing configurations
- Production: Uses `.env.prod` with optimized settings

## Development and Testing

- Local development supported through volume mounts
- Health checks configured for reliability
- Resource monitoring available through Docker Compose
- Scalable architecture ready for production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.