# Cloud Run Deployment Example

A production-ready Flask application demonstrating deployment to Google Cloud Run and local Docker environments. The application serves a simple JSON API that returns a greeting message and the container hostname.

## Project Structure

```
├── src/                   # Source code directory
│   └── main.py           # Main Flask application code
├── docs/                  # Documentation directory
│   ├── deploy-to-cloud-run.txt    # Instructions for Cloud Run deployment
│   ├── deploy-to-local-docker.txt # Instructions for local Docker deployment
│   └── depl-help.txt            # Deployment help documentation
├── scripts/              # Utility scripts directory
├── Dockerfile            # Container configuration for the application
├── docker-compose.yml    # Multi-container orchestration configuration
└── requirements.txt      # Python dependencies
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
python src/main.py

# Run on a different port (e.g., port 5000)
$env:PORT=5000; python src/main.py    # PowerShell
# OR
set PORT=5000 && python src/main.py   # Windows Command Prompt
# OR
PORT=5000 python src/main.py          # Linux/Mac

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
# Development (uses port from .env.dev)
docker-compose up -d --build

#Use the below one if the above given docker-compose up -d --build gives any port related issues
# Development (uses port from .env.dev)
docker compose --env-file .env.dev up -d --build

# Override port temporarily
HOST_PORT=5000 docker-compose up -d --build

# Force recreation of containers (when changing ports)
docker-compose up -d --build --force-recreate

# To stop the services
docker-compose down

# Clean up completely (including volumes)
docker-compose down -v
```

Note: The application will use the PORT specified in your environment file (.env.dev, .env.staging, or .env.prod). 
If port 8080 is already in use by another service (like Airflow), you can:
1. Set HOST_PORT in your .env file (e.g., HOST_PORT=8085)
2. Use the --force-recreate flag when starting to ensure the new port is applied

### Environment-Specific Deployments
- Development: Uses `.env.dev` with debug mode enabled
- Staging: Uses `.env.staging` for testing configurations
- Production: Uses `.env.prod` with optimized settings

### Common Issues and Solutions

#### Port Conflicts
If you encounter an error like:
```
Error response from daemon: driver failed programming external connectivity on endpoint cloud-run-deploy-dev: Bind for 0.0.0.0:8080 failed: port is already allocated
```

This means port 8080 is already in use (common with services like Airflow). To resolve this:

1. Create or modify your environment file (e.g., `.env.dev`):
   ```bash
   HOST_PORT=8085  # Or any other available port
   ```

2. Start Docker Compose with the environment file:
   ```bash
   docker compose --env-file .env.dev up -d --build
   ```

3. Access your application on the new port (e.g., http://localhost:8085)

You can verify the port mapping using:
```bash
docker ps
```

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