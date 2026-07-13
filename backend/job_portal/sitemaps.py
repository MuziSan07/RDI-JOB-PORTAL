from django.conf import settings
from django.contrib.sitemaps import Sitemap

from jobs.models import Job


class _FixedSite:
    """Forces sitemap URLs onto the public site domain, regardless of the host the
    request came in on (backend/api host, localhost, etc.)."""
    def __init__(self):
        self.domain = getattr(settings, 'SITE_DOMAIN', 'hr.rdi.world')
        self.name = self.domain


class BaseSitemap(Sitemap):
    @property
    def protocol(self):
        return getattr(settings, 'SITE_PROTOCOL', 'https')

    def get_urls(self, page=1, site=None, protocol=None):
        return super().get_urls(page=page, site=_FixedSite(), protocol=self.protocol)


class StaticViewSitemap(BaseSitemap):
    """Public marketing / browse pages (fixed frontend routes)."""
    changefreq = 'weekly'
    priority = 0.7

    PAGES = {
        'home': '/',
        'jobs': '/jobs',
        'how-it-works': '/how-it-works',
        'for-employers': '/for-employers',
        'about': '/about',
        'contact': '/contact',
    }

    def items(self):
        return list(self.PAGES.keys())

    def location(self, item):
        return self.PAGES[item]

    def priority_for(self, item):
        return 1.0 if item == 'home' else 0.7


class JobSitemap(BaseSitemap):
    """One entry per open job, using its SEO slug URL."""
    changefreq = 'daily'
    priority = 0.9
    limit = 5000  # split into multiple sitemap files above this

    def items(self):
        return Job.objects.filter(status='open').order_by('-updated_at')

    def location(self, obj):
        return f'/jobs/{obj.slug}'

    def lastmod(self, obj):
        return obj.updated_at


sitemaps = {
    'static': StaticViewSitemap,
    'jobs': JobSitemap,
}
