"""Server-rendered per-job pages for crawlers (GEO / social / Google for Jobs).

The React SPA injects OpenGraph + JobPosting JSON-LD client-side, but many AI
bots and social scrapers don't execute JavaScript, so they'd see an empty shell.
This module renders a real HTML page per job — complete <head> metadata plus a
readable <body> and an "Apply" link back to the canonical SPA URL — so those
crawlers get the actual per-job content and structured data.

Served to everyone at /jobs/<slug> on the Django host (no UA sniffing, no
redirect, so there's no loop risk when Django and the SPA share a domain).
"""
import json
from decimal import Decimal

from django.conf import settings
from django.http import HttpResponse, HttpResponseNotFound
from django.utils.html import escape

from jobs.models import Job


def _origin():
    proto = getattr(settings, 'SITE_PROTOCOL', 'https')
    domain = getattr(settings, 'SITE_DOMAIN', 'hr.rdi.world')
    return f"{proto}://{domain}"


def _num(value):
    """Normalise a Decimal/None salary field to a plain float or None."""
    if value is None or value == '':
        return None
    if isinstance(value, Decimal):
        return float(value)
    return value


def build_job_posting_schema(job, origin):
    """Mirror of the frontend buildJobPostingSchema (utils/jobSchema.js)."""
    from datetime import timedelta

    url = f"{origin}/jobs/{job.slug or job.id}"
    date_posted = job.created_at
    valid_through = (date_posted + timedelta(days=30)) if date_posted else None

    schema = {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        'title': job.title,
        'description': job.description or job.required_skills or job.title,
        'datePosted': date_posted.isoformat() if date_posted else None,
        'validThrough': valid_through.isoformat() if valid_through else None,
        'employmentType': job.employment_type or 'FULL_TIME',
        'identifier': {
            '@type': 'PropertyValue',
            'name': 'RDI Job Portal',
            'value': str(job.id),
        },
        'hiringOrganization': {
            '@type': 'Organization',
            'name': job.department.name if job.department_id else 'Rupani Development Initiatives',
            'sameAs': origin,
            'logo': f"{origin}/RDI.png",
        },
        'url': url,
        'directApply': True,
    }

    # Salary → baseSalary (only when structured amounts are present)
    smin = _num(job.salary_min)
    smax = _num(job.salary_max)
    if smin is not None or smax is not None:
        value = {'@type': 'QuantitativeValue', 'unitText': job.salary_period or 'MONTH'}
        if smin is not None and smax is not None and smin != smax:
            value['minValue'] = smin
            value['maxValue'] = smax
        else:
            value['value'] = smin if smin is not None else smax
        schema['baseSalary'] = {
            '@type': 'MonetaryAmount',
            'currency': job.salary_currency or 'USD',
            'value': value,
        }

    # Location: remote → TELECOMMUTE (worldwide); on-site/hybrid → the job's place.
    has_place = bool(job.location_city or job.location_country)
    if job.job_type == 'remote':
        schema['jobLocationType'] = 'TELECOMMUTE'
        schema['applicantLocationRequirements'] = {'@type': 'AdministrativeArea', 'name': 'Worldwide'}
    elif has_place:
        address = {'@type': 'PostalAddress'}
        if job.location_city:
            address['addressLocality'] = job.location_city
        if job.location_country:
            address['addressCountry'] = job.location_country
        schema['jobLocation'] = {'@type': 'Place', 'address': address}
        if job.job_type == 'hybrid':
            schema['jobLocationType'] = 'TELECOMMUTE'
    else:
        schema['jobLocationType'] = 'TELECOMMUTE'
        schema['applicantLocationRequirements'] = {'@type': 'AdministrativeArea', 'name': 'Worldwide'}

    # Drop null keys for a clean payload.
    return {k: v for k, v in schema.items() if v is not None}


def job_detail_seo(request, slug):
    job = (
        Job.objects.select_related('department')
        .filter(slug=slug)
        .first()
    )
    if job is None and slug.isdigit():
        job = Job.objects.select_related('department').filter(pk=int(slug)).first()
    if job is None:
        return HttpResponseNotFound(
            "<!doctype html><meta charset='utf-8'><title>Job not found — RDI Job Portal</title>"
            "<h1>Job not found</h1><p>This job may have been closed or removed.</p>"
        )

    origin = _origin()
    canonical = f"{origin}/jobs/{job.slug or job.id}"
    org_name = job.department.name if job.department_id else 'Rupani Development Initiatives'

    # Short, clean meta description.
    raw_desc = (job.description or job.required_skills or job.title or '').strip()
    meta_desc = ' '.join(raw_desc.split())[:300]

    schema = build_job_posting_schema(job, origin)
    schema_json = json.dumps(schema, ensure_ascii=False)

    # Human-readable bits for the body.
    loc_bits = [b for b in (job.location_city, job.location_country) if b]
    location = ', '.join(loc_bits) if loc_bits else ('Remote / Worldwide' if job.job_type == 'remote' else 'Not specified')
    salary = job.salary_range or ''
    smin, smax = _num(job.salary_min), _num(job.salary_max)
    if not salary and (smin is not None or smax is not None):
        cur = job.salary_currency or 'USD'
        per = (job.salary_period or 'MONTH').lower()
        if smin is not None and smax is not None:
            salary = f"{cur} {smin:g}–{smax:g} / {per}"
        else:
            salary = f"{cur} {(smin if smin is not None else smax):g} / {per}"

    title = f"{job.title} at {org_name} — RDI Job Portal"

    body_rows = [
        ('Organization', org_name),
        ('Employment type', dict(Job.EMPLOYMENT_TYPE_CHOICES).get(job.employment_type, job.employment_type)),
        ('Work mode', dict(Job.JOB_TYPE_CHOICES).get(job.job_type, job.job_type)),
        ('Location', location),
    ]
    if salary:
        body_rows.append(('Salary', salary))
    if job.vacancies:
        body_rows.append(('Vacancies', str(job.vacancies)))

    rows_html = ''.join(
        f"<li><strong>{escape(label)}:</strong> {escape(str(val))}</li>"
        for label, val in body_rows
    )

    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title>
<meta name="description" content="{escape(meta_desc)}">
<link rel="canonical" href="{escape(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RDI Job Portal">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(meta_desc)}">
<meta property="og:url" content="{escape(canonical)}">
<meta property="og:image" content="{escape(origin)}/RDI.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{escape(title)}">
<meta name="twitter:description" content="{escape(meta_desc)}">
<meta name="twitter:image" content="{escape(origin)}/RDI.png">
<script type="application/ld+json">{schema_json}</script>
</head>
<body>
<main>
<h1>{escape(job.title)}</h1>
<p>{escape(org_name)}</p>
<ul>{rows_html}</ul>
<h2>Job description</h2>
<p style="white-space:pre-wrap">{escape(job.description or '')}</p>
<h2>Required skills</h2>
<p style="white-space:pre-wrap">{escape(job.required_skills or '')}</p>
<p><a href="{escape(canonical)}">View this job and apply on RDI Job Portal</a></p>
</main>
</body>
</html>"""

    resp = HttpResponse(html, content_type="text/html; charset=utf-8")
    # Cache at the edge/CDN for a bit — job content changes rarely.
    resp["Cache-Control"] = "public, max-age=600"
    return resp
