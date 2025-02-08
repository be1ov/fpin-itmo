import LayoutComponent from "../components/Layout.tsx";
import {Card, Col, Divider, Empty, FloatButton, Row, Tag, Typography} from "antd";
import {useEffect, useState} from "react";
import axiosInstance from "../utils/axios.ts";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {TaskAssignment} from "../interfaces/TaskAssignment.interface.ts";
import {BookFilled, PlusCircleFilled, SettingFilled} from "@ant-design/icons";
import {StaffOnlyGuard} from "../components/guards/StaffOnlyGuard.tsx";

export function AssignmentsPage() {
    useEffect(() => {
        const fetchData = async () => {
            axiosInstance.get("/v1/education/assignments").then((res) => {
                const tasks: TaskAssignment[] = res.data.tasks;

                tasks.map((task) => {
                    task.deadline = dayjs(task.deadline);
                    task.opens_at = dayjs(task.opens_at);
                });

                tasks.sort((a, b) => {
                    return dayjs(a.deadline).isBefore(dayjs(b.deadline))
                        ? -1
                        : 1;
                });

                tasks.sort((a, b) => {
                    return a.isCompleted - b.isCompleted;
                });
                setTasks(res.data.tasks);
            });
        };

        fetchData();
    }, []);

    const [tasks, setTasks] = useState<TaskAssignment[]>([]);

    return (
        <>
            <StaffOnlyGuard>
                <FloatButton.Group shape="circle" trigger={"hover"} icon={<SettingFilled/>} tooltip={"Настройки"}>
                    <FloatButton icon={<BookFilled/>} tooltip="Список заданий" href={"/staff/tasks"}/>
                    <FloatButton icon={<PlusCircleFilled/>} tooltip="Список заданий" href={"/staff/tasks/assign"}/>
                </FloatButton.Group>
            </StaffOnlyGuard>

            <LayoutComponent>
                <Typography.Title level={2}>Задания</Typography.Title>
                <Typography.Text>
                    Задания отсортированы в порядке наступления дедлайнов
                </Typography.Text>
                <Divider/>
                {tasks.length == 0 && <Empty description={<Typography>
                    <Typography.Title level={5}>Какая жалость!</Typography.Title>
                    <Typography.Text>Пока что заданий нет :(<br />Но вы не переживайте, скоро мы это исправим!</Typography.Text>
                </Typography>}></Empty>}
                <Row gutter={[8, 8]}>
                    {tasks.map((assignment: TaskAssignment) => (
                        <Col md={8}>
                            <Link to={`/assignment/${assignment.id}`}>
                                <Card title={assignment.task.title}>
                                    <Typography.Text>
                                        {assignment.task.description}
                                    </Typography.Text>
                                    <Divider/>
                                    <Tag
                                        color={(() => {
                                            const currentDate = dayjs();
                                            if (assignment.isCompleted) {
                                                return "success";
                                            }
                                            if (
                                                assignment.deadline.isBefore(
                                                    currentDate
                                                )
                                            ) {
                                                return "error";
                                            }
                                            if (
                                                assignment.deadline.diff(
                                                    currentDate,
                                                    "day"
                                                ) <= 7
                                            ) {
                                                return "warning";
                                            }
                                            return "default";
                                        })()}
                                    >
                                        {assignment.opens_at.format(
                                            "DD.MM.YYYY"
                                        )}{" "}
                                        -{" "}
                                        {assignment.deadline.format(
                                            "DD.MM.YYYY"
                                        )}
                                    </Tag>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </LayoutComponent>
        </>
    );
}
