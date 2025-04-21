from django.contrib import admin

from apps.education.models import Semester, Flow, Student, Lesson, PointsEntrance, TaskAssignment, TaskSubmission, \
    TaskSubmissionStatus, \
    TaskSubmissionStatusAttachment, BarsState, CommonLesson

admin.site.register(Semester)
admin.site.register(Flow)
admin.site.register(Lesson)
admin.site.register(PointsEntrance)

admin.site.register(TaskAssignment)
admin.site.register(TaskSubmission)
admin.site.register(TaskSubmissionStatus)
admin.site.register(TaskSubmissionStatusAttachment)
admin.site.register(BarsState)
admin.site.register(CommonLesson)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("full_name", "isu", "get_flow_title", "is_approved")
    search_fields = ("user__last_name", "user__first_name", "user__patronymic", "user__isu")
    list_filter = ("is_approved", "flow__title")
    actions = ["approve_students"]

    def full_name(self, obj):
        return obj.user.full_name

    full_name.short_description = "ФИО"

    def isu(self, obj):
        return obj.user.isu

    isu.short_description = "Табельный номер (ИСУ)"

    def get_flow_title(self, obj):
        return obj.flow.title
    get_flow_title.short_description = "Поток"

    def approve_students(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Утверждено!")
    approve_students.short_description = "Утвердить"
