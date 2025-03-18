from django.db.models.expressions import result
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.flows import get_users_flows
from apps.education.actions.students import get_student
from apps.education.models import TaskAssignment
from apps.tests.actions import get_assigned_tests
from apps.tests.models import Test, TestAttempts, TestAssignment
from apps.tests.serializers import TestAssignmentSerializer, TestAttemptSerializer


class GetTestsAPIView(APIView):
    def get(self, request):
        user = request.user
        flows = get_users_flows(user)
        if len(flows) == 0:
            return Response({
                "status": "error",
                "message": "No flows found"
            }, status=status.HTTP_400_BAD_REQUEST)

        assigned_tests = get_assigned_tests(flows)
        return Response({
            "status": "success",
            "data": {
                "tests": TestAssignmentSerializer(assigned_tests, many=True).data,
            }
        })


class GetTestAssignmentAPIView(APIView):
    def get(self, request):
        user = request.user

        assignment_id = request.query_params.get('assignment_id', None)
        if assignment_id is None:
            return Response({
                "status": "error",
                "message": "assignment_id is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        assignment = TestAssignment.objects.filter(id=assignment_id).first()
        if assignment is None:
            return Response({
                "status": "error",
                "message": "Assignment does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        previous_attempts = TestAttempts.objects.filter(
            test_assignment__flow__semester=assignment.flow.semester,
            student__user=user,
            test_assignment__test=assignment.test
        ).all()

        return Response({
            "status": "success",
            "data": {
                "assignment": TestAssignmentSerializer(assignment).data,
                "attempts": TestAttemptSerializer(previous_attempts, many=True).data,
            }
        })



@authentication_classes([])
@permission_classes([])
class OnlineTestPadResultsAPIView(APIView):
    def get(self, request):
        test_id = request.query_params.get('test_id', None)
        if test_id is None:
            return Response({
                "status": "error",
                "message": "test_id is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        test = Test.objects.filter(testpad_id=test_id).first()
        if test is None:
            return Response({
                "status": "error",
                "message": "Test does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        return HttpResponse(test.testpad_checkphrase, content_type='text/plain')

    def post(self, request):
        test_id = request.query_params.get('test_id', None)
        if test_id is None:
            return Response({
                "status": "error",
                "message": "test_id is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        test = Test.objects.filter(testpad_id=test_id).first()
        if test is None:
            return Response({
                "status": "error",
                "message": "Test does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        regparams = request.data.get('regparams', None)
        if regparams is None:
            return Response({
                "status": "error",
                "message": "regparams is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        attempt_id = regparams[0]["value"]
        if attempt_id is None:
            return Response({
                "status": "error",
                "message": "attempt_id is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        attempt = TestAttempts.objects.filter(id=attempt_id, test_assignment__test=test).first()
        if attempt is None:
            return Response({
                "status": "error",
                "message": "attempt does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        assignment = attempt.test_assignment
        max_points = assignment.max_points
        if assignment.attempts_fees:
            fee = (attempt.attempt_number - 1) * (assignment.attempt_fee_amount if assignment.attempt_fee_amount else 0)
            max_points -= fee

        results = request.data.get('results', None)
        if results is None:
            return Response({
                "status": "error",
                "message": "results is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        percents = [obj for obj in results if obj["name"] == "Процент правильных ответов (%)"][0]
        points = max_points * (percents["value"]/100)

        attempt.points = points
        attempt.result_at = timezone.now()
        attempt.test_passed = points > assignment.min_points
        attempt.save()

        return Response({
            "status": "success",
        })

class CreateAttemptAPIView(APIView):
    def post(self, request):
        user = request.user

        assignment_id = request.data.get('assignment_id', None)
        if assignment_id is None:
            return Response({
                "status": "error",
                "message": "assignment_id is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        assignment = TestAssignment.objects.filter(id=assignment_id).first()
        if assignment is None:
            return Response({
                "status": "error",
                "message": "Assignment does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        student = get_student(assignment.flow, user)
        if student is None:
            return Response({
                "status": "error",
                "message": "Student does not exist"
            }, status=status.HTTP_400_BAD_REQUEST)

        previous_attempts = TestAttempts.objects.filter(
            test_assignment__flow__semester=assignment.flow.semester,
            student__user=user
        ).all()
        attempt_number = len(previous_attempts) + 1

        attempt = TestAttempts()
        attempt.test_assignment = assignment
        attempt.student = student
        attempt.attempt_number = attempt_number
        attempt.save()

        return Response({
            "status": "success",
            "data": {
                "attempt_link": f"{assignment.test.testpad_link}?pindbid={attempt.id}"
            }
        })