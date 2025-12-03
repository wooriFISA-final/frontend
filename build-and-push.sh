#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="woorifisa-frontend"
VERSION=${1:-latest}

# Check if DOCKER_USERNAME is set
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}Error: DOCKER_USERNAME environment variable is not set${NC}"
    echo "Usage: export DOCKER_USERNAME=your-dockerhub-username"
    echo "       ./build-and-push.sh [version]"
    exit 1
fi

FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo -e "${YELLOW}Building Docker image: ${FULL_IMAGE_NAME}${NC}"

# Build the Docker image
docker build -t ${FULL_IMAGE_NAME} .

# Also tag as latest if version is not latest
if [ "$VERSION" != "latest" ]; then
    docker tag ${FULL_IMAGE_NAME} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    echo -e "${GREEN}Tagged as latest${NC}"
fi

echo -e "${GREEN}Build successful!${NC}"

# Ask for confirmation before pushing
read -p "Do you want to push to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Logging in to Docker Hub...${NC}"
    docker login
    
    echo -e "${YELLOW}Pushing ${FULL_IMAGE_NAME}...${NC}"
    docker push ${FULL_IMAGE_NAME}
    
    if [ "$VERSION" != "latest" ]; then
        echo -e "${YELLOW}Pushing ${DOCKER_USERNAME}/${IMAGE_NAME}:latest...${NC}"
        docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
    fi
    
    echo -e "${GREEN}Push successful!${NC}"
    echo -e "${GREEN}Image available at: ${FULL_IMAGE_NAME}${NC}"
else
    echo -e "${YELLOW}Push cancelled${NC}"
fi
