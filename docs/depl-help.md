# Project Deployment Help Guide

## Project Structure Overview

The project follows a standard Python project structure:
- `src/`: Contains all source code (`main.py`)
- `docs/`: Contains all documentation files
- `scripts/`: For utility scripts and tools
- Root directory: Contains configuration files (`Dockerfile`, `docker-compose.yml`, `requirements.txt`)

## Setup Steps

### 1. Repository Setup
Create a repository in GitHub with the name cloud-run-deploy:
- Add README.md
- Enable Python .gitignore template

### 2. Clone Repository
```bash
git clone https://github.com/mallik-code/cloud-run-deploy.git
```

### 3. Python Version Configuration
Create `.python-version` file in root directory:
```bash
echo "3.12" > .python-version
```

### 4. Virtual Environment Setup
Create Python virtual environment:
```bash
python -m venv .venv
```

### 5. Activate Virtual Environment
```bash
.\.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Linux/Mac
```

### 6. Install Dependencies
```bash
pip install -r requirements.txt
```

### 7. Run the Application
```bash
python src/main.py
```

## Virtual Environment Management

### Deactivate Environment
```bash
deactivate
```

### Delete Virtual Environment
```bash
rm -r .venv/
```