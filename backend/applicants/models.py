from django.db import models
from accounts.models import User, Resume
from jobs.models import Job
from tests.models import Chapter

class Application(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('task_assigned', 'Task Assigned'),
        ('task_submitted', 'Task Submitted'),
        ('test_assigned', 'Test Assigned'),
        ('test_completed', 'Test Completed'),
        ('test_passed', 'Test Passed'),
        ('test_failed', 'Test Failed'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('interview_completed', 'Interview Completed'),
        ('waiting', 'Waiting'),
        ('notice_period', 'Notice Period'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    )
    
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    resume = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    rejection_reason = models.TextField(null=True, blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.applicant.username} - {self.job.title} - {self.status}"
    
    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'applicant']

class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-created_at']

class TestAssignment(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='test_assignment')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    deadline = models.DateTimeField()
    pass_percentage = models.IntegerField(default=70)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.application.applicant.username} - {self.chapter.name}"

class TestResult(models.Model):
    test_assignment = models.OneToOneField(TestAssignment, on_delete=models.CASCADE, related_name='result')
    score = models.FloatField()
    total_questions = models.IntegerField()
    correct_answers = models.IntegerField()
    percentage = models.FloatField()
    passed = models.BooleanField()
    completed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.test_assignment.application.applicant.username} - {self.percentage}%"

class TestAnswer(models.Model):
    test_result = models.ForeignKey(TestResult, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey('tests.Question', on_delete=models.CASCADE)
    selected_options = models.ManyToManyField('tests.MCQOption')
    is_correct = models.BooleanField()
    
    def __str__(self):
        return f"{self.test_result.test_assignment.application.applicant.username} - Q: {self.question.id}"

class Interview(models.Model):
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='interview')
    interview_link = models.URLField()
    interview_datetime = models.DateTimeField()
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.application.applicant.username} - {self.interview_datetime}"


class TaskAssignment(models.Model):
    """A free-form task the department gives an applicant. The applicant uploads
    one or more documents (PDF/DOC) as their submission, which the department
    then reviews from the applicant detail view."""
    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='task_assignment')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True, default='')
    deadline = models.DateTimeField(null=True, blank=True)
    # Optional brief/reference document supplied by the department.
    attachment = models.FileField(upload_to='task_briefs/', null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    # Set the moment the applicant submits their files.
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.application.applicant.username} - {self.title}"


class TaskSubmissionFile(models.Model):
    """One uploaded document belonging to a task submission."""
    task = models.ForeignKey(TaskAssignment, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='task_submissions/')
    original_name = models.CharField(max_length=255, blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return f"{self.task.application.applicant.username} - {self.original_name or self.file.name}"