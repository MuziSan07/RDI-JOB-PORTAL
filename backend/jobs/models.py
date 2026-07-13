from django.db import models
from django.utils.text import slugify
from departments.models import Department

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('onsite', 'On Site'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    )
    
    SELECTION_TYPE_CHOICES = (
        ('test', 'Test'),
        ('interview', 'Interview'),
        ('test_interview', 'Test + Interview'),
    )
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )

    EMPLOYMENT_TYPE_CHOICES = (
        ('FULL_TIME', 'Full-time'),
        ('PART_TIME', 'Part-time'),
        ('CONTRACTOR', 'Contract'),
        ('TEMPORARY', 'Temporary'),
        ('INTERN', 'Internship'),
        ('VOLUNTEER', 'Volunteer'),
    )

    SALARY_PERIOD_CHOICES = (
        ('HOUR', 'Per hour'),
        ('DAY', 'Per day'),
        ('WEEK', 'Per week'),
        ('MONTH', 'Per month'),
        ('YEAR', 'Per year'),
    )

    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True, blank=True)  # SEO-friendly URL, auto-generated
    description = models.TextField()
    required_skills = models.TextField()
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    selection_type = models.CharField(max_length=20, choices=SELECTION_TYPE_CHOICES)
    salary_range = models.CharField(max_length=200, null=True, blank=True)
    # Structured salary (powers JobPosting baseSalary / Google for Jobs)
    salary_currency = models.CharField(max_length=3, default='USD', blank=True)  # ISO 4217
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_period = models.CharField(max_length=6, choices=SALARY_PERIOD_CHOICES, default='MONTH', blank=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default='FULL_TIME')
    # Location (for on-site / hybrid roles; remote uses job_type='remote')
    location_city = models.CharField(max_length=120, blank=True, default='')
    location_country = models.CharField(max_length=60, blank=True, default='')  # name or ISO code
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    vacancies = models.IntegerField(default=1)
    filled_positions = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Auto-generate a unique, SEO-friendly slug from the title.
        if not self.slug:
            base = slugify(self.title) or 'job'
            slug = base[:300]
            n = 1
            while Job.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base[:300]}-{n}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.department.name}"

    class Meta:
        ordering = ['-created_at']