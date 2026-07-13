"""Public Job Alerts API (subscribe / unsubscribe).

Kept in a dedicated module (not accounts/views.py) so the alerts feature stays
self-contained. All endpoints are AllowAny — job seekers can subscribe without
an account.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import JobAlert

# Valid job-type filters (matches jobs.models.Job.JOB_TYPE_CHOICES). '' = any.
_VALID_JOB_TYPES = ('', 'onsite', 'remote', 'hybrid')


@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_alert(request):
    """Create (or refresh) an email job alert.

    Body: {email, keywords?, job_type?}. Idempotent per email — re-subscribing
    updates the keywords/job_type and re-activates the alert.
    """
    email = (request.data.get('email') or '').strip()
    keywords = (request.data.get('keywords') or '').strip()
    job_type = (request.data.get('job_type') or '').strip().lower()

    if not email:
        return Response(
            {'error': 'Email is required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if job_type not in _VALID_JOB_TYPES:
        job_type = ''

    alert, created = JobAlert.objects.get_or_create(
        email__iexact=email,
        defaults={'email': email, 'keywords': keywords, 'job_type': job_type},
    )

    if not created:
        # Existing subscriber — update their preferences and re-activate.
        alert.keywords = keywords
        alert.job_type = job_type
        alert.is_active = True
        alert.save()
        message = "You're already subscribed — we've updated your preferences."
    else:
        message = "You're subscribed! We'll email you when matching jobs are posted."

    return Response(
        {'message': message, 'token': alert.token},
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def unsubscribe_alert(request, token):
    """Deactivate the alert identified by ``token``. 404 if the token is unknown."""
    try:
        alert = JobAlert.objects.get(token=token)
    except JobAlert.DoesNotExist:
        return Response(
            {'error': 'This subscription could not be found.'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if alert.is_active:
        alert.is_active = False
        alert.save(update_fields=['is_active'])

    return Response(
        {'message': "You've been unsubscribed from job alerts."},
        status=status.HTTP_200_OK,
    )
