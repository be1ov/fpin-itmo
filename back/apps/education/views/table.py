from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.semester import current_semester
from apps.education.models import Student, TaskAssignment, TaskSubmission, PointsEntrance, BarsState
from apps.education.serializers import StudentSerializer, TaskAssignmentSerializer, TaskSubmissionSerializer, \
    PointsEntranceSerializer, BarsStateSerializer


class TableAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        semester = current_semester()
        if semester is None:
            return Response({
                "status": "error",
                "message": "semester not found"
            }, status=status.HTTP_404_NOT_FOUND)

        data = {
            "bars": [],
            "tasks": [],
            "students": []
        }

        # Сбор инфы по барсу
        bars_states = semester.barsstate_set.all()
        data["bars"] = BarsStateSerializer(bars_states, many=True).data

        #Сбор инфы по таскам (общее)
        flows = semester.flow_set.all()
        for flow in flows:
            assignments = TaskAssignment.objects.filter(flow=flow).all()
            data["tasks"].extend(TaskAssignmentSerializer(assignments, many=True).data)

        students = Student.objects.filter(flow__semester=semester).all()
        for student in students:
            student_data = {
                "student": StudentSerializer(student).data,
                "tasks": []
            }

            # Сбор информации по таскам
            assigned_tasks = student.flow.taskassignment_set.all()
            for task_assignment in assigned_tasks:
                try:
                    task_submission = TaskSubmission.objects.get(student=student, assignment=task_assignment)
                except TaskSubmission.DoesNotExist:
                    task_submission = None

                points = None
                if task_submission is not None:
                    points = task_submission.pointsentrance_set.first()

                task_data = {
                    "assignment": TaskAssignmentSerializer(task_assignment).data,
                    "submission": TaskSubmissionSerializer(task_submission).data if task_submission is not None else None,
                    "points": PointsEntranceSerializer(points).data if points is not None else None
                }
                student_data["tasks"].append(task_data)

            data["students"].append(student_data)

        return Response({
            "status": "success",
            "data": data
        })
