import {TaskSubmissionStatusInterface} from "../../interfaces/TaskSubmissionStatusInterface.ts";
import {Button, Card, Dropdown, Popconfirm, Row, Space, Tag, Typography, Upload} from "antd";
import {
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    MoreOutlined,
    PaperClipOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import {getMessage} from "../../utils/messages.ts";
import dayjs from "dayjs";
import React, {useState} from "react";
import axiosInstance from "../../utils/axios.ts";

export function TaskSubmissionStatus({status}: { status: TaskSubmissionStatusInterface }) {
    const [fileList, setFileList] = useState([])

    useState(() => {
        const fetchData = () => {
            axiosInstance.get(`/v1/submission/status_attachments?id=${status.id}`).then(res => {
                setFileList(res.data.data.map(attachment => ({
                    uid: attachment.id,
                    name: attachment.title,
                    status: "done",
                    url: attachment.url,
                })))
            })
        }

        fetchData()
    }, [])

    return <>
        <Card
            bordered={true}
            title={<Typography.Text>
                {status.author.short_name}
            </Typography.Text>}
            size={"small"}
            extra={<Row>
                &nbsp;&nbsp;<Tag>{getMessage(status.status)}, {dayjs(status.date).format("DD.MM.YYYY")}</Tag>
            </Row>
            }
        >
            <Typography.Paragraph>{status.text ||
                <Typography.Text type={"secondary"}>Здесь должен быть комментарий, но его
                    нет...</Typography.Text>}</Typography.Paragraph>
            <Upload fileList={fileList} disabled={true}/>
        </Card></>
}