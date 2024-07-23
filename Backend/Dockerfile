FROM python:3.10

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libhdf5-dev \
    pkg-config \
    redis-server

COPY requirements.txt .

RUN pip install numpy
RUN pip install h5py --no-binary=h5py
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install daphne celery redis

COPY . .

EXPOSE 8000

COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]