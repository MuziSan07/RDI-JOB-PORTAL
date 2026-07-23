#!/bin/sh
# Container startup: prepare the database + static files, then run gunicorn.
set -e

# Make sure the SQLite directory exists (it is a mounted volume in production).
if [ -n "$SQLITE_PATH" ]; then
    mkdir -p "$(dirname "$SQLITE_PATH")"
fi

echo "==> Applying migrations (also seeds the super admin)"
python manage.py migrate --noinput

echo "==> Collecting static files"
python manage.py collectstatic --noinput

echo "==> Starting gunicorn on :8000"
exec gunicorn job_portal.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 60 \
    --access-logfile - \
    --error-logfile -
