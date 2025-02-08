from apps.education.models import Semester, Lesson


def get_lessons(semester: Semester):
    return Lesson.objects.filter(semester=semester).all()