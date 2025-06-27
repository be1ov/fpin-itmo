import json

from main import app
from sheets import write_to_sheet

RPC_TASK_NAME = "apps.core.tasks.get_bars_data"

@app.task
def export_data_to_google_sheet():
    result = app.send_task(RPC_TASK_NAME)

    try:
        raw_data = result.get(timeout=60)
        result_data = json.loads(raw_data)
        sheet_url = result_data["sheet_url"]
        data = result_data["data"]

        write_to_sheet(sheet_url, data)

    except Exception as e:
        pass