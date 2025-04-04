#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm install
# Uncomment this if you have a build step, e.g., if you're compiling TypeScript
# npm run build

# Store or pull Puppeteer cache from build cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
  echo "...Copying Puppeteer Cache from Build Cache" 
  cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
  echo "...Storing Puppeteer Cache in Build Cache" 
  cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi
