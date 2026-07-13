"""Send pending job-alert emails.

For each active JobAlert, find newly-posted open jobs matching the subscriber's
keywords (and optional job_type) since the last send, and email a digest.

Run periodically (e.g. via cron):
    python manage.py send_job_alerts
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from django.utils import timezone

from accounts.models import JobAlert
from jobs.models import Job

# Public site used to build job + unsubscribe links in the email body.
SITE_BASE = 'https://hr.rdi.world'


class Command(BaseCommand):
    help = 'Send email digests to active job-alert subscribers for newly posted matching jobs.'

    def handle(self, *args, **options):
        now = timezone.now()
        alerts = JobAlert.objects.filter(is_active=True)

        processed = 0
        emails_sent = 0

        for alert in alerts:
            processed += 1

            # Only consider jobs posted since we last emailed this subscriber
            # (or the last 24h for a brand-new alert).
            since = alert.last_sent_at or (now - timedelta(hours=24))

            jobs = Job.objects.filter(status='open', created_at__gt=since)

            # Optional job-type filter.
            if alert.job_type:
                jobs = jobs.filter(job_type=alert.job_type)

            # Keyword match against title / description / required_skills.
            keywords = [k.strip() for k in (alert.keywords or '').split(',') if k.strip()]
            if keywords:
                kw_q = Q()
                for kw in keywords:
                    kw_q |= (
                        Q(title__icontains=kw)
                        | Q(description__icontains=kw)
                        | Q(required_skills__icontains=kw)
                    )
                jobs = jobs.filter(kw_q)

            jobs = list(jobs.order_by('-created_at').distinct())

            if not jobs:
                continue

            unsubscribe_url = f"{SITE_BASE}/api/auth/job-alerts/unsubscribe/{alert.token}/"

            lines = ["New jobs matching your alert:", ""]
            for job in jobs:
                lines.append(f"- {job.title} ({job.get_job_type_display()})")
                lines.append(f"  {SITE_BASE}/jobs/{job.slug}")
                lines.append("")
            lines.append("---")
            lines.append(f"To stop receiving these emails, unsubscribe here:\n{unsubscribe_url}")

            subject = f"{len(jobs)} new job{'s' if len(jobs) != 1 else ''} matching your alert - RDI Job Portal"
            body = "\n".join(lines)

            try:
                send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,
                    [alert.email],
                    fail_silently=False,
                )
                alert.last_sent_at = now
                alert.save(update_fields=['last_sent_at'])
                emails_sent += 1
            except Exception as exc:  # one bad send must not stop the loop
                self.stderr.write(
                    self.style.WARNING(f"Failed to send alert to {alert.email}: {exc}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Job alerts complete: {processed} alert(s) processed, {emails_sent} email(s) sent."
            )
        )
