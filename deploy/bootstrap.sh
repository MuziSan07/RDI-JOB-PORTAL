#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# RDI Job Portal — one-shot production bootstrap for Ubuntu 22.04.
#
# Run this ON THE SERVER as root (or with sudo). It is idempotent: safe to run
# again after a failure or to pick up config changes.
#
#   git clone https://github.com/GBEETECHIVE/rdi-job-portal.git /var/www/rdi-job-portal
#   cd /var/www/rdi-job-portal
#   bash deploy/bootstrap.sh
#
# It installs packages, sets up the Django backend (venv + migrate + static),
# builds the React frontend, and wires up gunicorn (systemd) + nginx.
# HTTPS is a separate, interactive step printed at the end (needs DNS ready).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Settings (override by exporting before running, e.g. DOMAIN=foo bash ...) ──
APP_DIR="${APP_DIR:-/var/www/rdi-job-portal}"
DOMAIN="${DOMAIN:-hr.rdi.world}"
REPO_URL="${REPO_URL:-https://github.com/GBEETECHIVE/rdi-job-portal.git}"
RUN_USER="www-data"

log()  { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
warn() { printf '\n\033[1;33m!! %s\033[0m\n' "$*"; }
die()  { printf '\n\033[1;31mXX %s\033[0m\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Please run as root (or with sudo)."

# ── 1. System packages ────────────────────────────────────────────────────────
log "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3-venv python3-pip git nginx curl
if ! command -v node >/dev/null 2>&1; then
    log "Installing Node.js 18"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
command -v certbot >/dev/null 2>&1 || apt-get install -y certbot python3-certbot-nginx

# ── 2. Code ───────────────────────────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
    log "Updating existing checkout in $APP_DIR"
    git -C "$APP_DIR" pull --ff-only
else
    log "Cloning repository into $APP_DIR"
    mkdir -p "$(dirname "$APP_DIR")"
    git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

# ── 3. Backend environment file ───────────────────────────────────────────────
ENV_FILE="$APP_DIR/backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    log "Creating backend/.env from template"
    cp "$APP_DIR/deploy/backend.env.example" "$ENV_FILE"
fi

# Auto-generate a real secret key if the placeholder is still there.
if grep -q "CHANGE_ME_to_a_long_random_string" "$ENV_FILE"; then
    log "Generating DJANGO_SECRET_KEY"
    SECRET="$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')"
    # token_urlsafe emits only [A-Za-z0-9_-], so a | delimiter is always safe here.
    sed -i "s|CHANGE_ME_to_a_long_random_string|${SECRET}|" "$ENV_FILE"
fi

# Refuse to continue with a placeholder admin password — that would be a hole.
if grep -q "CHANGE_ME_strong_password" "$ENV_FILE"; then
    die "Set a real DJANGO_SUPERADMIN_PASSWORD in $ENV_FILE (edit with 'nano $ENV_FILE'), then re-run."
fi

# ── 4. Python backend ─────────────────────────────────────────────────────────
log "Setting up the Python virtual environment"
python3 -m venv "$APP_DIR/venv"
# shellcheck disable=SC1091
source "$APP_DIR/venv/bin/activate"
pip install --upgrade pip
pip install -r "$APP_DIR/backend/requirements.txt"

log "Running migrations and collecting static files"
set -a; . "$ENV_FILE"; set +a          # load env for these management commands
python "$APP_DIR/backend/manage.py" migrate --noinput
python "$APP_DIR/backend/manage.py" collectstatic --noinput
deactivate

# ── 5. Frontend build ─────────────────────────────────────────────────────────
log "Building the React frontend (this can take a few minutes)"
cd "$APP_DIR/job-portal/frontend"
npm ci
npm run build
cd "$APP_DIR"

# ── 6. Ownership (gunicorn/nginx run as www-data) ─────────────────────────────
log "Setting ownership to $RUN_USER"
chown -R "$RUN_USER:$RUN_USER" "$APP_DIR"

# ── 7. systemd service ────────────────────────────────────────────────────────
log "Installing the gunicorn systemd service"
cp "$APP_DIR/deploy/rdi-jobportal.service" /etc/systemd/system/rdi-jobportal.service
systemctl daemon-reload
systemctl enable rdi-jobportal
systemctl restart rdi-jobportal
sleep 2
systemctl is-active --quiet rdi-jobportal \
    || die "gunicorn service failed to start. Check: journalctl -u rdi-jobportal -n 50 --no-pager"

# ── 8. nginx ──────────────────────────────────────────────────────────────────
log "Configuring nginx"
cp "$APP_DIR/deploy/nginx-hr.rdi.world.conf" /etc/nginx/sites-available/rdi-jobportal
# Apply the chosen domain if it differs from the template default.
sed -i "s/hr\.rdi\.world/${DOMAIN}/g" /etc/nginx/sites-available/rdi-jobportal
ln -sf /etc/nginx/sites-available/rdi-jobportal /etc/nginx/sites-enabled/rdi-jobportal
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ── 9. Local health check ─────────────────────────────────────────────────────
log "Health check"
code="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/api/jobs/public/ || true)"
[ "$code" = "200" ] && echo "  backend  OK (200)" || warn "backend returned '$code' — check the service logs"

cat <<DONE

──────────────────────────────────────────────────────────────────────────────
 Deployment complete. The site is live over HTTP at:  http://${DOMAIN}

 Final step — enable HTTPS (needs the DNS A record ${DOMAIN} -> this server):

     certbot --nginx -d ${DOMAIN}

 Then verify:
     curl -I https://${DOMAIN}

 To redeploy after new commits:  bash deploy/update.sh
──────────────────────────────────────────────────────────────────────────────
DONE
