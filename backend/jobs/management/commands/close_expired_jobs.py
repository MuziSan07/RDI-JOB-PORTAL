from django.core.management.base import BaseCommand
from django.utils import timezone

from jobs.models import Job


class Command(BaseCommand):
    help = "Close open jobs whose last applying date (application_deadline) has passed."

    def handle(self, *args, **options):
        today = timezone.now().date()
        expired = Job.objects.filter(
            status='open',
            application_deadline__isnull=False,
            application_deadline__lt=today,
        )
        count = expired.update(status='closed')
        self.stdout.write(self.style.SUCCESS(f"Closed {count} expired job(s)."))
