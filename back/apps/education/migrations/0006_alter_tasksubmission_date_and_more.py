# Generated by Django 5.1.5 on 2025-02-04 05:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0005_alter_tasksubmission_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasksubmission',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 4, 8, 15, 2, 310351)),
        ),
        migrations.AlterField(
            model_name='tasksubmissionstatus',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 4, 8, 15, 2, 310680)),
        ),
    ]
