import typing as tp

from apps.education.models import Flow
from apps.tests.models import TestAssignment

def get_assigned_tests(flows: tp.List[Flow]) -> tp.List[TestAssignment]:
    return TestAssignment.objects.filter(flow__in=flows).all()

