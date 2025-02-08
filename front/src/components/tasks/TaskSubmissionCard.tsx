import {
    Alert,
    Button,
    Card, Col, Divider,
    Empty,
    GetProp,
    Input, Row,
    Select,
    Space,
    Tag,
    Typography,
    Upload,
    UploadFile,
    UploadProps
} from "antd";
import React, {useEffect, useState} from "react";
import {TaskSubmissionStatus} from "./TaskSubmissionStatus.tsx";
import axiosInstance from "../../utils/axios.ts";
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    CloseCircleFilled,
    InboxOutlined,
    PaperClipOutlined,
    SendOutlined
} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/slices/AuthSlice.ts";
import Dragger from "antd/es/upload/Dragger";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const {TextArea} = Input;

export function TaskSubmissionCard({submissionId}: {
    submissionId: string
}) {

    const auth = useSelector(selectAuth)

    const [submission, setSubmission] = useState()
    const [statuses, setStatuses] = useState<TaskSubmissionStatus[]>([]);

    const fetchData = () => {
        axiosInstance.get(`/v1/education/submission?id=${submissionId}`).then(res => {
            setSubmission(res.data.data.submission);
            setStatuses(res.data.data.statuses)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const [status, setStatus] = useState<string>("ON_REVIEW");
    const [text, setText] = useState<string>("");

    const screen = useBreakpoint()

    const [files, setFiles] = useState<UploadFile[]>([]);

    return <Space direction={"vertical"}
                  style={{width: "100%", display: "flex", justifyContent: "top"}}>

        <Card title={"Сдача работы"} style={{
            maxHeight: "calc(80vh - 350px)",
            overflowY: "auto",
        }}
              extra={submission ? <Tag>#{submission.id}</Tag> : ""} size={"small"}>
            <Space direction={"vertical"} style={{width: "100%", overflowY: 'auto'}} size={"small"}>
                {submission && (
                    statuses.length === 0 ? (
                        <Empty description="Нет информации :("/>
                    ) : (
                        statuses.map(status => (
                            <TaskSubmissionStatus status={status} key={status.id}/>
                        ))
                    )
                )}
            </Space>
        </Card>
        <Card size={"small"} actions={[
            <Button icon={<SendOutlined/>} type={"primary"} onClick={() => {
                axiosInstance.post('/v1/submission/add_status/', {
                    "submission_id": submission?.id,
                    "status": status,
                    "text": text,
                    "files": files
                }).then((res) => {
                    fetchData()
                })
            }}>Отправить</Button>
        ]}>
            <Space direction={"vertical"} style={{"width": "100%"}}>
                {/*<Dragger*/}
                {/*    customRequest={({file, onSuccess, onError} => {*/}

                {/*    })}>*/}
                {/*    <p className="ant-upload-drag-icon">*/}
                {/*        <InboxOutlined/>*/}
                {/*    </p>*/}
                {/*    <p className="ant-upload-hint">*/}
                {/*        Нажмите здесь или перетащите файл для загрузки*/}
                {/*    </p>*/}
                {/*</Dragger>*/}
                <TextArea
                    maxLength={1000}
                    placeholder="Напишите что-нибудь приятное..."
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
                {
                    auth.user?.is_staff &&
                    <Select
                        defaultValue={status}
                        style={{width: "100%"}}
                        onChange={(value) => {
                            setStatus(value)
                        }}
                        options={[
                            {value: 'ON_REVIEW', label: 'На проверке'},
                            {value: 'APPROVED', label: 'Согласовано'},
                            {value: 'DECLINED', label: 'Отклонено'},
                            {value: 'DEFENDED', label: 'Защищено'},
                            {value: 'WORKING', label: '--В работе'},
                        ]}
                    />
                }
            </Space>
        </Card>
        <Alert style={{
            display: "flex",
            alignItems: "center",
        }} description={<b>Работа еще не оценена!</b>} icon={<CloseCircleFilled/>} showIcon={true} type="error"
               action={[
                   <Button>Оценить</Button>
               ]}/>

        <Alert style={{
            display: "flex",
            alignItems: "center"
        }} description={<Typography>
            <Row style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: screen.sm ? "row" : "column"
            }}>
                <Col sm={18} style={{
                    textAlign: screen.xs ? "center" : "start",
                }}>
                    {screen.xs && <div><CheckCircleFilled style={{
                        fontSize: "2em",
                        color: "limegreen"
                    }} /><br/></div>}
                    <b>Работа оценена!</b><br/>
                    Оценил: Белов А.О.<br/>
                    Дата: 02.03.2025
                </Col>
                <Col sm={6} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: screen.sm ? "right" : "center",
                    textAlign: "center"
                }}>
                    <Space direction={"vertical"}>
                        <b style={{
                            fontSize: "2em",
                        }}>50,00</b>
                        <Button>Изменить</Button>
                    </Space>
                </Col>
            </Row>
        </Typography>} icon={<CheckCircleFilled/>} showIcon={screen.sm} type="success"/>
    </Space>

}