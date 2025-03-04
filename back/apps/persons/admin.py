from django.contrib import admin
from apps.persons.models import ServiceUser
from django.contrib.auth.admin import UserAdmin


class UserAgentAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets
    ADDITIONAL_USER_FIELDS = (
        (None, {'fields': ('isu', 'patronymic', 'is_approved', 'github', 'github_username', 'github_access_token')}),
    )
    fieldsets = fieldsets + ADDITIONAL_USER_FIELDS

    search_fields = ("last_name", "first_name", "patronymic", "isu")
    list_display = ("full_name", "isu", "is_approved")
    list_filter = ("is_approved",)
    actions = ["approve_users"]

    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = "ФИО"

    def approve_users(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, "Утверждено!")
    approve_users.short_description = "Утвердить"


admin.site.register(ServiceUser, UserAgentAdmin)