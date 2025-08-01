# Generated by Django 5.1.5 on 2025-01-18 17:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Flow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='PointsEntrance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=5)),
                ('comment', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Semester',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('from_date', models.DateField()),
                ('to_date', models.DateField()),
                ('base_repo_url', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_date', models.DateField()),
                ('to_date', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TaskAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('opens_at', models.DateTimeField()),
                ('deadline', models.DateTimeField()),
                ('fine_per_week', models.DecimalField(decimal_places=2, max_digits=5)),
                ('max_points', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='TaskSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(default=datetime.datetime(2025, 1, 18, 20, 8, 59, 581278))),
            ],
        ),
        migrations.CreateModel(
            name='TaskSubmissionStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=1000)),
                ('date', models.DateTimeField(default=datetime.datetime(2025, 1, 18, 20, 8, 59, 581459))),
                ('status', models.CharField(choices=[('WORKING', 'В работе'), ('ON_REVIEW', 'На проверке'), ('DECLINED', 'Отклонено'), ('APPROVED', 'Согласовано'), ('DEFENDED', 'Зачтено')], default='ON_REVIEW', max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='TaskSubmissionStatusAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('attachment', models.URLField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Lesson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('date', models.DateTimeField()),
                ('is_obligatory', models.BooleanField()),
                ('type', models.CharField(choices=[('LECTURE', 'Лекция'), ('PRACTICE', 'Практика'), ('CONSULTATION', 'Консультация'), ('CREDIT', 'Зачет'), ('EXAM', 'Экзамен')], default='LECTURE', max_length=30)),
                ('flows', models.ManyToManyField(to='education.flow')),
            ],
        ),
    ]
