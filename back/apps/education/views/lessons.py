from datetime import datetime

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.attendance.models import Attendance
from apps.attendance.serializers import AttendanceSerializer
from apps.education.actions.lessons import get_lessons
from apps.education.actions.semester import current_semester
from apps.education.models import Lesson
from apps.education.serializers import LessonSerializer


class LessonsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if "date" in request.query_params.keys():
            query_date = request.query_params['date']
            query_date_obj = datetime.strptime(query_date, '%Y-%m-%d').date()
            lesson = Lesson.objects.filter(date__date=query_date_obj).first()

            attendance = Attendance.objects.filter(lesson=lesson, user=request.user).first()
            return Response({
                "status": "success",
                "data": {
                    "lesson": LessonSerializer(lesson).data,
                    "attendance": AttendanceSerializer(attendance).data if attendance else None,
                }
            })
        semester = current_semester()
        lessons = get_lessons(semester)
        return Response({
            "status": "success",
            "data": LessonSerializer(lessons, many=True).data,
        })