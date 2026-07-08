from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_migrate)
def create_default_super_admin(sender, **kwargs):
    """
    Automatically creates the default Super Admin after migrations.
    If the user already exists, nothing happens.
    """

    email = "hr@rdi.com"

    if User.objects.filter(email=email).exists():
        return

    user = User.objects.create_superuser(
        username="Rupani Development Initiatives",
        email=email,
        password="@RDI123",
    )

    # Set your custom fields
    user.user_type = "super_admin"
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()

    print("✓ Default Super Admin created successfully.")