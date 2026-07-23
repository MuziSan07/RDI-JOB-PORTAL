# Deploying RDI Job Portal to production

This guide takes the app live on an Ubuntu 22.04 server (for example a Contabo
VPS) served at **https://hr.rdi.world**.

**Architecture:** nginx serves the built React app and reverse-proxies the API,
sitemap, robots, media and the per-job crawler route to Django, which runs under
gunicorn as a systemd service. Database is SQLite (a single file).

Config templates live in the `deploy/` folder of this repo. Replace
`hr.rdi.world` and `144.91.102.242` throughout if yours differ.

---

## 0. Point DNS at the server (do this first)

At whoever manages DNS for `rdi.world`, add an **A record**:

```
Type: A    Name: hr    Value: 144.91.102.242    TTL: default
```

Give it a few minutes, then confirm from your own machine:

```bash
nslookup hr.rdi.world
# should return 144.91.102.242
```

HTTPS in step 8 will not work until this resolves.

---

## 1. Connect to the server

```bash
ssh root@144.91.102.242
```

(Use whatever user Contabo gave you; the commands below assume root or a sudo user.)

---

## 2. Install system packages

```bash
apt update && apt upgrade -y
apt install -y python3-venv python3-pip git nginx

# Node.js 18 (for building the React app)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# certbot for free HTTPS
apt install -y certbot python3-certbot-nginx
```

---

## 3. Get the code

```bash
mkdir -p /var/www
git clone https://github.com/GBEETECHIVE/rdi-job-portal.git /var/www/rdi-job-portal
cd /var/www/rdi-job-portal
```

---

## 4. Set up the Django backend

```bash
cd /var/www/rdi-job-portal/backend

python3 -m venv /var/www/rdi-job-portal/venv
source /var/www/rdi-job-portal/venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create the environment file from the template, then edit it.
cp /var/www/rdi-job-portal/deploy/backend.env.example .env
nano .env          # set DJANGO_SECRET_KEY and DJANGO_SUPERADMIN_PASSWORD at minimum
```

Generate a secret key to paste into `.env`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Then apply migrations (this also seeds the super admin) and collect static files:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
deactivate
```

---

## 5. Build the React frontend

```bash
cd /var/www/rdi-job-portal/job-portal/frontend
npm ci
npm run build
```

This reads `.env.production` (already in the repo, `REACT_APP_API_URL=/api`) and
writes the production bundle to `build/`.

> Low-RAM tip: if `npm run build` is killed on a small VPS, add temporary swap:
> `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`

---

## 6. File ownership

gunicorn runs as `www-data` and must be able to write the SQLite database and the
uploads directory:

```bash
chown -R www-data:www-data /var/www/rdi-job-portal
```

---

## 7. Run Django under gunicorn (systemd)

```bash
cp /var/www/rdi-job-portal/deploy/rdi-jobportal.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now rdi-jobportal
systemctl status rdi-jobportal      # should say "active (running)"
```

Quick local check that Django is answering:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/api/jobs/public/   # expect 200
```

If it is not running, read the logs: `journalctl -u rdi-jobportal -n 50 --no-pager`

---

## 8. Configure nginx

```bash
cp /var/www/rdi-job-portal/deploy/nginx-hr.rdi.world.conf /etc/nginx/sites-available/hr.rdi.world
ln -sf /etc/nginx/sites-available/hr.rdi.world /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default      # drop the "Welcome to nginx" default
nginx -t                                    # test config
systemctl reload nginx
```

The site now answers over plain HTTP at `http://hr.rdi.world`.

---

## 9. Enable HTTPS

```bash
certbot --nginx -d hr.rdi.world
```

Choose the redirect option when asked, so all HTTP traffic is sent to HTTPS.
certbot edits the nginx file in place to add the SSL server block and sets up
automatic renewal. Verify renewal works:

```bash
certbot renew --dry-run
```

---

## 10. Open the firewall (if UFW is enabled)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 11. Verify it is live

From your own computer:

```bash
curl -I https://hr.rdi.world                         # 200, and served by nginx
curl -s https://hr.rdi.world/robots.txt | head       # crawl rules from Django
curl -s https://hr.rdi.world/sitemap.xml | head      # https://hr.rdi.world/... URLs
```

Then open **https://hr.rdi.world** in a browser and sign in at
**https://hr.rdi.world/admin/login** with the super admin credentials from `.env`.

---

## Updating the site later (redeploy)

After pushing new commits to GitHub:

```bash
cd /var/www/rdi-job-portal
git pull

# backend
source venv/bin/activate
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# frontend
cd ../job-portal/frontend
npm ci
npm run build

# restart backend, refresh ownership
chown -R www-data:www-data /var/www/rdi-job-portal
systemctl restart rdi-jobportal
```

nginx does not need reloading unless you changed its config.

---

## Optional: schedule email job alerts

If you configured real SMTP in `.env`, send the digest daily via cron:

```bash
crontab -e
# add this line (runs every day at 08:00):
0 8 * * * /var/www/rdi-job-portal/venv/bin/python /var/www/rdi-job-portal/backend/manage.py send_job_alerts >> /var/log/rdi-job-alerts.log 2>&1
```

---

## Troubleshooting

| Symptom | Where to look |
| --- | --- |
| 502 Bad Gateway | Django/gunicorn is down: `journalctl -u rdi-jobportal -n 50` |
| API calls fail in the browser | `DJANGO_ALLOWED_HOSTS` / `CORS_ALLOWED_ORIGINS` in `.env`, then `systemctl restart rdi-jobportal` |
| Uploaded images 404 | ownership of `backend/media` (`chown -R www-data:www-data ...`) and the `/media/` block in nginx |
| Static/admin login styling missing | `python manage.py collectstatic --noinput` was run, `/django-static/` block present |
| HTTPS won't issue | DNS A record not yet pointing at the server (step 0) |
| Changes not showing | rebuild the frontend and `systemctl restart rdi-jobportal` |
