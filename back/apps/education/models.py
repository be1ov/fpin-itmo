from datetime import datetime

from django.utils.translation import gettext_lazy as _
from django.db import models

from apps.persons.models import ServiceUser
from apps.tasks.models import Task


class Semester(models.Model):
    title = models.CharField(max_length=30)
    from_date = models.DateField()
    to_date = models.DateField()
    base_repo_url = models.URLField(blank=True, null=True)
    chat_url = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = "Семестр"
        verbose_name_plural = "Семестры"

    def __str__(self):
        return f"{self.title}"


class Flow(models.Model):
    title = models.CharField(max_length=30)
    semester = models.ForeignKey(Semester, on_delete=models.PROTECT)

    class Meta:
        verbose_name = "Поток"
        verbose_name_plural = "Потоки"

    def __str__(self):
        return f"{self.title}, {self.semester}"


class Student(models.Model):
    flow = models.ForeignKey(Flow, on_delete=models.PROTECT)
    user = models.ForeignKey(ServiceUser, on_delete=models.PROTECT, null=True)
    from_date = models.DateField()
    to_date = models.DateField(blank=True, null=True)

    is_approved = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Студент"
        verbose_name_plural = "Студенты"

    def __str__(self):
        return f"{self.user} ({self.flow})"


class CommonLesson(models.Model):
    title = models.CharField(max_length=150)
    is_obligatory = models.BooleanField()

    class LessonType(models.TextChoices):
        LECTURE = 'LECTURE', _('Лекция')
        PRACTICE = 'PRACTICE', _('Практика')
        CONSULTATION = 'CONSULTATION', _('Консультация')
        CREDIT = 'CREDIT', _('Зачет')
        EXAM = 'EXAM', _('Экзамен')

    type = models.CharField(
        max_length=30,
        choices=LessonType.choices,
        default=LessonType.LECTURE,
    )

    semester = models.ForeignKey(Semester, on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.title} ({self.date})"
        

class Lesson(models.Model):
    title = models.CharField(max_length=150)
    date = models.DateTimeField()
    is_obligatory = models.BooleanField()

    assignments_block_date = models.DateTimeField(blank=True, null=True)

    class LessonType(models.TextChoices):
        LECTURE = 'LECTURE', _('Лекция')
        PRACTICE = 'PRACTICE', _('Практика')
        CONSULTATION = 'CONSULTATION', _('Консультация')
        CREDIT = 'CREDIT', _('Зачет')
        EXAM = 'EXAM', _('Экзамен')

    type = models.CharField(
        max_length=30,
        choices=LessonType.choices,
        default=LessonType.LECTURE,
    )

    semester = models.ForeignKey(Semester, on_delete=models.PROTECT)

    flows = models.ManyToManyField(Flow)

    class Meta:
        verbose_name = "Занятие"
        verbose_name_plural = "Занятия"

    common_lessons = models.ManyToManyField(CommonLesson)

    def __str__(self):
        return f"{self.title} ({self.date})"

class BarsState(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.PROTECT)
    title = models.CharField(max_length=150)
    minimum_points = models.DecimalField(max_digits=5, decimal_places=2)
    maximum_points = models.DecimalField(max_digits=5, decimal_places=2)

    control_minimum = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} [{self.minimum_points}-{self.maximum_points}] ({self.semester})"


class TaskAssignment(models.Model):
    flow = models.ForeignKey(Flow, on_delete=models.PROTECT)
    task = models.ForeignKey(Task, on_delete=models.PROTECT)
    opens_at = models.DateTimeField()
    deadline = models.DateTimeField()

    fees = models.BooleanField(default=False)
    fees_per_week = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    max_points = models.DecimalField(max_digits=5, decimal_places=2)

    bars_state = models.ForeignKey(BarsState, on_delete=models.PROTECT, null=True)

    class Meta:
        verbose_name = "Выдача задания"
        verbose_name_plural = "Выдачи заданий"

    def __str__(self):
        return f"{self.task} - {self.flow}"


class TaskSubmission(models.Model):
    assignment = models.ForeignKey(TaskAssignment, on_delete=models.PROTECT)
    coordinator = models.ForeignKey(ServiceUser, on_delete=models.PROTECT, null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    user = models.ForeignKey(ServiceUser, on_delete=models.PROTECT, null=True, blank=True, related_name='user_task_submissions')
    date = models.DateTimeField(default=datetime.now)

    class Meta:
        verbose_name = "Сдача задания"
        verbose_name_plural = "Сдачи заданий"

    def __str__(self):
        return f"{self.student} - {self.assignment}"


class TaskSubmissionStatus(models.Model):
    submission = models.ForeignKey(TaskSubmission, on_delete=models.PROTECT)
    author = models.ForeignKey(ServiceUser, on_delete=models.PROTECT)
    text = models.CharField(max_length=1000)
    date = models.DateTimeField(default=datetime.now)

    class SubmissionStatuses(models.TextChoices):
        WORKING = 'WORKING', _('В работе')
        ON_REVIEW = 'ON_REVIEW', _('На проверке')
        DECLINED = 'DECLINED', _('Отклонено')
        APPROVED = 'APPROVED', _('Согласовано')
        DEFENDED = 'DEFENDED', _('Зачтено')

    status = models.CharField(
        max_length=30,
        choices=SubmissionStatuses.choices,
        default=SubmissionStatuses.ON_REVIEW,
    )

    class Meta:
        verbose_name = "Статус сдачи задания"
        verbose_name_plural = "Статусы сдач заданий"

    def __str__(self):
        return f"{self.status} - {self.submission}"


class TaskSubmissionStatusAttachment(models.Model):
    status = models.ForeignKey(TaskSubmissionStatus, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    order = models.IntegerField()
    url = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = "Вложение (сдача задания)"
        verbose_name_plural = "Вложения (сдачи заданий)"


class PointsEntrance(models.Model):
    author = models.ForeignKey(ServiceUser, on_delete=models.PROTECT)
    date = models.DateTimeField()
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    comment = models.CharField(max_length=100, blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    task_submission = models.ForeignKey(TaskSubmission, on_delete=models.PROTECT, blank=True, null=True)

    bars_state = models.ForeignKey(BarsState, on_delete=models.PROTECT, blank=True, null=True)

    class Meta:
        verbose_name = "БАРС"
        verbose_name_plural = "БАРС"
