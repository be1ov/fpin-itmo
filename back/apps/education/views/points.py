from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.semester import current_semester
from apps.education.actions.students import get_student
from apps.education.models import PointsEntrance
from apps.education.serializers import BarsStateSerializer
from apps.persons.serializers import ServiceUserSerializer


class PointsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        semester = current_semester()
        points = PointsEntrance.objects.filter(student__user=user, student__flow__semester=semester).all()

        total = sum([point.amount for point in points])

        return Response({
            "status": "success",
            "data": {
                "total": total,
                "points": [
                    {
                        "title": point.task_submission.assignment.task.title,
                        "points": point.amount,
                        "author": ServiceUserSerializer(point.author).data,
                        "max": point.task_submission.assignment.max_points,
                        "barsed_at": BarsStateSerializer(point.bars_state).data,
                    }
                for point in points]
            }
        })