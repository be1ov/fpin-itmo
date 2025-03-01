from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.flows import get_users_flows
from apps.tests.actions import get_assigned_tests
from apps.tests.serializers import TestAssignmentSerializer


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



class CreateAttemptAPIView(APIView):
    def post(self, request):
        pass