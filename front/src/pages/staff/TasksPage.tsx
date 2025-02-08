import LayoutComponent from "../../components/Layout.tsx";
import {Button, Card, Col, Divider, Row, Typography} from "antd";
import {Task} from "../../interfaces/Task.interface.ts";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import axiosInstance from "../../utils/axios.ts";

export function TasksPage() {
    const [tasks, setTasks] = React.useState<Task[]>([]);

    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get("/v1/tasks").then(res => {
                setTasks(res.data.data);
            })
        }

        fetchData()
    }, []);

    return <LayoutComponent>
        <Row>
            <Col md={22}>
                <Typography.Title level={2}>Справочник «Задания» [STAFF]</Typography.Title>
                <Typography.Text>В данном справочнике представлен список заданий. Назначение задания потокам
                    осуществляется в
                    карточке задания.</Typography.Text>
            </Col>
            <Col md={2}>
                <Link to={"/staff/tasks/new"}>
                    <Button color={"primary"} variant={"solid"} style={{
                        "width": "100%"
                    }}>
                        Добавить
                    </Button>
                </Link>
            </Col>
        </Row>

        <Divider/>
        <Row gutter={[8, 8]}>
            {
                tasks.map((task: Task) => (
                    <Col md={6}>
                        <Link to={`/staff/tasks/${task.id}`}>
                            <Card key={task.id} title={task.title} size={"small"}>
                                {task.description.slice(0, 200)}
                            </Card>
                        </Link>
                    </Col>
                ))
            }

        </Row>

    </LayoutComponent>
}