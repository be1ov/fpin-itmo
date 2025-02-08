from django.utils import timezone

from apps.education.models import Semester


def current_semester(date=None):
    if date is None:
        date = timezone.now()
    semester = Semester.objects.filter(from_date__lte=date, to_date__gte=date).first()

    return semester