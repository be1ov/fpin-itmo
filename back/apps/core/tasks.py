from celery import shared_task
import json
from django.db import connection
from django.db.models.expressions import result

from apps.core.actions.bars import get_bars_data_query
from apps.education.actions.semester import current_semester


@shared_task(name="apps.core.tasks.get_bars_data")
def get_bars_data():
    semester = current_semester()

    query = get_bars_data_query()

    with connection.cursor() as cursor:
        cursor.execute(query, [semester.id, semester.id])
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

    data = []

    for row in rows:
        row_dict = dict(zip(columns, row))

        full_name = " ".join([
            row_dict.get("first_name"),
            row_dict.get("last_name"),
            row_dict.get("patronymic") if row_dict.get("patronymic") else ""
        ])

        data.append({
            "full_name": full_name,
            "title": row_dict.get("title"),
            "status": row_dict.get("status"),
            "points": row_dict.get("points"),
        })

    result = {
        "sheet_url": "https://docs.google.com/spreadsheets/d/17Jt2K4eTw4tf-awXjNzIt_fvSsn14bD7e517ektq8PA/",
        "data": data,
    }

    return json.dumps(result, ensure_ascii=False)