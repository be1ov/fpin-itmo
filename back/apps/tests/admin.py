from django.contrib import admin

from apps.tests.models import Test, TestAssignment, TestAttempts


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    pass

@admin.register(TestAssignment)
class TestAssignmentAdmin(admin.ModelAdmin):
    pass

@admin.register(TestAttempts)
class TestAttemptsAdmin(admin.ModelAdmin):
    pass