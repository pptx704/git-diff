#!/bin/bash

# Pull the repository from the specified URL
git pull origin master
# Stop Docker containers (if running)
docker stop $(docker ps -q)

# Delete Docker containers (if any)
docker rm $(docker ps -a -q)

# Build Docker image (assuming you have a Dockerfile in the repository)
docker build -t git-diff .

# Run Docker container from the built image
docker run -p 3000:3000 -d --rm --name git-diff git-diff
