# Use a base image, e.g., Python or Node.js depending on your setup
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy all files from the local directory to the working directory in the container
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Ensure start.sh is executable
RUN chmod +x start.sh

# Specify the command to run your script
CMD ["start.sh"]
