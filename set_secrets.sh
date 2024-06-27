#!/bin/bash

# Ensure you are in the directory where the .env file is located
# or provide the correct path to the .env file
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found!"
  exit 1
fi

# Read each line in the .env file
while IFS= read -r line || [[ -n "$line" ]]; do
  # Skip empty lines and comments
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi

  # Extract key and value
  IFS='=' read -r key value <<< "$line"

  # Set the secret using the GitHub CLI
  gh secret set "$key" -b"$value"
done < "$ENV_FILE"
