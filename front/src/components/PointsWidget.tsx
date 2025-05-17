import {Card, Col, Empty, List, Row, Skeleton, Spin, Tag, Typography} from "antd";
import React, {useEffect} from "react";
import {StarOutlined} from "@ant-design/icons";
import axiosInstance from "../utils/axios.ts";

export function PointsWidget() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState({})

    useEffect(() => {
        const fetchData = () => {
            setIsLoading(true);
            axiosInstance.get("/v1/points").then(res => {
                const data = res.data.data
                data.sort((a, b) => {
                  if (a.task_id == null) return 1;
                  if (b.task_id == null) return -1;
                  return a.task_id - b.task_id;
                });
                
                setData(data);
            }).finally(() => {
                setIsLoading(false);
            })
        }

        fetchData()
    }, [])
    return (
        <Card title={
            <Row>
                <Col sm={18}>
                    <Typography.Title level={5} style={{margin: 0}}>
                        Баллы
                    </Typography.Title>
                </Col>
                <Col sm={6}>
                    {isLoading ? (
                        <Skeleton.Button active={true} size={"small"} style={{
                            minWidth: "100%"
                        }} />
                    ) : <Tag style={{
                        width: "100%",
                        justifyContent: "center",
                        display: "flex",
                    }} color={(() => {
                        if (data.total < 60) {
                            return "red"
                        }

                        if (data.total < 75) {
                            return "blue"
                        }

                        if (data.total < 90) {
                            return "gold"
                        }

                        return "green"
                    })()} icon={<StarOutlined />}>
                        {data.total} / 100
                    </Tag>}
                </Col>
            </Row>
        }>
            {isLoading ?
                <Row style={{
                    justifyContent: "center",
                }}>
                    <Spin spinning={true}/>
                </Row>
                : (
                    <List size={"small"} bordered={true} locale={{
                        emptyText: (
                            <Empty description={<Typography>
                                <Typography.Title level={5}></Typography.Title>
                                <Typography.Text><b>Баллов пока что нет... но скоро будут!</b><br/>или нет... в любом
                                    случае, удачи!</Typography.Text>
                            </Typography>}></Empty>)
                    }} dataSource={data.points} renderItem={(item) => {
                        return <List.Item>
                            <div>
                                {item.title}
                            </div>
                            <div>
                                {item.points} / {item.max}
                            </div>
                        </List.Item>
                    }}>

                    </List>
                )
            }

        </Card>
    )
}
