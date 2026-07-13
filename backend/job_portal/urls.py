from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from django.http import HttpResponse

from job_portal.sitemaps import sitemaps
from job_portal.crawler import job_detail_seo


# AI / LLM crawlers to explicitly welcome for GEO (Generative Engine Optimization),
# so the site can be indexed & cited by generative search engines.
AI_CRAWLERS = [
    "GPTBot",              # OpenAI (ChatGPT training/index)
    "ChatGPT-User",        # OpenAI (user-triggered browsing)
    "OAI-SearchBot",       # OpenAI (ChatGPT Search)
    "PerplexityBot",       # Perplexity
    "Perplexity-User",     # Perplexity (user-triggered)
    "Google-Extended",     # Google Gemini / AI training
    "GoogleOther",         # Google research/AI
    "Applebot-Extended",   # Apple Intelligence
    "ClaudeBot",           # Anthropic
    "anthropic-ai",        # Anthropic
    "Claude-Web",          # Anthropic
    "cohere-ai",           # Cohere
    "CCBot",               # Common Crawl (feeds many LLMs)
    "Amazonbot",           # Amazon
    "Bytespider",          # ByteDance
    "Meta-ExternalAgent",  # Meta AI
    "YouBot",              # You.com
    "DuckAssistBot",       # DuckDuckGo AI
]


def robots_txt(request):
    proto = getattr(settings, 'SITE_PROTOCOL', 'https')
    domain = getattr(settings, 'SITE_DOMAIN', 'hr.rdi.world')

    lines = [
        "# Search engines — full access",
        "User-agent: *",
        "Allow: /",
        "",
        "# ── GEO: explicitly welcome AI / generative-search crawlers ──",
    ]
    for bot in AI_CRAWLERS:
        lines += [f"User-agent: {bot}", "Allow: /", ""]

    lines.append(f"Sitemap: {proto}://{domain}/sitemap.xml")
    return HttpResponse("\n".join(lines) + "\n", content_type="text/plain")


urlpatterns = [
    path('admin/', admin.site.urls),

    # SEO
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='sitemap'),
    path('robots.txt', robots_txt, name='robots'),
    # Server-rendered per-job page for crawlers (OG + JobPosting JSON-LD).
    path('jobs/<slug:slug>', job_detail_seo, name='job-detail-seo'),

    path('api/auth/', include('accounts.urls')),
    path('api/departments/', include('departments.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/tests/', include('tests.urls')),
    path('api/applicants/', include('applicants.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)