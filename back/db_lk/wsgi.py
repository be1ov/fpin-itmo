"""
WSGI config for db_lk project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

import os
import sys

# Add the apps directory to the Python path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps"))


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'db_lk.settings')

application = get_wsgi_application()
