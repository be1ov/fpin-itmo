# Generated by Django 5.1.5 on 2025-02-05 09:04

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0013_alter_tasksubmission_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasksubmission',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 5, 12, 4, 24, 631532)),
        ),
        migrations.AlterField(
            model_name='tasksubmissionstatus',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 5, 12, 4, 24, 631808)),
        ),
    ]
