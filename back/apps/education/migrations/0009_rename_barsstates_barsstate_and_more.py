# Generated by Django 5.1.5 on 2025-02-04 09:53

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0008_alter_tasksubmission_date_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='BarsStates',
            new_name='BarsState',
        ),
        migrations.AlterField(
            model_name='tasksubmission',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 4, 12, 53, 2, 565732)),
        ),
        migrations.AlterField(
            model_name='tasksubmissionstatus',
            name='date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 4, 12, 53, 2, 566009)),
        ),
    ]
