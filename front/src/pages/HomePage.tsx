import {Button, Card, Col, Divider, Row, Space, Tag, Typography} from "antd";
import LayoutComponent from "../components/Layout.tsx";
import { useState } from "react";
import { useSelector } from "react-redux";
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

    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
        {
            id: 1,
            title: "Зачёт в среду",
            description:
                "Phasellus tristique turpis sit amet massa vehicula varius. Donec ut tellus porttitor, iaculis libero ac, vulputate arcu. Mauris tempor fermentum maximus. Quisque ac velit sed ipsum ultrices ornare. Sed ipsum dui, rhoncus dictum justo ac, egestas viverra justo. Duis interdum at leo at pharetra. Integer sed tellus nulla. Etiam consequat finibus ipsum eu aliquam. In dolor tellus, blandit ut nulla ac, luctus congue sem. Donec aliquet aliquet molestie. In faucibus, libero sit amet tempus mattis, odio sapien ornare lectus, eu vehicula nunc enim non diam. Phasellus dignissim congue lacus, sed imperdiet metus. Cras sed lectus eget nulla tincidunt suscipit. Maecenas at pulvinar magna, ut facilisis purus. Integer vel ullamcorper nisl, sed molestie mi. Duis et turpis molestie turpis scelerisque volutpat vel eu risus.",
            date: "05.12.2024",
            author: "Александр Белов",
        },
    ]);

    const educationSelector = useSelector(selectEducationData)

    return (
        <LayoutComponent>
            <Typography.Title level={2}>Добро пожаловать!</Typography.Title>
            <Space />
            {
                educationSelector.flows.length == 0 && <NoFlowsAlert />
            }
            <Divider />

            <Typography.Title level={3}>Объявления</Typography.Title>
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
        </LayoutComponent>
    );
}
