from django.contrib import admin

from apps.projects.models import Project, ProjectParticipant, ProjectStatus, ProjectTask, ProjectTaskStatus, \
    SemesterProject


@admin.register(Project)
class ProjectParticipantAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectParticipant)
class ProjectParticipantAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectStatus)
class ProjectTaskAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectTask)
class ProjectTaskAdmin(admin.ModelAdmin):
    pass


@admin.register(ProjectTaskStatus)
class SemesterProjectAdmin(admin.ModelAdmin):
    pass


@admin.register(SemesterProject)
class SemesterProjectAdmin(admin.ModelAdmin):
    pass