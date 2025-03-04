from enum import Enum

from django.db import models
from django.utils import timezone

from apps.education.models import Semester, BarsState
from apps.persons.models import ServiceUser
from apps.tasks.models import Task

class ProjectStatuses(Enum):
    DRAFT = 'DRAFT'
    ON_REVIEW = 'ON_REVIEW'
    CONFIRMED = 'CONFIRMED'
    IN_PROGRESS = 'IN_PROGRESS'
    DONE = 'DONE'
    DEFENDED = 'DEFENDED'

class ProjectTaskStatuses(Enum):
    DRAFT = 'DRAFT'
    IN_PROGRESS = 'IN_PROGRESS'
    DONE = 'DONE'
    DECLINED = 'DECLINED'

class SemesterProject(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.RESTRICT)
    title = models.CharField(max_length=100, default="Проект")

    min_points = models.FloatField(default=0)
    max_points = models.FloatField(default=0)

    bars_statements = models.ManyToManyField(BarsState, blank=True, related_name="bars_statements")
    def __str__(self):
        return f"{self.title} – {self.semester}"

class Project(models.Model):
    project_task = models.ForeignKey(SemesterProject, on_delete=models.RESTRICT)
    title = models.CharField(max_length=100)
    description = models.TextField()

    head = models.ForeignKey(ServiceUser, on_delete=models.RESTRICT)
    repository = models.URLField(max_length=200)

    def __str__(self):
        return f"{self.title}"

class ProjectStatus(models.Model):
    project = models.ForeignKey(Project, on_delete=models.RESTRICT)
    status = models.CharField(
        max_length=20,
        choices=[(status.value, status.name) for status in ProjectTaskStatuses],
        default=ProjectTaskStatuses.DRAFT.value,
    )
    date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(ServiceUser, on_delete=models.RESTRICT)

    def __str__(self):
        return f"{self.project} – {self.status} – {self.date}, {self.author}"

class ProjectParticipant(models.Model):
    project = models.ForeignKey(Project, on_delete=models.RESTRICT)
    user = models.ForeignKey(ServiceUser, on_delete=models.RESTRICT)
    report = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} — {self.project}"

class ProjectTask(models.Model):
    project = models.ForeignKey(Project, on_delete=models.RESTRICT)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    executor = models.ForeignKey(ProjectParticipant, on_delete=models.RESTRICT)
    author = models.ForeignKey(ServiceUser, on_delete=models.RESTRICT)

    creation_date = models.DateTimeField(default=timezone.now)
    plan_date = models.DateTimeField(null=True, blank=True)
    comment = models.TextField()

    def __str__(self):
        return f"{self.title} — {self.project}"

class ProjectTaskStatus(models.Model):
    project_task = models.ForeignKey(ProjectTask, on_delete=models.RESTRICT)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(
        max_length=20,
        choices=[(status.value, status.name) for status in ProjectTaskStatuses],
        default=ProjectTaskStatuses.DRAFT.value,
    )
    author = models.ForeignKey(ServiceUser, on_delete=models.RESTRICT)

    def __str__(self):
        return f"{self.project_task} – {self.status} – {self.date}, {self.author}"