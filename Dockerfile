# Use an official Node.js runtime as a parent image
FROM node:bullseye

# Install bash (if not included) and other required packages
RUN apt-get update && apt-get install -y bash

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Default command to start a bash shell
CMD ["bash"]