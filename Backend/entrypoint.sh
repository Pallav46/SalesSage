#!/bin/bash
# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 1
done

echo "Redis is up. Starting Celery..."
# Start Celery in the background
celery -A SalesSage worker --pool=threads --loglevel=info &

# Wait for Celery to be ready
sleep 10

echo "Starting Daphne..."
# Start Daphne
daphne -b 0.0.0.0 -p 8000 SalesSage.asgi:application
