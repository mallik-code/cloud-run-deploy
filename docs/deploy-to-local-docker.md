# Deploy to Local Docker

## Prerequisites

### 1. Install Docker Desktop
- Download from: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Verify installation: `docker --version`
- Ensure Docker Desktop is running (check system tray icon)
- Check for port conflicts: Ensure port 8080 (default) is available, or use a different port

### 2. Environment Configuration
- Create `.env.dev` file for development settings
- Set `HOST_PORT` in `.env.dev` if port 8080 is unavailable
- Example `.env.dev`:
  ```env
  HOST_PORT=8085
  ENV=dev
  TAG=latest
  PYTHONUNBUFFERED=1
  DEBUG=true
  ```

### 3. Python Environment Setup (for local testing)
- Python 3.11 or later installed
- Required packages: flask, gunicorn (listed in `requirements.txt`)
- Source code is located in the `src/` directory

## Local Testing Steps (Before Docker)

### 1. Set up Python Virtual Environment
```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate # Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Application Locally

#### a) Default port (8080)
```bash
python src/main.py
```

#### b) Custom port (e.g., 8085)
```bash
$env:PORT=8085; python src/main.py    # PowerShell
# OR
set PORT=8085 && python src/main.py   # Windows Command Prompt
# OR
PORT=8085 python src/main.py          # Linux/Mac
```

### 4. Test the Application
- Access via browser: [http://localhost:8080](http://localhost:8080) (or your custom port)
- Expected response: JSON with greeting and hostname
- Test health endpoint: [http://localhost:8080/health](http://localhost:8080/health)
- Verify response format and data
- Check console logs for any errors

### 5. Troubleshooting Local Run
- If port is in use, try a different port
- Check Python version: `python --version`
- Verify all dependencies installed: `pip list`
- Check console for error messages
- Ensure you're in the project root directory

## Local Docker Deployment Steps

### 1. Build the Docker Image
- Open terminal in project root directory
- Build command: `docker build -t cloud-run-deploy .`
- This will:
  * Use Python 3.11 slim base image
  * Install dependencies from requirements.txt
  * Copy application code
  * Configure Gunicorn server

### 2. Verify the Build
- List images: `docker images`
- You should see 'cloud-run-deploy' in the list
- Check image details: `docker inspect cloud-run-deploy`

### 3. Run the Container

#### a) Default port (8080)
```bash
docker run -p 8080:8080 cloud-run-deploy
```

#### b) Custom host port (host:5000 -> container:8080)
```bash
docker run -p 5000:8080 cloud-run-deploy
```

#### c) Custom container port with environment variable
```bash
docker run -e PORT=3000 -p 3000:3000 cloud-run-deploy
```

#### d) With environment variables and default port
```bash
docker run -p 8080:8080 -e PYTHONUNBUFFERED=1 cloud-run-deploy
```

#### e) Run in detached mode with custom port
```bash
docker run -d -p 5000:8080 --name cloud-run-deploy cloud-run-deploy
```

#### f) Run with resource limits and custom port
```bash
docker run -p 5000:8080 --memory=512m --cpus=".5" cloud-run-deploy
```

Access URLs:
- [http://localhost:8080](http://localhost:8080) (when using default port)
- [http://localhost:5000](http://localhost:5000) (when mapped to port 5000)
- [http://localhost:3000](http://localhost:3000) (when using PORT=3000)

### 4. Test the Application
- Access via browser: [http://localhost:8080](http://localhost:8080)
- Expected response: JSON with greeting and hostname
- Check logs: `docker logs cloud-run-deploy`
- Interactive shell: `docker exec -it cloud-run-deploy /bin/bash`

## Container Management

### 1. View running containers
```bash
docker ps
```

### 2. Stop the container
```bash
docker stop cloud-run-deploy
```

### 3. Remove the container
```bash
docker rm cloud-run-deploy
```

### 4. Remove the image
```bash
docker rmi cloud-run-deploy
```

## Troubleshooting

### 1. Port conflicts
- Error: "port is already allocated"
- Solution: 
  * Check running containers: `docker ps`
  * Stop conflicting container or use different port:
    ```bash
    docker run -p 8081:8080 cloud-run-deploy
    ```

### 2. Build failures
- Clean Docker cache: `docker builder prune`
- Rebuild with no cache: `docker build --no-cache -t cloud-run-deploy .`

### 3. Container crashes
- Check logs: `docker logs cloud-run-deploy`
- Interactive debug: `docker run -it cloud-run-deploy /bin/bash`
- Check resource usage: `docker stats`

## Using Docker Compose (Recommended)

### 1. Overview
- `docker-compose.yml` is provided for orchestrating containers
- Environment-specific configurations (`.env.dev`, `.env.staging`, `.env.prod`)
- Supports multiple services (web, database, cache, monitoring)
- Defines resource limits and health checks

### 2. Environment-Based Deployment

#### a) Development Environment
```bash
docker-compose up -d --build

# Use the below one if the above given docker-compose up -d --build gives any port related issues
docker compose --env-file .env.dev up -d --build
```

#### b) Staging Environment
```bash
ENV=staging docker-compose up -d --build
```

#### c) Production Environment
```bash
ENV=prod TAG=v1.0 docker-compose up -d --build
```

#### d) Custom Port (any environment)
```bash
HOST_PORT=5000 ENV=staging docker-compose up -d --build
```

### 3. Basic Docker Compose Commands

#### View logs
```bash
docker-compose logs -f
# For specific service:
docker-compose logs -f web
```

#### Stop services
```bash
docker-compose down
# With volumes:
docker-compose down -v
```

#### Check status
```bash
docker-compose ps
```

### 4. Environment Files
- `.env.dev`: Development settings
- `.env.staging`: Staging settings
- `.env.prod`: Production settings

Each environment file contains:
- `HOST_PORT`: Container external port
- `ENV`: Environment name
- `TAG`: Docker image tag
- `DEBUG`: Debug mode setting
- Other environment-specific variables