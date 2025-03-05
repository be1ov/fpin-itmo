import base64
from datetime import datetime
from uuid import uuid4

from django.core.files.base import ContentFile
from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.attendance.models import Attendance
from apps.core.models import File
from apps.core.serializers import FileSerializer
from apps.education.actions.students import get_student
from apps.education.models import Lesson


class UploadAttendanceView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        file_name = request.data.get('filename')
        file_data = request.data.get('binary')

        query_date = request.data.get('lessonDate')
        query_date_obj = datetime.strptime(query_date, '%Y-%m-%d').date()
        lesson = Lesson.objects.filter(date__date=query_date_obj).first()
        if lesson is None:
            return Response({
                "status": "error",
                "message": "Lesson not found"
            }, status=status.HTTP_404_NOT_FOUND)

        if not lesson.assignments_block_date is None:
            if lesson.assignments_block_date < timezone.now():
                return Response({
                    "status": "error",
                    "message": "Lesson block date is in the past"
                }, status=status.HTTP_400_BAD_REQUEST)


        file_content = base64.b64decode(file_data)
        file = ContentFile(file_content, name=f"{request.user.isu}_{file_name}")

        attendance = Attendance()
        attendance.user = request.user
        attendance.lesson = lesson
        attendance.attachment = file
        attendance.is_approved = False
        attendance.save()

        return Response({
            "status": "success",
        })