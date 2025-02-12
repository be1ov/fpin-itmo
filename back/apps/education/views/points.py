from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.semester import current_semester
from apps.education.actions.students import get_student
from apps.education.models import PointsEntrance, TaskAssignment, TaskSubmission, Student
from apps.education.serializers import BarsStateSerializer
from apps.persons.serializers import ServiceUserSerializer


class PointsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        semester = current_semester()

        data = []

        student = Student.objects.filter(flow__semester=semester, user=user).first()
        if student is not None:
            assigned_tasks = TaskAssignment.objects.filter(flow=student.flow).all()
            for assignment in assigned_tasks:
                submission = TaskSubmission.objects.filter(assignment=assignment, student=student).first()
                points = PointsEntrance.objects.filter(task_submission=submission).order_by("-date").first() if submission is not None else None

                data.append({
                    "title": assignment.task.title,
                    "points": points.amount if points is not None else 0,
                    "author": ServiceUserSerializer(points.author).data if points is not None else None,
                    "max": assignment.max_points,
                    "barsed_at": BarsStateSerializer(points.bars_state).data if points is not None else None
                })

        total = sum([point["points"] for point in data])

        return Response({
            "status": "success",
            "data": {
                "total": total,
                "points": data
            }
        })