from os import access

import rest_framework_simplejwt.tokens
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.actions.github import get_access_token, get_user_data
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
        first_name = request.data.get('firstName', None)
        last_name = request.data.get('lastName', None)
        patronymic = request.data.get('patronymic', None)
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        isu = request.data.get('isu', None)

        if not all([first_name, last_name, email, password, isu]):
            return Response({
                "status": "error",
                "message": "All fields excepting `patronymic` are required"
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

class GithubLinkAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        user = request.user

        code = request.data.get('code', None)
        if code is None:
            return Response({
                "status": "error",
                "message": "Code field excepting `code` are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = get_access_token(code)
        except Exception as e:
            return Response({
                "status": "error",
                "message": "Internal server error: access"
            }, status=status.HTTP_400_BAD_REQUEST)

        user_data = get_user_data(access_token)
        gh_id = user_data.get('id', None)
        if gh_id is None:
            return Response({
                "status": "error",
                "message": "Internal server error: gh_id"
            }, status=status.HTTP_400_BAD_REQUEST)

        username = user_data.get('login', None)
        if username is None:
            return Response({
                "status": "error",
                "message": "Internal server error: username"
            }, status=status.HTTP_400_BAD_REQUEST)

        user.github = gh_id
        user.github_username = username
        user.github_access_token = access_token
        user.save()

        return Response({
            "status": "success",
        })

@authentication_classes([])
@permission_classes([])
class GithubAuthAPIView(APIView):
    def post(self, request):
        code = request.data.get('code', None)
        if code is None:
            return Response({
                "status": "error",
                "message": "Code field excepting `code` are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            access_token = get_access_token(code)
        except Exception as e:
            return Response({
                "status": "error",
                "message": "Internal server error"
            }, status=status.HTTP_400_BAD_REQUEST)

        user_data = get_user_data(access_token)
        github_id = user_data.get('id', None)
        if github_id is None:
            return Response({
                "status": "error",
                "message": "Internal server error"
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = ServiceUser.objects.get(github=github_id)
        except ServiceUser.DoesNotExist:
            return Response({
                "status": "error",
                "message": "User does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        refresh = rest_framework_simplejwt.tokens.RefreshToken.for_user(user)
        return Response({
            "status": "success",
            "data": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        })