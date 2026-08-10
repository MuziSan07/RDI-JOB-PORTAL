import secrets

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('super_admin', 'Super Admin'),
        ('department', 'Department'),
        ('job_seeker', 'Job Seeker'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    father_name = models.CharField(max_length=200, null=True, blank=True)
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    country = models.CharField(max_length=2, null=True, blank=True)  # ISO 3166-1 alpha-2 code
    cnic = models.CharField(max_length=32, null=True, blank=True, unique=True)  # national ID (format varies by country)
    current_job = models.CharField(max_length=200, null=True, blank=True)
    experience = models.TextField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} - {self.user_type}"

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200)
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    father_name = models.CharField(max_length=200)
    contact_number = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField()
    country = models.CharField(max_length=2, null=True, blank=True)  # ISO 3166-1 alpha-2 code
    cnic = models.CharField(max_length=32)  # national ID (format varies by country)
    current_job = models.CharField(max_length=200, null=True, blank=True)
    experience = models.TextField()
    education = models.TextField()
    # Optional uploaded resume document (PDF/DOC) attached alongside the structured resume
    resume_file = models.FileField(upload_to='resumes/', null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    class Meta:
        ordering = ['-created_at']

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    details = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username if self.user else 'Unknown'} - {self.action} - {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']


class Notification(models.Model):
    """In-app notification delivered to any user (job seeker, department, super admin)."""
    CATEGORY_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('application', 'Application'),
        ('test', 'Test'),
        ('interview', 'Interview'),
        ('system', 'System'),
    ]
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, default='')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='info')
    link = models.CharField(max_length=255, null=True, blank=True)  # optional frontend route
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.username} - {self.title}"


class JobAlert(models.Model):
    """An email subscription for new-job notifications.

    Anonymous visitors can subscribe by email; logged-in users can optionally be
    linked via ``user``. Matching + delivery is handled by the
    ``send_job_alerts`` management command.
    """
    email = models.EmailField()
    # Comma-separated keywords matched against job title/description/skills.
    keywords = models.CharField(max_length=255, blank=True, default='')
    # '' means any job type; otherwise onsite / remote / hybrid.
    job_type = models.CharField(max_length=20, blank=True, default='')
    user = models.ForeignKey(
        'accounts.User', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='job_alerts',
    )
    is_active = models.BooleanField(default=True)
    # Random opaque token used for one-click unsubscribe links.
    token = models.CharField(max_length=64, unique=True)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({'active' if self.is_active else 'inactive'})"