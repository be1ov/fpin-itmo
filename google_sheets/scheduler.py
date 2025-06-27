from apscheduler.schedulers.blocking import BlockingScheduler
from tasks import export_data_to_google_sheet

scheduler = BlockingScheduler()

scheduler.add_job(export_data_to_google_sheet.delay, "cron", minute="*/5")

print("Google sheet exporter scheduler запущен")
scheduler.start()
