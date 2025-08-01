# Generated by Django 5.1.6 on 2025-03-01 19:57

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='test',
            options={'verbose_name': 'Тесты', 'verbose_name_plural': 'Тест'},
        ),
        migrations.AlterField(
            model_name='testassignment',
            name='attempt_fee_amount',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='testattempts',
            name='created_at',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
