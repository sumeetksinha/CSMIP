#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "--- 1. Pulling latest code from GitHub ---"
# This assumes you've already set up the remote with the PAT token
git pull origin server

echo "--- 2. Building React Frontend ---"
# Navigate to your react app folder (update 'app' if your folder name is different)
cd app
npm install
npm run build
cd ..

echo "--- 3. Restarting Gunicorn Service ---"
sudo systemctl restart csmip

echo "--- 4. Checking Service Status ---"
sudo systemctl status csmip --no-pager

echo "Deployment Successful!"
