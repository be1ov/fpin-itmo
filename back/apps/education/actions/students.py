from apps.education.models import Flow, Student
from apps.persons.models import ServiceUser


def get_student(flow: Flow, user: ServiceUser):
    return Student.objects.filter(flow=flow, user=user).first()