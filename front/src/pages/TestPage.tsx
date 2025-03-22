import LayoutComponent from "../components/Layout.tsx";
import {Button, Card, Divider, Empty, List, Space, Spin, Tag, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TypingEffect from "../components/TypingEffect.tsx";
import axiosInstance from "../utils/axios.ts";
import {ClockCircleOutlined} from "@ant-design/icons";

export function TestPage() {
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [assignment, setAssignment] = useState({})
    const [attempts, setAttempts] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchData = () => {
            axiosInstance.get(`/v1/tests/assignment?assignment_id=${params.id}`)
                .then(res => {
                    setAssignment(res.data.data.assignment);
                    setAttempts(res.data.data.attempts);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        fetchData();
    }, [params]);

    return <LayoutComponent>
        <Space direction={"vertical"} style={
            {
                width: '100%',
            }
        }>
            {
                (isLoading) && <div style={{
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
                    </Space>
                </div>
            }
            {!isLoading &&
                <>
                    <Typography.Title level={2}>{assignment?.test?.title}</Typography.Title>
                    <Divider/>
                    <Card title={"Попытки"}>
                        <Space direction={"vertical"} style={{width: "100%"}}>
                            <Typography.Text>Количество использованных попыток: {attempts.length}</Typography.Text>
                            <Typography.Text>Штраф за
                                попытки: {assignment.attempts_fees ? assignment.attempt_fee_amount : "не начисляется"}</Typography.Text>
                            {attempts.length > 0 &&
                                <><Divider/>
                                    <List bordered dataSource={attempts} renderItem={(item) =>
                                        <List.Item key={item.id}>
                                            <List.Item.Meta
                                                title={`Попытка №${item.attempt_number}`}
                                                description={item.created_at}/>
                                            <div>
                                                {!item.result_at && <Tag color={"error"}>нет результата</Tag>}
                                                {item.result_at && <>
                                                    {!item.is_revised && <Tag color={"warning"}>результат получен</Tag>}
                                                    {item.is_revised && <Tag
                                                        color={item.test_passed ? "success" : "error"}>{item.points} б.</Tag>}
                                                </>}
                                            </div>
                                        </List.Item>
                                    } locale={{
                                        emptyText: "Попыток не было"
                                    }}>
                                    </List>
                                </>
                            }
                            <Divider/>
                            <Button type={"primary"} onClick={() => {
                                axiosInstance.post(`/v1/tests/new_attempt/`, {
                                    assignment_id: params.id,
                                }).then(res => {
                                    window.location.href = res.data.data.attempt_link
                                })
                            }}>Новая попытка</Button>
                        </Space>
                    </Card>
                </>
            }
        </Space>
    </LayoutComponent>
}