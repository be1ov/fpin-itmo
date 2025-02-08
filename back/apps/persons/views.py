from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.persons.models import ServiceUser
from apps.persons.serializers import ServiceUserSerializer


class PersonViewSet(ModelViewSet):
    queryset = ServiceUser.objects.all()
    serializer_class = ServiceUserSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = ServiceUserSerializer(user, context={'request': request})
        return Response(serializer.data)


class UsersViewSet(ModelViewSet):
    permission_classes = [IsAdminUser]
    queryset = ServiceUser.objects.all()
    serializer_class = ServiceUserSerializer