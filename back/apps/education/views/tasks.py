from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.education.actions.bars import get_bars_state
from apps.education.actions.flows import get_available_flows
from apps.education.actions.tasks import get_tasks, get_task_by_id, get_assigned_tasks
from apps.education.models import TaskAssignment
from apps.education.serializers import TaskSerializer, FlowSerializer
from apps.tasks.models import Task

import datetime


class TaskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if "id" in request.query_params.keys():
            task = get_task_by_id(request.query_params["id"])
            flows = [
                assignment.flow
                for assignment in TaskAssignment.objects.filter(task=task)
            ]
            return Response(
                {
                    "status": "success",
                    "data": {
                        "task": TaskSerializer(task).data,
                        "flows": FlowSerializer(flows, many=True).data,
                    },
                }
            )

        tasks = get_tasks()
        return Response(
            {
                "status": "success",
                "data": TaskSerializer(tasks, many=True).data,
            }
        )

    def post(self, request):
        data = request.data

        action = data.get("action", None)
        if action is None:
            return Response(
                {"status": "error", "message": "No action provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task_data = data.get("data", {})

        if action == "update":
            task_id = task_data.get("id", None)
            if not task_id:
                return Response(
                    {"status": "error", "message": "Task ID is required for update"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                task = Task.objects.get(id=task_id)
            except Task.DoesNotExist:
                return Response(
                    {"status": "error", "message": "Task not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            serializer = TaskSerializer(task, data=task_data, partial=True)
        else:
            serializer = TaskSerializer(data=task_data)

        if serializer.is_valid():
            task = serializer.save()
            return Response(
                {"status": "success", "data": TaskSerializer(task).data},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "status": "error",
                    "message": "Invalid task object",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request):
        id = request.query_params.get("id", None)
        if id is None:
            return Response({"status": "error", "message": "No task id provided"})

        try:
            id = int(id)
        except ValueError:
            return Response({"status": "error", "message": "Invalid task id"})

        task = get_task_by_id(id)
        if task is None:
            return Response({"status": "error", "message": "Task not found"})

        task.delete()
        return Response({"status": "success"})


class TaskAssignView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = request.data

        task_id = data.get("task", None)
        if task_id is None:
            return Response({"status": "error", "message": "No task id provided"})

        task = get_task_by_id(task_id)
        if task is None:
            return Response({"status": "error", "message": "Task not found"})

        bars_state_id = data.get("bars_state", None)
        try:
            bars_state_id = int(bars_state_id)
        except (ValueError, TypeError):
            bars_state_id = None

        bars_state = get_bars_state(bars_state_id)

        dates = data.get("dates", None)
        if dates is None:
            return Response({"status": "error", "message": "No dates provided"})

        dates = map(datetime.datetime.fromisoformat, dates)

        deadline_fees = data.get("deadline_fees", False)
        if deadline_fees:
            fees_per_week = data.get("deadline_fee_amount", 0)
        else:
            fees_per_week = 0

        flows = get_available_flows()

        max_points = data.get("max_points", None)
        if max_points is None and bars_state is None:
            return Response({"status": "error", "message": "No max_points provided"})

        for flow in flows:
            assigned_tasks = [a.task for a in get_assigned_tasks([flow])]
            if task in assigned_tasks:
                continue
            task_assignment = TaskAssignment.objects.create(
                flow=flow,
                task=task,
                opens_at=dates["start_date"],
                deadline=dates["end_date"],
                fees=deadline_fees,
                fees_per_week=fees_per_week,
                max_points=max_points,
                bars_state=bars_state,
            )
            task_assignment.save()

        return Response({"status": "success"})
