from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.education.models import TaskSubmissionStatus, TaskSubmissionStatusAttachment
from apps.education.serializers import TaskSubmissionStatusAttachmentSerializer


class SubmissionStatusAttachments(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        params = request.query_params

        status_id = params.get('id', None)
        if status_id is None:
            return Response({
                "status": "error",
                "message": "Status id is required"
            })

        try:
            status = TaskSubmissionStatus.objects.get(pk=status_id)
        except TaskSubmissionStatus.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Status does not exist"
            })

        if not user.is_staff:
            if status.submission.student.user != user:
                return Response({
                    "status": "error",
                    "message": "You do not have permission to perform this action"
                })

        attachments = status.tasksubmissionstatusattachment_set.all()
        return Response({
            "status": "success",
            "data": TaskSubmissionStatusAttachmentSerializer(attachments, many=True).data
        })