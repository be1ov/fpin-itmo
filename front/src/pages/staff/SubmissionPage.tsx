import LayoutComponent from "../../components/Layout.tsx";
import {Divider, Typography} from "antd";
import {useParams} from "react-router-dom";
import {TaskSubmissionCard} from "../../components/tasks/TaskSubmissionCard.tsx";
import {AssignmentsPage} from "../AssignmentsPage.tsx";


export function SubmissionPage() {
    const {id} = useParams()
    if (!id) return <AssignmentsPage />

    return <LayoutComponent>
        <Typography.Title level={2}>Сдача задания #{id}</Typography.Title>
        <Divider/>
        <TaskSubmissionCard submissionId={id} />
    </LayoutComponent>
}