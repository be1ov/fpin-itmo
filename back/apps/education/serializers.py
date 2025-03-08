from rest_framework import serializers
from .models import Semester, Flow, TaskAssignment, TaskSubmission, TaskSubmissionStatus, Student, BarsState, \
    TaskSubmissionStatusAttachment, Lesson, PointsEntrance
from ..persons.serializers import ServiceUserSerializer
from ..tasks.models import Task


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'

class FlowSerializer(serializers.ModelSerializer):
    semester = SemesterSerializer(read_only=True)

    class Meta:
        model = Flow
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class TaskAssignmentSerializer(serializers.ModelSerializer):
    flow = FlowSerializer(read_only=True)
    task = TaskSerializer(read_only=True)

    class Meta:
        model = TaskAssignment
        fields = '__all__'

class TaskSubmissionSerializer(serializers.ModelSerializer):
    task = TaskAssignmentSerializer(read_only=True)
    class Meta:
        model = TaskSubmission
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    flow = FlowSerializer(read_only=True)
    user = ServiceUserSerializer(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'

class TaskSubmissionStatusSerializer(serializers.ModelSerializer):
    submission = TaskSubmissionSerializer(read_only=True)
    author = ServiceUserSerializer(read_only=True)
    class Meta:
        model = TaskSubmissionStatus
        fields = '__all__'

class BarsStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarsState
        fields = '__all__'

class TaskSubmissionStatusAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskSubmissionStatusAttachment
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class PointsEntranceSerializer(serializers.ModelSerializer):
    author = ServiceUserSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    task_submission = TaskSubmissionSerializer(read_only=True)
    class Meta:
        model = PointsEntrance
        fields = '__all__'