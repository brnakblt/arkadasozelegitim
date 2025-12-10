#!/bin/bash
set -e

# Function to load nvm
load_nvm() {
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
}

echo "Loading nvm..."
load_nvm

echo "Installing/u Using Node.js 22..."
nvm install 22
nvm use 22

echo "Node version in use: $(node -v)"
echo "npm version in use: $(npm -v)"

echo "------------------------------------------------"
echo "Installing Root Dependencies..."
npm install

echo "------------------------------------------------"
echo "Installing Strapi Dependencies..."
cd strapi
npm install
cd ..

echo "------------------------------------------------"
echo "Installing Web Dependencies..."
cd web
npm install
cd ..

echo "------------------------------------------------"
echo "Installing Mobile Dependencies..."
cd mobile
npm install
cd ..

echo "------------------------------------------------"
echo "All dependencies installed successfully!"
echo "IMPORTANT: To run the project, make sure to use Node 22 in your terminal:"
echo "    nvm use 22"
