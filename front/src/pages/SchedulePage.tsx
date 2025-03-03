import {
    Alert,
    Badge,
    Button,
    Calendar,
    CalendarProps,
    Divider,
    Modal,
    notification,
    Space,
    Typography,
    Upload
} from "antd";
import dayjs, {Dayjs} from "dayjs";
import LayoutComponent from "../components/Layout.tsx";
import {useEffect, useState} from "react";
import axiosInstance from "../utils/axios.ts";
import {UploadOutlined} from "@ant-design/icons";
import {toBase64} from "../utils/files.ts";

const LessonBadge = ({apiData, dayJsDate}: { apiData: any, dayJsDate: Dayjs }) => {
    const formattedDayjsDate = dayJsDate.format('YYYY-MM-DD');
    if (apiData.date == formattedDayjsDate) {
        switch (apiData.type) {
            case "LECTURE":
                return <li><Badge status={"processing"} text={"Лекция"} style={
                    {
                        color: apiData?.isObligatory ? "red" : "inherit",
                        fontWeight: apiData?.isObligatory ? "bold" : "inherit",
                    }
                }/></li>

            case "PRACTICE":
                return <li><Badge status={"warning"} text={"Практика"} style={
                    {
                        color: apiData?.isObligatory ? "red" : "inherit",
                        fontWeight: apiData?.isObligatory ? "bold" : "inherit",
                    }
                }/></li>

            case "CONSULTATION":
                return <li><Badge status={"success"} text={"Консультация"} style={
                    {
                        color: apiData?.isObligatory ? "red" : "inherit",
                        fontWeight: apiData?.isObligatory ? "bold" : "inherit",
                    }
                }/></li>

            case "CREDIT":
                return <li><Badge status={"error"} text={"Зачет"} style={
                    {
                        color: apiData?.isObligatory ? "red" : "inherit",
                        fontWeight: apiData?.isObligatory ? "bold" : "inherit",
                    }
                }/></li>

            case "EXAM":
                return <li><Badge status={"error"} text={"Экзамен"} style={
                    {
                        color: apiData?.isObligatory ? "red" : "inherit",
                        fontWeight: apiData?.isObligatory ? "bold" : "inherit",
                    }
                }/></li>
        }

    }
}

export default function SchedulePage() {

    const [selectedLessonDate, setSelectedLessonDate] = useState<Dayjs>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [notificationApi, contextHolder] = notification.useNotification();

    // const lessonData = [
    //     {
    //         "date": "2024-11-24",
    //         "type": "LECTURE",
    //         "isObligatory": true
    //     },
    //     {
    //         "date": "2024-11-24",
    //         "type": "PRACTICE"
    //     },
    //     {
    //         "date": "2025-02-25",
    //         "type": "CREDIT"
    //     }
    // ]

    const [lessonsData, setLessonsData] = useState([])
    const [selectedLessonData, setSelectedLessonData] = useState({})

    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get("/v1/lessons").then(res => {
                setLessonsData(res.data.data.map(lesson => ({
                    "date": dayjs(lesson.date).format("YYYY-MM-DD"),
                    "type": lesson.type,
                })))
            })
        }

        fetchData()
    }, []);

    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get(`/v1/lessons?date=${dayjs(selectedLessonDate).format("YYYY-MM-DD")}`).then(res => {
                setSelectedLessonData(res.data.data)
            })
        }

        fetchData()
    }, [selectedLessonDate]);

    const dateCellRender = (value: Dayjs) => {
        return (
            <ul className="events">
                {lessonsData.map((item) => (
                    <LessonBadge apiData={item} dayJsDate={value}/>
                ))}
            </ul>
        )
    }

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };

    return (
        <>
            <Modal open={isOpen}
                   onCancel={() => setIsOpen(false)}
                   footer={[]}
                   title={`${selectedLessonData?.lesson?.title} – ${dayjs(selectedLessonData?.lesson?.date).format("DD.MM.YYYY")}`}>
                <Divider/>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Typography.Title level={5}>Отметка о посещении</Typography.Title>
                    {!selectedLessonData.attendance && <>
                        <Typography.Text>Вы еще не отправляли информацию о посещении этого занятия!</Typography.Text>
                        <Upload customRequest={async ({file, onSuccess, onError}) => {
                            try {
                                const base64 = await toBase64(file);

                                const payload = {
                                    filename: file.name,
                                    binary: base64,
                                    lessonDate: selectedLessonDate?.format("YYYY-MM-DD")
                                }

                                await axiosInstance.post("/v1/lesson/upload_attendance/", payload)
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                onSuccess()
                                notification.success({
                                    message: "Информация отправлена!"
                                })
                            } catch (error) {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                onError(error)
                            } finally {
                                setIsOpen(false)
                            }
                        }}>
                            <Button icon={<UploadOutlined/>}>Загрузить</Button>
                        </Upload>
                    </>}
                    {selectedLessonData.attendance && <>
                        {!selectedLessonData.attendance.is_approved &&
                            <Alert type={"warning"} description={"Информация о посещении занятия на рассмотрении."}/>}
                        {selectedLessonData.attendance.is_approved &&
                            <Alert type={"success"} description={"Посещение подтверждено, спасибо!"}/>}
                    </>}
                </Space>
            </Modal>
            <LayoutComponent>
                <Typography.Title level={2}>
                    Расписание занятий
                </Typography.Title>
                <Alert type={"warning"} description={"Информация о посещениях предоставляется для фактически посещенного занятия"} />}
                <Calendar mode={"month"} cellRender={cellRender} onSelect={(date, selectInfo) => {
                    if (lessonsData.find(e => e.date == date.format("YYYY-MM-DD"))) {
                        setSelectedLessonDate(date)
                        setIsOpen(true)
                    }
                }}/>
            </LayoutComponent>
        </>
    )
}
