from apps.education.models import TaskAssignment, TaskSubmissionStatus, TaskSubmission, Student
from apps.tasks.models import Task


def get_assigned_tasks(flows):
    return TaskAssignment.objects.filter(flow__in=flows).select_related('task')

def get_submission(assignment, student: Student):
    return TaskSubmission.objects.filter(assignment=assignment, student=student).first()

def get_submission_by_id(id):
    return TaskSubmission.objects.filter(id=id).first()

def get_submission_statuses(submission):
    return TaskSubmissionStatus.objects.filter(submission=submission).order_by("date").all()

def get_assignment(id):
    return TaskAssignment.objects.filter(id=id).select_related('task', 'flow').first()

def get_tasks():
    return Task.objects.all()

def get_task_by_id(id):
    return Task.objects.filter(id=id).first()