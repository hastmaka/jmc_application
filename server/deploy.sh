#!/bin/bash

# adjust path if you installed rsync via brew
RSYNC=/opt/homebrew/bin/rsync

DIST=./dist
REMOTE=root@72.60.24.176
TARGET=/home/maka/jmc_app/server_jmc_app

# Sync without deleting node_modules or JSON files
$RSYNC -avz \
  --delete \
  --exclude='node_modules/' \
  --exclude='package.json' \
  --exclude='package-lock.json' \
  "$DIST/" "$REMOTE:$TARGET/"

# Reload caddy inside the container remotely
ssh -o StrictHostKeyChecking=no $REMOTE "docker restart jmc-server-app"

echo "✅ Deployment finished and server_jmc_app reloaded"