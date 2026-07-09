import os
from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Create the default Super Admin (user_type='super_admin') used to log in at /admin/login."

    def handle(self, *args, **options):
        email = os.environ.get('DJANGO_SUPERADMIN_EMAIL', 'hr@rdi.com')
        password = os.environ.get('DJANGO_SUPERADMIN_PASSWORD', '@RDI123')
        username = os.environ.get('DJANGO_SUPERADMIN_USERNAME', 'Rupani Development Initiatives')

        # Already seeded? Report and stop.
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(
                'Super Admin with email "%s" already exists. Nothing to do.' % email
            ))
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

        self.stdout.write(self.style.SUCCESS(
            'Super Admin created: %s  (log in at /admin/login)' % email
        ))
