#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# RDI Job Portal — redeploy after pushing new commits. Run ON THE SERVER as root.
#
#   cd /var/www/rdi-job-portal && bash deploy/update.sh
#
# Pulls the latest code, updates backend deps + migrations + static, rebuilds the
# frontend, fixes ownership, and restarts gunicorn.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/rdi-job-portal}"
RUN_USER="www-data"

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
[ "$(id -u)" -eq 0 ] || { echo "Please run as root (or with sudo)."; exit 1; }

cd "$APP_DIR"

log "Pulling latest code"
git pull --ff-only

log "Updating backend"
# shellcheck disable=SC1091
source "$APP_DIR/venv/bin/activate"
pip install -r "$APP_DIR/backend/requirements.txt"
set -a; . "$APP_DIR/backend/.env"; set +a
python "$APP_DIR/backend/manage.py" migrate --noinput
python "$APP_DIR/backend/manage.py" collectstatic --noinput
deactivate

log "Rebuilding frontend"
cd "$APP_DIR/job-portal/frontend"
npm ci
npm run build
cd "$APP_DIR"

log "Fixing ownership and restarting"
chown -R "$RUN_USER:$RUN_USER" "$APP_DIR"
systemctl restart rdi-jobportal

log "Done. Backend status:"
systemctl is-active rdi-jobportal
