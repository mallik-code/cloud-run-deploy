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

# Expose the port
EXPOSE 8085

# Set environment variable for Python logging
ENV PYTHONUNBUFFERED=1

# Run using Gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:8085", "--log-level", "info", "main:app"]