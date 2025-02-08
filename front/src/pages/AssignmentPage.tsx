import LayoutComponent from "../components/Layout.tsx";
import {Alert, Button, Card, Col, Row, Typography} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {TaskAssignment} from "../interfaces/TaskAssignment.interface.ts";
import axiosInstance from "../utils/axios.ts";
import {TaskSubmissionCard} from "../components/tasks/TaskSubmissionCard.tsx";
import {TaskSubmission} from "../interfaces/TaskSubmission.interface.ts";

export function AssignmentPage() {
    const {id} = useParams()

    const [assignment, setAssignment] = useState<TaskAssignment>();
    const [submission, setSubmission] = useState<TaskSubmission>();

    useEffect(() => {
        const fetchData = async () => {
            axiosInstance.get(`v1/education/assignment?id=${id}`).then(res => {
                setAssignment(res.data.data.assignment);
                setSubmission(res.data.data.submission)
            })
        }
        fetchData()
    }, []);

    const navigate = useNavigate();

    if (!assignment) {
        navigate("/404")
        return;
    }

    return <LayoutComponent>
        <Typography.Title level={2}>
            {assignment?.task.title}
        </Typography.Title>
        <Row gutter={[8, 8]}>
            <Col xs={24} xxl={18}>
                <Card title={"Описание"}>
                    <Typography.Paragraph>
                        {assignment?.task.description}
                    </Typography.Paragraph>
                </Card>
            </Col>
            <Col xs={24} xxl={6}>
                {!submission &&
                    <Alert type={"warning"} description={"Вы ещё не приступали к выполнению этого задания."}
                           action={<Button type={"primary"} onClick={() => {
                               axiosInstance.post(`/v1/education/create_submission/`, {
                                   assignment_id: assignment.id
                               }).then(res => {
                                   setSubmission(res.data)
                               })
                           }}>Начать</Button>}/>}
                {
                    submission &&
                    <TaskSubmissionCard assignment={assignment} submissionId={submission.id}/>
                }
            </Col>
        </Row>
    </LayoutComponent>;
}