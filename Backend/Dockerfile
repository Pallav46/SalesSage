# backend/Dockerfile

# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Daphne for ASGI support
RUN pip install daphne

# Copy the entire backend code
COPY . .

# Expose the port the app runs on
EXPOSE 8000
#daphne SalesSage.asgi: application
# Start the Daphne server
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "SalesSage.asgi:application"]