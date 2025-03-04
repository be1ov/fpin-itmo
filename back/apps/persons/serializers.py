from rest_framework import serializers

from apps.persons.models import ServiceUser


class ServiceUserSerializer(serializers.ModelSerializer):
    is_staff = serializers.SerializerMethodField()
    short_name = serializers.SerializerMethodField()

    class Meta:
        model = ServiceUser
        fields = ["full_name", "last_name", "first_name", "patronymic", "isu", "is_approved", "is_staff", "short_name", "github"]

    def get_is_staff(self, obj):
        return obj.is_staff

    def get_short_name(self, obj):
        return obj.last_name + " " + obj.first_name[0] + "." + (f" {obj.patronymic[0]}." if obj.patronymic else "")