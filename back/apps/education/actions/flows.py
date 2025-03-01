import datetime

from django.utils import timezone

from apps.education.actions.semester import current_semester
from apps.education.models import Student, Flow
from apps.persons.models import ServiceUser


def get_available_flows():
    semester = current_semester()
    return Flow.objects.filter(
        semester=semester,
    ).all()

def get_users_flows(user: ServiceUser, date: datetime=None):
    if date is None:
        date = timezone.now()

    students = Student.objects.filter(
        user=user,
        from_date__lte=date,
        to_date__gte=date,
        is_approved=True,
    )

    return Flow.objects.filter(id__in=students.values_list('flow', flat=True)).distinct()