from apps.education.models import TaskAssignment
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.tg.actions.sending import send_message


@receiver(post_save, sender=TaskAssignment)
def send_message_after_task_assignment(
    sender, instance: TaskAssignment, created, **kwargs
):
    if not created:
        return

    deadline_str = (
        instance.deadline.strftime("%d.%m.%Y %H:%M")
        if instance.deadline
        else "Без срока"
    )

    students = instance.flow.student_set.filter(is_approved=True).select_related(
        "user__telegramaccount"
    )

    for student in students:
        if not student.user.is_staff:
            continue

        tg = getattr(student.user, "telegramaccount", None)
        if not tg or not (tg.is_confirmed and tg.telegram_id):
            continue

        message = f"""<b>🔔 На платформе PIN.DB появилось новое задание!</b>

<b>📚 Задание:</b> {instance.task.title}

<b>📖 Описание:</b>
{instance.task.description or "Отсутствует"}

<b>🗓 Дедлайн:</b> {deadline_str}
"""

        send_message(tg.telegram_id, message)
