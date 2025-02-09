import {Button, Card, Col, Divider, Empty, Row, Space, Tag, Typography} from "antd";
import LayoutComponent from "../components/Layout.tsx";
import {useState} from "react";
import {useSelector} from "react-redux";
import {selectEducationData} from "../redux/slices/EducationSlice.ts";
import NoFlowsAlert from "../components/flows/NoFlowsAlert.tsx";

interface Announcement {
    id: number;
    date: string;
    title: string;
    description: string;
    author: string;
}

export default function HomePage() {

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const educationSelector = useSelector(selectEducationData)

    return (
        <LayoutComponent>
            <Space>
                <Typography.Title level={2}>Добро пожаловать!</Typography.Title>

                {
                    educationSelector.flows.length == 0 && <NoFlowsAlert/>
                }
                <Divider/>

                <Typography.Title level={3}>Объявления</Typography.Title>

                {announcements.length == 0 && <Empty description={<Typography>
                    <Typography.Title level={5}>Хорошие новости!</Typography.Title>
                    <Typography.Text>Их нет... скоро появятся... наверное???</Typography.Text>
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
            </Space>
        </LayoutComponent>
    );
}
