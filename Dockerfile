FROM ubuntu:latest
LABEL authors="emmadenagbe"
# Use the official Node.js image as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 4500

# Define the command to run the application
CMD ["node", "dist/main"]

