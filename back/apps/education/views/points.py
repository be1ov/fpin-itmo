from django.utils import timezone
from apps.tests.models import TestAssignment, TestAttempts
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.semester import current_semester
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

            assigned_tests = TestAssignment.objects.filter(flow=student.flow, max_points__gt=0).all()
            for test_assignment in assigned_tests:
                top_attempt = TestAttempts.objects.filter(
                    test_assignment=test_assignment,
                    is_revised=True,
                    test_passed=True,
                    student=student
                ).order_by('-points').first()
                data.append({
                    "title": test_assignment.test.title,
                    "points": top_attempt.points if top_attempt else 0,
                    "author": ServiceUserSerializer(top_attempt.evaluator).data if top_attempt and top_attempt.evaluator else None,
                    "max": test_assignment.max_points,
                    "barsed_at": None
                })

        total = sum([point["points"] for point in data])

        return Response({
            "status": "success",
            "data": {
                "total": total,
                "points": data
            }
        })

class SetPointsView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        if not user.is_staff:
            return Response({
                "status": "error",
                "message": "Only staff can set points"
            }, status=status.HTTP_400_BAD_REQUEST)

        points = request.data.get("points", None)
        if points is None:
            return Response({
                "status": "error",
                "message": "No points provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        submission_id = request.data.get("submission_id", None)
        if submission_id is None:
            return Response({
                "status": "error",
                "message": "No submission id provided"
            }, status=status.HTTP_400_BAD_REQUEST)

        submission = TaskSubmission.objects.filter(id=submission_id).first()
        if submission is None:
            return Response({
                "status": "error",
                "message": "Submission not found"
            }, status=status.HTTP_404_NOT_FOUND)

        comment = request.data.get("comment", None)

        entry = PointsEntrance(
            author=user,
            date=timezone.now(),
            amount=points,
            task_submission=submission,
            comment=comment,
            student=submission.student,
            bars_state=submission.assignment.bars_state
        )
        entry.save()

        return Response({
            "status": "success"
        })