import LayoutComponent from "../components/Layout.tsx";
import {Card, Col, Divider, Empty, notification, Row, Space, Spin, Typography} from "antd";
import React, {useEffect} from "react";
import Typing from 'react-typing-effect';
import TypingEffect from "../components/TypingEffect.tsx";
import axiosInstance from "../utils/axios.ts";
import {Link} from "react-router-dom";

export default function TestsPage() {
    const [tests, setTests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showStatus, setShowStatus] = React.useState(false)

    const statuses = [
        "Придумываем задания...",
        "Пьём кофе...",
        "Портим картинки...",
        "Прячем правильные ответы...",
        "Урезаем баллы (несильно)",
        "Заставляем вас думать...",
        "Проверяем, насколько вы внимательны...",
        "Считаем, сколько раз вы перерешали...",
        "Делаем варианты максимально похожими...",
        "Добавляем странные формулировки...",
        "Придумываем вопросы, на которые сами не знаем ответ...",
        "Заменяем 'очевидный' ответ на другой...",
        "Просто статус по-приколу, + балл за внимательность",
        "Делаем так, чтобы 'всё выше перечисленное' не работало...",
        "Придумываем новые способы вас запутать...",
        "Прячем лёгкие вопросы среди сложных...",
        "Добавляем 'все ответы верны', но один — нет...",
        "Ставим таймер на сдачу, чтобы было веселее...",
        "Думаем, как повысить процент не сдавших...",
        "Ждём, когда вы запаникуете...",
    ];

    const [notificationApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        setShowStatus(true)
        setIsLoading(true)
        const fetchData = () => {
            axiosInstance.get("/v1/tests").then(res => {
                setTests(res.data.data.tests)
                setIsLoading(false)
            }).catch((err) => {
                if (err?.response?.data?.message == "No flows found") {
                    notificationApi.warning({
                        message: "Вы не в потоке, тестов для вас пока что нет :(",
                        closable: true,
                        duration: -1,
                        placement: "top"
                    })
                } else {
                    notificationApi.warning({
                        message: "Что-то точно произошло, но пока не понимаем, что... Думаем!",
                        closable: true,
                        duration: -1,
                        placement: "bottom"
                    })
                }
            })
        }
        fetchData()
    }, []);


    return <LayoutComponent>
        {contextHolder}
        <Space direction={"vertical"} style={{
            width: "100%",
        }}>
            <Typography.Title level={2}>Тесты</Typography.Title>
            <Typography.Text>В этом разделе представлены тесты, которые вам предстоит пройти... и уже пройденные и
                зачтенные...
                и незачтенные тоже.
                <br/>Короче, все тесты. Здесь живут тесты.</Typography.Text>
            <Divider/>
            <Row gutter={[8, 8]}>
                {
                    tests.map((test) => {
                        return <Col xs={24} lg={8}>
                            <Link to={`/test-assignment/${test.id}`}>
                                <Card title={test.test.title}>
                                    <Typography.Paragraph>Балл: {test.min_points}–{test.max_points}</Typography.Paragraph>
                                </Card>
                            </Link>
                        </Col>
                    })
                }
            </Row>
            {
                (isLoading || showStatus) && <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center"
                }}>
                    <Space direction={"vertical"}>
                        {isLoading && <>
                            <Spin/>
                        </>}
                        {tests.length == 0 && <Empty description={"Тестов пока что нет..."}/>}
                        {showStatus &&
                            <TypingEffect texts={statuses} typingSpeed={20} erasingSpeed={20} delayBeforeErase={1500}/>}
                    </Space>
                </div>
            }
        </Space>
    </LayoutComponent>
}