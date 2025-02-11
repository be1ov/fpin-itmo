from django.db import transaction
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.flows import get_users_flows, get_available_flows
from apps.education.actions.semester import current_semester
from apps.education.actions.students import get_student
from apps.education.actions.tasks import get_assigned_tasks, get_submission, get_submission_statuses, get_assignment, \
    get_submission_by_id
from apps.education.models import Semester, TaskSubmissionStatus, TaskSubmission, Student, PointsEntrance
from apps.education.serializers import SemesterSerializer, FlowSerializer, TaskAssignmentSerializer, \
    TaskSubmissionSerializer, TaskSubmissionStatusSerializer, PointsEntranceSerializer
from db_lk.utils import date_from_request_or_now


class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer

    class Meta:
        model = Semester
        fields = '__all__'

    @action(detail=False, methods=['GET'], url_path='current', url_name='semesters')
    def current_semester(self, request):
        semester = current_semester()

        if semester:
            return Response(self.get_serializer(semester).data)

        return Response({'error': 'No semester found for the given date.'}, status=404)


class EducationViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='current')
    def get_education(self, request):
        user = request.user
        date = date_from_request_or_now(request)

        semester = current_semester(date)

        if not semester:
            return Response({"detail": "No current semester found."}, status=404)

        flows = get_users_flows(user, date)

        return Response({
            "semester": SemesterSerializer(semester).data,
            "flows": FlowSerializer(flows, many=True).data
        })

    @action(detail=False, methods=['get'], url_path='assignments')
    def get_tasks(self, request):
        user = request.user
        date = date_from_request_or_now(request)

        flows = get_users_flows(user, date)

        tasks = get_assigned_tasks(flows)

        if len(tasks) == 0:
            return Response({"detail": "No tasks found."}, status=404)

        serialized_tasks = TaskAssignmentSerializer(tasks, many=True).data

        for task in serialized_tasks:
            student = get_student(task['flow']['id'], user)
            submission = get_submission(task["id"], student)

            task["submission"] = TaskSubmissionSerializer(submission).data
            # if submission is None:
            #     task['isCompleted'] = False
            #     continue
            #
            # status = get_submission_statuses(submission).last()
            # if status is None:
            #     task['isCompleted'] = False
            #     continue
            #
            # if status.status == TaskSubmissionStatus.SubmissionStatuses.DEFENDED:
            #     task['isCompleted'] = True
            # else:
            #     task['isCompleted'] = False

        return Response({
            "tasks": serialized_tasks,
        })

    @action(detail=False, methods=['get'], url_path='assignment')
    def get_assignment(self, request):
        user = request.user

        assignment_id = request.query_params.get('id', None)
        if assignment_id is None:
            return Response({"detail": "No assignment id provided."}, status=404)

        assignment = get_assignment(assignment_id)
        if assignment is None:
            return Response({"detail": "No assignment found."}, status=404)

        submission = TaskSubmission.objects.filter(assignment=assignment, student__user=user).first()
        submission_data = TaskSubmissionSerializer(submission).data

        statuses = get_submission_statuses(submission)
        submission_data["statuses"] = TaskSubmissionStatusSerializer(statuses, many=True).data

        data = TaskAssignmentSerializer(assignment).data
        return Response({
            "status": "success",
            "data": {
                "assignment": data,
                "submission": submission_data if submission else None,
            }
        })

    @action(detail=False, methods=['get'], url_path='submission')
    def get_submission(self, request):
        user = request.user

        submission_id = request.query_params.get('id', None)
        if submission_id is None:
            return Response({
                "status": "error",
                "message": "No submission id provided"
            }, status=400)

        submission = TaskSubmission.objects.filter(id=submission_id).first()
        if submission is None:
            return Response({
                "status": "error",
                "message": "No submission found"
            }, status=404)

        if not user.is_staff and submission.student.user != user:
            return Response({
                "status": "error",
                "message": "You are not allowed to GET this submission"
            })

        statuses = get_submission_statuses(submission)

        points = PointsEntrance.objects.filter(submission=submission).first()

        return Response({
            "status": "success",
            "data": {
                "submission": TaskSubmissionSerializer(submission).data,
                "statuses": TaskSubmissionStatusSerializer(statuses, many=True).data,
                "points": PointsEntranceSerializer(points).data if points is not None else None
            }
        })

    @action(methods=['post'], url_path='create_submission', detail=False)
    def create_submission(self, request):
        user = request.user
        assignment_id = request.data['assignment_id']
        if assignment_id is None:
            return Response({"detail": "No assignment id provided."}, status=404)

        assignment = get_assignment(assignment_id)
        if assignment is None:
            return Response({"detail": "No assignment found."}, status=404)

        student = get_student(assignment.flow, user)
        if student is None:
            return Response({"detail": "No student in flow found."}, status=404)

        submission = get_submission(assignment, student)
        if submission:
            return Response({"detail": "Submission already exists."}, status=409)

        with transaction.atomic():
            submission = TaskSubmission()
            submission.assignment = assignment
            submission.student = student
            submission.save()

            status = TaskSubmissionStatus()
            status.submission = submission
            status.author = user
            status.text = "Приступаю к выполнению"
            status.status = TaskSubmissionStatus.SubmissionStatuses.WORKING
            status.save()

        return Response(TaskSubmissionSerializer(submission).data)

    @action(methods=['get'], url_path='submission_statuses', detail=False)
    def get_statuses(self, request):
        submission_id = request.query_params.get('submission_id', None)

        submission = get_submission_by_id(submission_id)
        if submission is None:
            return Response({"detail": "No submission found."}, status=404)

        statuses = get_submission_statuses(submission)

        return Response(TaskSubmissionStatusSerializer(statuses, many=True).data)


class AvailableFlowsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        flows = get_available_flows()
        return Response({
            "status": "success",
            "data": {
                "flows": FlowSerializer(flows, many=True).data
            }
        })


class SaveUserFlowsRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        flows = request.data['flows']
        if flows is None:
            return Response({
                "status": "error",
                "message": "Flows is required field"
            }, status=400)

        available_flows = [_f.id for _f in get_available_flows()]
        semester = current_semester()

        with transaction.atomic():
            for flow in flows:
                if flow not in available_flows:
                    return Response({
                        "status": "error",
                        "message": "Flow is not available"
                    }, status=400)

                if Student.objects.filter(user=user, flow_id=flow, from_date=semester.from_date).exists():
                    return Response({
                        "status": "error",
                        "message": "FLOWS_REQUEST_ALREADY_EXISTS"
                    }, status=400)

                student = Student()
                student.user = user
                student.flow_id = flow
                student.from_date = semester.from_date
                student.to_date = semester.to_date
                student.is_approved = False
                student.save()

        return Response({
            "status": "success",
        })


class AddSubmissionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        good_statuses = [
            "WORKING",
            "ON_REVIEW",
            "APPROVED",
            "DEFENDED",
            "DECLINED"
        ]

        status = request.data.get("status")
        if status not in good_statuses:
            return Response({
                "status": "error",
                "message": "Invalid status"
            }, status=400)

        submission = get_submission_by_id(request.data.get("submission_id"))
        if submission is None:
            return Response({
                "status": "error",
                "message": "No submission found."
            }, status=404)

        if not user.is_staff:
            if submission.student.user != user:
                return Response({
                    "status": "error",
                    "message": "You are not allowed to submit this submission."
                })

            if status not in ["WORKING", "ON_REVIEW"]:
                return Response({
                    "status": "error",
                    "message": "Invalid status"
                })

        submission_status = TaskSubmissionStatus()
        submission_status.submission = submission
        submission_status.author = user
        submission_status.status = status
        submission_status.text = request.data.get("text")
        submission_status.save()

        return Response({
            "status": "success"
        })