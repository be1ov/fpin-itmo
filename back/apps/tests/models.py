from django.db import models
from django.utils import timezone

from apps.education.models import Student, Lesson, Flow
from apps.persons.models import ServiceUser


class Test(models.Model):
    title = models.CharField(max_length=150)
    testpad_id = models.CharField(max_length=20)
    testpad_checkphrase = models.CharField(max_length=20)
    testpad_link = models.CharField(max_length=200)

    class Meta:
        verbose_name = "Тесты"
        verbose_name_plural = "Тест"

    def __str__(self):
        return self.title


class TestAssignment(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    flow = models.ForeignKey(Flow, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    assignment_date = models.DateField()
    max_points = models.FloatField()
    min_points = models.FloatField()
    attempts_fees = models.BooleanField()
    attempt_fee_amount = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Assignment for {self.test.title} on {self.assignment_date}"


class TestAttempts(models.Model):
    test_assignment = models.ForeignKey(TestAssignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    evaluator = models.ForeignKey(ServiceUser, on_delete=models.CASCADE, related_name='evaluated_attempts', null=True, blank=True)
    is_revised = models.BooleanField(default=False)
    points = models.FloatField(default=0)
    test_passed = models.BooleanField(default=False)
    attempt_number = models.IntegerField(default=1)
    created_at = models.DateField(default=timezone.now)
    result_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Attempt {self.attempt_number} by {self.student.user.full_name} for {self.test_assignment.test.title}"
