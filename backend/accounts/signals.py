import os
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_migrate)
def create_default_super_admin(sender, **kwargs):
    """
    Auto-create the default Super Admin (user_type='super_admin') after migrations,
    so a fresh deploy has a working /admin/login out of the box. Idempotent — does
    nothing if the account already exists.

    Defaults to hr@rdi.com / @RDI123 (intentional pre-seed) but each value can be
    overridden in production via DJANGO_SUPERADMIN_EMAIL / _USERNAME / _PASSWORD.
    """
    # only run once, on the accounts app's post_migrate, to avoid repeated work
    if getattr(sender, 'label', None) not in (None, 'accounts'):
        return

    email = os.environ.get('DJANGO_SUPERADMIN_EMAIL', 'hr@rdi.com')
    username = os.environ.get('DJANGO_SUPERADMIN_USERNAME', 'Rupani Development Initiatives')
    password = os.environ.get('DJANGO_SUPERADMIN_PASSWORD', '@RDI123')

    if User.objects.filter(email=email).exists():
        print('[seed] Super Admin already exists (%s).' % email)
        return

    user = User.objects.create(
        username=username,
        email=email,
        user_type='super_admin',
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )
    user.set_password(password)
    user.save()
    print('[seed] Super Admin created: %s (log in at /admin/login).' % email)
