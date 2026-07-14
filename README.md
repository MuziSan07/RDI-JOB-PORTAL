<div align="center">

<img src="docs/assets/banner.svg" alt="RDI Job Portal" width="100%" />

<br/>

**A recruitment platform by Rupani Development Initiatives, connecting ambitious talent with employers building brighter futures.**

<br/>

![Django](https://img.shields.io/badge/Django-5.2-0C4B33?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.16-A30000?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/Auth-JWT-C9972C?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-DB-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![SEO](https://img.shields.io/badge/SEO%20%2F%20GEO-ready-0E7A42?style=for-the-badge&logo=googlesearchconsole&logoColor=white)

</div>

## What is this

RDI Job Portal is a global hiring platform with three roles built in.

| Role | What they do |
| --- | --- |
| **Job Seekers** | Build one profile, browse and search openings, apply in a click, save jobs, take assessments inline, and track every application from applied to test to interview to offer in real time. |
| **Departments and Employers** | Post roles with structured salary, employment type and location, review applicants, run tests and interviews, and manage their own hiring pipeline. |
| **Super Admin** | Oversee the whole platform: departments, jobs, employees, activity logs, and an analytics dashboard with live charts. |

It ships with a React front end, a Django REST API backend, JWT authentication, email job alerts, a cookie consent flow, full legal pages, and a discovery layer for search engines and AI crawlers (sitemap, robots, per job structured data, and a crawler route that renders job pages on the server).

<div align="center">
<br/>
<img src="docs/assets/landing.png" alt="Landing page" width="90%" />
<br/><br/>
</div>

## Features

**For everyone**
- Fast job search and filtering by type, selection process, and sort order
- Clean slug URLs such as `/jobs/senior-react-developer`
- Cookie consent banner plus full Privacy Policy, Terms and Conditions, and Cookie Policy pages
- Custom 404 page, loading skeletons, and a React error boundary, so nothing shows a blank screen

**For job seekers**
- One profile, unlimited applications with live status tracking
- Save and bookmark jobs for later
- Email job alerts by keyword and job type
- Inline skills assessments and résumé management

**For admins and employers**
- Super admin analytics dashboard with charts drawn as inline SVG, no chart library (applications by status, jobs per department, applications over time)
- Applicant tracking across every hiring stage
- Structured salary, employment type, and location fields on each job

**Discoverability (SEO and GEO)**
- Dynamic `sitemap.xml` with one entry per open job
- `robots.txt` that explicitly welcomes AI and generative search crawlers
- JobPosting structured data on each job (base salary, employment type, location) plus Open Graph and Twitter cards
- A crawler route rendered on the server, so bots that do not run JavaScript still see real job content

<div align="center">
<br/>
<table>
  <tr>
    <td width="50%"><img src="docs/assets/jobs.png" alt="Browse jobs" /></td>
    <td width="50%"><img src="docs/assets/jobdetail.png" alt="Job detail" /></td>
  </tr>
  <tr>
    <td align="center"><em>Browse and filter jobs</em></td>
    <td align="center"><em>Job detail with selection process</em></td>
  </tr>
</table>
<br/>
<img src="docs/assets/privacy.png" alt="Legal pages" width="90%" />
<br/>
<em>Minimalist legal pages matched to the app theme</em>
<br/><br/>
</div>

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18 (CRA), React Router 6, Axios, lucide-react, inline style design system |
| **Backend** | Django 5.2, Django REST Framework, SimpleJWT, django-cors-headers, Pillow, ReportLab, openpyxl |
| **Database** | SQLite by default. Swap `DATABASES` for PostgreSQL in production |
| **Auth** | JWT access and refresh tokens with rotation and blacklisting |
| **Email** | Console backend in development, SMTP through env vars in production |

## Project Structure

```
rdi-job-portal-main/
├── backend/                     Django REST API
│   ├── accounts/                Users, auth, notifications, job alerts
│   ├── applicants/              Applications, saved jobs
│   ├── departments/             Employer and department entities
│   ├── jobs/                    Job model, serializers, slug and structured fields
│   ├── tests/  employees/       Assessments and employee records
│   ├── job_portal/              Settings, urls, sitemaps.py, crawler.py
│   └── manage.py
├── job-portal/frontend/         React single page app
│   └── src/
│       ├── pages/               Landing, Jobs, JobDetail, legal pages, SavedJobs
│       ├── components/          admin, brand, common, legal
│       ├── services/            Axios API clients
│       └── utils/               jobSchema.js (JobPosting JSON-LD)
└── docs/assets/                 README banner and screenshots
```

## Getting Started

### Prerequisites
- Python 3.10 or newer
- Node.js 16 or newer, with npm

### 1. Backend (Django API on http://localhost:8000)

```bash
cd backend

# create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS or Linux:
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate      # runs migrations and seeds the super admin
python manage.py runserver 8000
```

On the first migrate, a super admin is seeded automatically. You can override it with env vars.

| Field | Default |
| --- | --- |
| Email | `hr@rdi.com` |
| Password | `@RDI123` |

Sign in at the admin login page (`/admin/login`) in the front end, or the Django admin at `http://localhost:8000/admin/`.

> Change these credentials before going to production. Set `DJANGO_SUPERADMIN_EMAIL` and `DJANGO_SUPERADMIN_PASSWORD`.

### 2. Frontend (React app on http://localhost:3000)

```bash
cd job-portal/frontend
npm install
npm start
```

The app talks to the API at `http://localhost:8000/api` (see `src/services/api.js`).

## Production Configuration

Set these environment variables for the backend in production.

```bash
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<a strong random key>
DJANGO_ALLOWED_HOSTS=hr.rdi.world

# Absolute URLs used in sitemap.xml, robots.txt and the crawler route
SITE_DOMAIN=hr.rdi.world
SITE_PROTOCOL=https

# CORS allow list (comma separated)
CORS_ALLOWED_ORIGINS=https://hr.rdi.world

# Email (job alerts) over SMTP
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=<smtp host>
EMAIL_HOST_USER=<smtp user>
EMAIL_HOST_PASSWORD=<smtp password>
DEFAULT_FROM_EMAIL="RDI Job Portal <no-reply@rdi.world>"

# Optional super admin seed overrides
DJANGO_SUPERADMIN_EMAIL=<email>
DJANGO_SUPERADMIN_PASSWORD=<password>
```

> Reverse proxy note. The `robots.txt`, `sitemap.xml`, and crawler route `/jobs/<slug>` are served by Django. Since `hr.rdi.world/jobs/<slug>` is also the React route, configure your proxy so those paths (or bot user agents) resolve to the Django backend.

## SEO and GEO Endpoints

| URL | Purpose |
| --- | --- |
| `/sitemap.xml` | Dynamic sitemap including one entry per open job |
| `/robots.txt` | Crawl rules that explicitly allow AI and generative search bots |
| `/jobs/<slug>` (Django) | Job page rendered on the server with Open Graph tags and JobPosting JSON-LD |

## Management Commands

```bash
# Send pending email job alert digests (schedule with cron or task scheduler)
python manage.py send_job_alerts

# Standard Django
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

<div align="center">
<br/>

**Rupani Development Initiatives** · *Transforming Lives*
<br/>
Offices in the United States, Pakistan, Afghanistan, and the United Arab Emirates

</div>
