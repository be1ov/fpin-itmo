from django.apps import AppConfig


class EducationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.education'

    def ready(self):
        # импортим сигналы при старте
        import apps.education.signals
