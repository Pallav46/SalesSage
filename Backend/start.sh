#!/bin/sh

# Start Redis
redis-server --daemonize yes

# Wait for Redis to start
sleep 5

# Start Celery worker
celery -A SalesSage worker --loglevel=info &

# Start Daphne
daphne -b 0.0.0.0 -p 8000 SalesSage.asgi:application