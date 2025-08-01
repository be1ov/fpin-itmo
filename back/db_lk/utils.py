import random
import string
from datetime import datetime

from rest_framework.response import Response


def date_from_request_or_now(request):
    date_str = request.query_params.get('date')
    if date_str:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
    else:
        date = datetime.today().date()
    return date


def generate_random_password(length=12):
    """
    Generates random password of given length

    :param length: length of password
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
