# Generated by Django 5.1.6 on 2025-03-17 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance', '0003_remove_attendance_student_attendance_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='attachment',
            field=models.FileField(blank=True, null=True, upload_to='attendances'),
        ),
    ]
