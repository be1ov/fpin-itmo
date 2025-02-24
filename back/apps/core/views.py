import rest_framework_simplejwt.tokens
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.serializers import FileSerializer
from apps.persons.models import ServiceUser


class FileUploadView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": "error"
        })


@authentication_classes([])
@permission_classes([])
class SignUpView(APIView):
    def post(self, request):
        first_name = request.data.get('first_name', None)
        last_name = request.data.get('last_name', None)
        patronymic = request.data.get('patronymic', None)
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        isu = request.data.get('isu', None)

        if not all([first_name, last_name, patronymic, email, password, isu]):
            return Response({
                "status": "error",
                "message": "All fields are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = ServiceUser()
        user.username = isu
        user.first_name = first_name
        user.last_name = last_name
        user.patronymic = patronymic
        user.isu = isu
        user.email_address = email
        user.set_password(password)

        user.save()
        refresh = rest_framework_simplejwt.tokens.RefreshToken.for_user(user)
        return Response({
            "status": "success",
            "data": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        })