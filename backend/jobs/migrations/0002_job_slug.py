from django.db import migrations, models
from django.utils.text import slugify


def backfill_slugs(apps, schema_editor):
    Job = apps.get_model('jobs', 'Job')
    used = set()
    for job in Job.objects.all().order_by('id'):
        base = slugify(job.title) or 'job'
        slug = base[:300]
        n = 1
        while slug in used or Job.objects.filter(slug=slug).exclude(pk=job.pk).exists():
            n += 1
            slug = f"{base[:300]}-{n}"
        used.add(slug)
        job.slug = slug
        job.save(update_fields=['slug'])


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        # 1) add the column (not yet unique) so existing rows can be filled
        migrations.AddField(
            model_name='job',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=320),
            preserve_default=False,
        ),
        # 2) generate a unique slug for every existing job
        migrations.RunPython(backfill_slugs, noop),
        # 3) enforce uniqueness now that all rows have a value
        migrations.AlterField(
            model_name='job',
            name='slug',
            field=models.SlugField(blank=True, max_length=320, unique=True),
        ),
    ]
