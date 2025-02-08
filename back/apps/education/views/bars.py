from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.semester import current_semester
from apps.education.models import BarsState
from apps.education.serializers import BarsStateSerializer


class BarsStatesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        semester = current_semester()
        states = BarsState.objects.filter(semester=semester).all()
        return Response({
            "status": "success",
            "data": BarsStateSerializer(states, many=True).data
        })
