# Deploy to GCP Cloud Run

## Prerequisites

### 1. Install and Set Up Tools
- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Python 3.11 or later

### 2. Configure Google Cloud

#### a) Check and Set Configuration
```bash
# List all configurations
gcloud config configurations list

# Create a new configuration (if needed)
gcloud config configurations create cloud-run-config

# Activate a configuration
gcloud config configurations activate cloud-run-config
```

#### b) Authentication and Project Setup
```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Check current project
gcloud config get-value project

# 3. Set your project
gcloud config set project YOUR_PROJECT_ID

# 4. Update Application Default Credentials (ADC)
gcloud auth application-default login

# 5. Set the quota project for ADC
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

> **Important**: Make sure to update the Application Default Credentials (ADC) and set the quota project to avoid quota-related issues.

#### c) Enable Required APIs
```bash
# Enable required APIs
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com
```

> **Note**: If you see "[emulator]" in your active configuration, make sure to switch to a real configuration for deploying to Cloud Run.

### 3. Create an Artifact Registry repository (one-time setup)
```bash
gcloud artifacts repositories create cloud-run-deploy \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Cloud Run deployments"
```

## Deployment Steps

### 1. Make code changes and test locally
- Install dependencies: `pip install -r requirements.txt`
- Run locally: `python src/main.py`
- Test at: [http://localhost:8080](http://localhost:8080)
- The app should return a JSON response with a greeting and hostname

### 2. Build the Docker image locally
- Command: `docker build -t cloud-run-deploy .`
- Test the container:
  ```bash
  docker run -p 8080:8080 cloud-run-deploy
  # Test at: http://localhost:8080
  # Stop with: Ctrl+C
  ```

### 3. Submit Docker image to Artifact Registry

First, authenticate with Artifact Registry:
```bash
# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker us-central1-docker.pkg.dev

# Verify authentication
gcloud auth print-access-token
```

Then set up your environment (PowerShell):
```powershell
# Set Project ID
$env:PROJECT_ID = $(gcloud config get-value project)

# Set version tag
$env:VERSION = "v1.0"  # Change this for different versions

# Build the image with version tag
docker build -t cloud-run-deploy:$env:VERSION .

# Tag for Artifact Registry
docker tag cloud-run-deploy:$env:VERSION us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy:$env:VERSION

# Push the image with version tag
docker push us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy:$env:VERSION
```

For Bash/Linux/Mac:
```bash
# Set Project ID and version
export PROJECT_ID=$(gcloud config get-value project)
export VERSION="v1.0"

# Build and tag
docker build -t cloud-run-deploy:$VERSION .
docker tag cloud-run-deploy:$VERSION us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:$VERSION
docker push us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:$VERSION
```

To verify your tagged images:
```bash
# List all versions of your image
gcloud artifacts docker images list us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy --include-tags
```

> **Important**: Always include version tags (e.g., `:v1.0`, `:v1.1`) when pushing images. Using just the repository name without a tag defaults to `:latest` and makes version tracking difficult.

> **Important**: Make sure to replace `YOUR_PROJECT_ID` with your actual Google Cloud Project ID. For example, if your project ID is `my-project-123`, the command would be:
> ```bash
> gcloud builds submit --tag us-central1-docker.pkg.dev/my-project-123/cloud-run-deploy/cloud-run-deploy
> ```

### 4. Deploy to Cloud Run

#### a) Build for deployment

First, check existing Docker images:
```bash
docker images
```

Then build the images:

PowerShell:
```powershell
# Production build
$env:ENV="prod"; $env:TAG="v1.0"; docker-compose build

# Staging build
$env:ENV="staging"; $env:TAG="staging"; docker-compose build
```

Bash/Linux/Mac:
```bash
# Production build
ENV=prod TAG=v1.0 docker-compose build

# Staging build
ENV=staging TAG=staging docker-compose build
```

Verify the builds:
```bash
docker images | findstr cloud-run-deploy
```

#### b) Tag for Cloud Run

> **Important**: Make sure the source image exists before tagging. You should see it in `docker images` output.

About Version Tags:
- Version tags (like `v1.0`) help track different versions of your container images
- You can view your tagged images in Google Cloud Console:
  1. Navigate to [Artifact Registry](https://console.cloud.google.com/artifacts)
  2. Select your repository `cloud-run-deploy`
  3. Look for images tagged as `cloud-run-deploy:v1.0`
  
You can also list tags using gcloud command:
```bash
# List all tags in your repository
gcloud artifacts docker images list us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy

# List specific image details
gcloud artifacts docker images describe us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy:v1.0
```

Version Tag Best Practices:
- Use semantic versioning (e.g., v1.0.0, v1.0.1)
- Include build environment (e.g., v1.0-prod, v1.0-staging)
- Keep tags consistent across environments

First, set your project ID as an environment variable:

PowerShell:
```powershell
# Set project ID as environment variable
$env:PROJECT_ID = "YOUR_PROJECT_ID"
# OR get it automatically from gcloud
$env:PROJECT_ID = $(gcloud config get-value project)

# Tag the images
docker tag cloud-run-deploy:v1.0 us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy:v1.0
docker tag cloud-run-deploy:staging us-central1-docker.pkg.dev/$env:PROJECT_ID/cloud-run-deploy/cloud-run-deploy:staging
```

Bash/Linux/Mac:
```bash
# Set project ID as environment variable
export PROJECT_ID="YOUR_PROJECT_ID"
# OR get it automatically from gcloud
export PROJECT_ID=$(gcloud config get-value project)

# Tag the images
docker tag cloud-run-deploy:v1.0 us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:v1.0
docker tag cloud-run-deploy:staging us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:staging
```

> **Note**: Replace `YOUR_PROJECT_ID` with your actual project ID if setting it manually. For example: `bamboo-parsec-471611-a4`

#### c) Submit to Cloud Run
```bash
# Production version
gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:v1.0

# Staging version
gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:staging
```

#### d) Deploy to Cloud Run
```bash
# Production deployment
gcloud run deploy cloud-run-deploy-prod-service \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:v1.0 \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars-file .env.prod

# Staging deployment
gcloud run deploy cloud-run-deploy-staging-service \
    --image us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-deploy/cloud-run-deploy:staging \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars-file .env.staging
```

#### Parameters explained
- `cloud-run-deploy-python-service`: Name of your Cloud Run service
- `--platform managed`: Uses fully managed Cloud Run service
- `--region us-central1`: Deploys in the US Central region
- `--allow-unauthenticated`: Makes the service publicly accessible
- `--port`: Sets the container's internal port (default: 8080)
- `--set-env-vars`: Sets environment variables for the container

> Note: Cloud Run automatically handles external HTTPS (port 443) regardless of internal port

### 5. After Deployment

#### Get Service URL
```bash
# Get just the URL
gcloud run services describe cloud-run-deploy-prod-service \
    --platform managed \
    --region us-central1 \
    --format='value(status.url)'

# Or get full service details including URL
gcloud run services describe cloud-run-deploy-prod-service \
    --platform managed \
    --region us-central1
```

#### Verify Deployment
- Test your deployed service by visiting the URL
- Test the health endpoint: `[SERVICE_URL]/health`
- Check logs in Google Cloud Console under Cloud Run
- Monitor metrics and performance in Cloud Run dashboard

#### Managing Revisions
Each deployment creates a new revision while maintaining the same service URL. To manage revisions:

PowerShell Commands:
```powershell
# List all revisions
gcloud run revisions list `
    --platform managed `
    --region us-central1 `
    --service cloud-run-deploy-prod-service

# View traffic allocation
gcloud run services describe cloud-run-deploy-prod-service `
    --platform managed `
    --region us-central1 `
    --format="yaml(status.traffic)"

# Split traffic between revisions (for A/B testing or gradual rollout)
gcloud run services update-traffic cloud-run-deploy-prod-service `
    --platform managed `
    --region us-central1 `
    --to-revisions "REVISION1=50,REVISION2=50"

# Example of actual revision names:
gcloud run services update-traffic cloud-run-deploy-prod-service `
    --platform managed `
    --region us-central1 `
    --to-revisions "cloud-run-deploy-prod-service-00001-5tj=50,cloud-run-deploy-prod-service-00002-tbp=50"

# Rollback to a specific revision (route all traffic)
gcloud run services update-traffic cloud-run-deploy-prod-service `
    --platform managed `
    --region us-central1 `
    --to-revision "REVISION_NAME"
```

Bash/Linux Commands:
```bash
# List all revisions
gcloud run revisions list \
    --platform managed \
    --region us-central1 \
    --service cloud-run-deploy-prod-service

# View traffic allocation
gcloud run services describe cloud-run-deploy-prod-service \
    --platform managed \
    --region us-central1 \
    --format='yaml(status.traffic)'

# Split traffic between revisions
gcloud run services update-traffic cloud-run-deploy-prod-service \
    --platform managed \
    --region us-central1 \
    --to-revisions REVISION1=50,REVISION2=50
```

Important Notes:
- Use backticks (\`) for line continuation in PowerShell
- Use quotes around revision specifications in PowerShell
- Revision names follow the pattern: `service-name-00001-xxx`
- Traffic percentages must add up to 100
- You can verify traffic split using the describe command

By default:
- The service URL remains constant
- New deployments create new revisions
- 100% traffic goes to the latest revision
- Old revisions are preserved for rollback

#### Troubleshooting
- If the service isn't responding, check logs in Cloud Console
- Verify environment variables: `gcloud run services describe cloud-run-deploy-prod-service --platform managed --region us-central1 --format='value(spec.template.spec.containers[0].env[])'`
- Check service status: `gcloud run services describe cloud-run-deploy-prod-service --platform managed --region us-central1 --format='value(status.conditions)'`

## Notes
- The application uses Flask and Gunicorn for production deployment
- The container runs on port 8080 as required by Cloud Run
- Environment variables:
  * `PORT`: Set automatically by Cloud Run
  * `PYTHONUNBUFFERED=1`: Ensures proper logging
- The service is stateless and scalable
- Authentication can be added by removing `--allow-unauthenticated` flag