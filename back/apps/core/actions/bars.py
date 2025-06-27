def get_bars_data_query():
    return """
    WITH latest_status AS (
        SELECT DISTINCT ON (submission_id) *
        FROM education_tasksubmissionstatus
        ORDER BY submission_id, date DESC
    ),
    ats AS (
        SELECT ts.*, ls.*
        FROM education_tasksubmission ts
        JOIN latest_status ls ON ts.id = ls.submission_id
    ),
    points AS (
        SELECT DISTINCT ON (task_submission_id) *
        FROM education_pointsentrance
        ORDER BY task_submission_id, date DESC
    ),
    test_points AS (
        SELECT DISTINCT ON (tests_testattempts.id) *
        FROM tests_testattempts
        WHERE tests_testattempts.test_passed
        ORDER BY tests_testattempts.id, tests_testattempts.points DESC
    )
    SELECT u.last_name,
           u.first_name,
           u.patronymic,
           t.title,
           ats.status,
           COALESCE(points.amount, 0) as points
    FROM education_taskassignment AS ta
    JOIN education_flow AS f ON f.id = ta.flow_id
    JOIN tasks_task AS t ON t.id = ta.task_id
    JOIN education_student AS s ON s.flow_id = ta.flow_id
    JOIN persons_serviceuser AS u ON u.id = s.user_id
    LEFT JOIN education_tasksubmission AS ts ON ts.student_id = s.id
    AND ts.assignment_id = ta.id
    LEFT JOIN ats ON ats.submission_id = ts.id
    LEFT JOIN points ON points.task_submission_id = ts.id

    UNION ALL

    SELECT
      u.last_name,
      u.first_name,
      u.patronymic,
      t.title,
      MAX(CASE WHEN tat.test_passed THEN 'Зачет' ELSE 'Незачет' END),
      MAX(CASE WHEN tat.test_passed THEN tat.points ELSE 0 END) as points
    FROM tests_testassignment tas
    JOIN education_flow AS f ON f.id = tas.flow_id
    JOIN tests_test as t ON t.id = tas.test_id
    JOIN education_student AS s ON s.flow_id = tas.flow_id
    JOIN persons_serviceuser AS u ON u.id = s.user_id
    LEFT JOIN test_points AS tat ON tat.student_id = s.id
        AND tat.test_assignment_id = tas.id
    GROUP BY u.id, t.id;
    """