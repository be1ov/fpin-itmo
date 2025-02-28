"""
URL configuration for db_lk project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from apps.attendance.views import UploadAttendanceView
from apps.core.views import FileUploadView, SignUpView
from apps.education.views import SemesterViewSet, EducationViewSet, AvailableFlowsView, SaveUserFlowsRequestView, \
    AddSubmissionStatusView
from apps.education.views.bars import BarsStatesView
from apps.education.views.lessons import LessonsView
from apps.education.views.points import PointsView, SetPointsView
from apps.education.views.submissions import SubmissionStatusAttachments
from apps.education.views.tasks import TaskView, TaskAssignView
from apps.persons.views import PersonViewSet, CurrentUserView, UsersViewSet
from db_lk import settings

router = DefaultRouter()
router.register(r'people', PersonViewSet)
router.register(r'semester', SemesterViewSet)
router.register(r'education', EducationViewSet, basename='education')
router.register(r'users', UsersViewSet, basename='users')

api_urls = [
    path("flows/", AvailableFlowsView.as_view()),
    path("flows/request/", SaveUserFlowsRequestView.as_view()),
    path("submission/add_status/", AddSubmissionStatusView.as_view()),
    path("tasks/", TaskView.as_view()),
    path("tasks/assign/", TaskAssignView.as_view()),
    path("bars/states", BarsStatesView.as_view()),
    path("submission/status_attachments", SubmissionStatusAttachments.as_view()),
    path("lessons/", LessonsView.as_view()),
    path("files/upload/", FileUploadView.as_view()),
    path("lesson/upload_attendance/", UploadAttendanceView.as_view()),
    path("points/", PointsView.as_view()),
    path("set_points/", SetPointsView.as_view()),
    path("", include(router.urls)),
]

urlpatterns = [
    path('sql_explorer/', include('explorer.urls')),
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_urls)),
    path('api/auth/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('api/auth/signup', SignUpView.as_view()),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
