import {Button, Card, Col, Divider, Empty, List, Row, Space, Tag, Typography, Alert, notification} from "antd";
import LayoutComponent from "../components/Layout.tsx";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectEducationData} from "../redux/slices/EducationSlice.ts";
import NoFlowsAlert from "../components/flows/NoFlowsAlert.tsx";
import {PointsWidget} from "../components/PointsWidget.tsx";
import {selectAuth} from "../redux/slices/AuthSlice.ts";
import {GithubOutlined} from "@ant-design/icons";
import {GithubLink} from "../utils/github.ts";
import {useLocation} from "react-router-dom";
import TelegramModal from "../components/TelegramModal.tsx";

interface Announcement {
    id: number;
    date: string;
    title: string;
    description: string;
    author: string;
}

export default function HomePage() {

    const auth = useSelector(selectAuth);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const educationSelector = useSelector(selectEducationData)

    const { search } = useLocation();

    // const query = new URLSearchParams(search);
    // const status = query.get('status');

    const [notificatonApi, contextHolder] = notification.useNotification();

    // useEffect(() => {
    //     if (!status) {
    //         return;
    //     }
    //
    //     switch (status) {
    //         case "gh_success":
    //             notificatonApi.success({
    //                 message: "Ура! Github успешно привязан, теперь вы можете авторизовываться через него."
    //             })
    //             break;
    //         case "gh_error":
    //             notificatonApi.error({
    //                 message: "Произошла ошибка во время привязки Github, повторите попытку позднее"
    //             })
    //             break;
    //     }
    // }, [status]);

    return (
        <LayoutComponent>
            <TelegramModal />
            {contextHolder}
            <Space direction={"vertical"} style={{
                width: "100%",
            }}>
                <Typography.Title level={2}>Добро пожаловать!</Typography.Title>

                {
                    educationSelector.flows.length == 0 && <NoFlowsAlert/>
                }

                {
                    !auth.user?.github && <Alert
                        icon={<GithubOutlined style={{}}/>} showIcon message={"Привяжем GitHub?"}
                        description={"Так мы сможем автоматически отслеживать состояние пулл-реквестов, " +
                            "а вы – авторизовываться в PIN.DB через GitHub!"}
                        action={<Button type={"primary"} onClick={() => {
                            GithubLink()
                        }}>Привязать GitHub</Button>}/>
                }

                

                <Row gutter={[16, 16]}>
                    <Col sm={18}>
                        <Card title={<Row style={{
                            alignItems: "center"
                        }}>
                            <Col sm={22}>
                                <Typography.Title level={5} style={{
                                    margin: 0
                                }}>Объявления</Typography.Title>
                            </Col>
                            <Col sm={2}>
                                {auth.user?.is_staff &&
                                    <Button style={{width: "100%"}} type={"primary"}>
                                        Добавить
                                    </Button>
                                }
                            </Col>
                        </Row>}>
                            {announcements.length == 0 && <Empty description={<Typography>
                                <Typography.Title level={5}>Хорошие новости!</Typography.Title>
                                <Typography.Text>Их нет... скоро появятся... наверное..?</Typography.Text>
                            </Typography>}></Empty>}

                            <Row gutter={[8, 8]}>
                                {announcements.map((announcement: Announcement) => (
                                    <Col md={6}>
                                        <Card
                                            size={"small"}
                                            extra={<Tag>{announcement.date}</Tag>}
                                            title={announcement.title}
                                        >
                                            {(() => {
                                                if (announcement.description.length > 180) {
                                                    return (
                                                        announcement.description.slice(0, 180) +
                                                        " ..."
                                                    );
                                                }
                                                return announcement.description;
                                            })()}
                                            <Divider
                                                style={{
                                                    marginBottom: "1em",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography.Text>
                                                    {announcement.author}
                                                </Typography.Text>
                                                <Button type={"primary"}>Открыть</Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                    </Col>
                    <Col sm={6}>
                        <PointsWidget/>
                    </Col>
                </Row>
            </Space>
        </LayoutComponent>
    );
}
