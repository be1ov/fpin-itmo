from apps.education.models import BarsState


def get_bars_state(id):
    return BarsState.objects.filter(id=id).first()