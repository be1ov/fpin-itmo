from rest_framework import serializers

from apps.tests.models import Test, TestAssignment, TestAttempts


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'title']

class TestAssignmentSerializer(serializers.ModelSerializer):
    test = TestSerializer(read_only=True)
    class Meta:
        model = TestAssignment
        fields = '__all__'

class TestAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAttempts
        fields = '__all__'