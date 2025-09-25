# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Set environment variable for Python logging
ENV PYTHONUNBUFFERED=1

# Run using Gunicorn (note the port is now 8080)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--log-level", "info", "main:app"]