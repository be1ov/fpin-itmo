import {
    Alert,
    Button,
    Card, Col,
    Empty,
    Input, Modal, notification, Row,
    Select,
    Space, Spin,
    Tag,
    Typography,
    UploadFile,
} from "antd";
import React, {useEffect, useState} from "react";
import {TaskSubmissionStatus} from "./TaskSubmissionStatus.tsx";
import axiosInstance from "../../utils/axios.ts";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    SendOutlined
} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/slices/AuthSlice.ts";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const {TextArea} = Input;

export function TaskSubmissionCard({submissionId}: {
    submissionId: string
}) {

    const auth = useSelector(selectAuth)

    const [submission, setSubmission] = useState()
    const [statuses, setStatuses] = useState<TaskSubmissionStatus[]>([]);
    const [points, setPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isOpen, setIsOpen] = useState(false)
    
    useEffect(() => {
        setIsLoading(true)
        const fetchData = () => {
            axiosInstance.get(`/v1/education/submission?id=${submissionId}`).then(res => {
                setSubmission(res.data.data.submission);
                setStatuses(res.data.data.statuses)
                setPoints(res.data.data.points)
            }).finally(() => {
                setIsLoading(false)
            })
        }
        fetchData()
    }, [isOpen, submissionId]);

    const [status, setStatus] = useState<string>("ON_REVIEW");
    const [text, setText] = useState<string>("");

    const screen = useBreakpoint()

    const [files, setFiles] = useState<UploadFile[]>([]);


    const [pointsAmount, setPointsAmount] = useState<number>(0);
    const [comment, setComment] = useState<string>()

    const [notificationApi, notificationContextHolder] = notification.useNotification();

    if (isLoading) {
        return <Spin/>
    }
    return <Space direction={"vertical"}
                  style={{width: "100%", display: "flex", justifyContent: "top"}}>
        {notificationContextHolder}
        <Modal
            open={isOpen}
            title={"Выставление оценки"}
            okText={"Сохранить"}
            onCancel={() => {
                setIsOpen(false)
            }} onOk={() => {
                axiosInstance.post("/v1/set_points/", {
                    submission_id: submissionId,
                    comment: comment,
                    points: pointsAmount
                }).then(res => {
                    notificationApi.success({
                        message: "Оценка успешно сохранена"
                    })
                }).catch(res => {
                    notificationApi.error({
                        message: "При сохранении оценки произошла ошибка"
                    })
                })
        }}>
            <Space direction={"vertical"}>
                <Typography.Text>
                    Вы сможете в дальнейшем изменить оценку, история будет сохранена.
                </Typography.Text>
                <Input type={"number"} placeholder={"Оценка"} value={pointsAmount} onChange={(event) => {
                    setPointsAmount(parseFloat(event.target.value));
                }}/>
                <TextArea placeholder={"Комментарий"} value={comment} onChange={(event) => {
                    setComment(event.target.value);
                }}/>
            </Space>
        </Modal>

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
        {
            !points && <Alert style={{
                display: "flex",
                alignItems: "center",
            }} description={<b>Работа еще не оценена!</b>} icon={<CloseCircleFilled/>} showIcon={true} type="error"
                              action={[
                                  <Button onClick={() => {
                                      setIsOpen(true)
                                  }}>Оценить</Button>
                              ]}/>
        }

        {points &&
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
                        }}/><br/></div>}
                        <b>Работа оценена!</b><br/>
                        Оценил: {points?.author.short_name}<br/>
                        Дата: {dayjs(points?.date).format("DD.MM.YYYY, HH:mm:ss")}
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
                            }}>{points.amount}</b>
                            {auth.user?.is_staff &&
                                <Button onClick={() => {
                                    setIsOpen(true)
                                }}>Изменить</Button>}
                        </Space>
                    </Col>
                </Row>
            </Typography>} icon={<CheckCircleFilled/>} showIcon={screen.sm} type="success"/>
        }

    </Space>

}