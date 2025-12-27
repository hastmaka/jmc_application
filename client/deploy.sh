#!/bin/bash

RSYNC=/opt/homebrew/bin/rsync

DIST=./dist
REMOTE=root@72.60.24.176
TARGET=/home/maka/jmc_app/web_app

BACKUP_DIR=/home/maka/jmc_app/web_app_backup
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE=jmc-web-app-$TIMESTAMP.tar.gz

# Create backup of the current web directory on the server
ssh -o StrictHostKeyChecking=no $REMOTE \
"mkdir -p $BACKUP_DIR && \
if [ -d $TARGET ]; then \
  tar -czf $BACKUP_DIR/$BACKUP_FILE -C \$(dirname $TARGET) \$(basename $TARGET); \
fi && \
ls -1t $BACKUP_DIR/jmc-web-app-* 2>/dev/null | tail -n +11 | xargs -r rm --"

# Sync dist → server (with correct permissions)
$RSYNC -avz --delete \
  --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  $DIST/ $REMOTE:$TARGET/

# Reload caddy inside Docker
ssh -o StrictHostKeyChecking=no $REMOTE \
"docker exec service-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile"

echo "✅ Deployment finished and caddy reloaded inside service-caddy"