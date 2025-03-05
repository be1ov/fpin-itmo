from django.contrib import admin

from apps.attendance.models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_approved')
    list_filter = ("is_approved",)
    actions = ("approve",)

    def attachment_link(self, obj):
        return obj.attachment

    def approve(self, request, queryset):
        queryset.update(is_approved=True)
        queryset.update(attachment=None)
        self.message_user(request, "Посещение подтверждено")
    approve.short_description = "Подтвердить"