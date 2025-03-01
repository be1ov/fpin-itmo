from rest_framework import serializers

from apps.tests.models import Test, TestAssignment


class TestSerializer(serializers.Serializer):
    class Meta:
        model = Test
        fields = '__all__'

class TestAssignmentSerializer(serializers.Serializer):
    test = TestSerializer(read_only=True)
    class Meta:
        model = TestAssignment
        fields = '__all__'