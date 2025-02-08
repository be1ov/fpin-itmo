import LayoutComponent from "../../components/Layout.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button, Checkbox, DatePicker, Divider, Input, Row, Select, Space, Typography} from "antd";
import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axios.ts";
import {Task} from "../../interfaces/Task.interface.ts";
import dayjs from "dayjs";

export function TaskPage() {
    const {id} = useParams()
    const newTask = id === "new"

    const [task, setTask] = useState<Task>({
        title: "",
        description: "",
        id: 0
    });
    const [taskTitle, setTaskTitle] = useState("");

    const [barsStates, setBarsStates] = useState([]);
    const [selectedBarsStates, setSelectedBarsStates] = useState([]);

    const [maximumPoints, setMaximumPoints] = useState(0);

    const [deadlineFees, setDeadlineFees] = useState<boolean>(false)
    const [deadlineFeeAmount, setDeadlineFeeAmount] = useState(0);

    const [dates, setDates] = useState<dayjs.Dayjs[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            axiosInstance.get(`/v1/tasks?id=${id}`).then(res => {
                const task = res.data.data.task;
                setTask(task);
                setTaskTitle(task.title);
            })

            axiosInstance.get(`/v1/bars/states`).then(res => {
                setBarsStates(res.data.data);
            })
        }

        if (!newTask) {
            fetchData()
        }
    }, []);

    return <LayoutComponent>
        <Typography.Title level={2}>
            {newTask && "Новое задание"}
            {!newTask && taskTitle}
        </Typography.Title>
        <Divider/>
        <Space direction={"vertical"} style={{width: "100%"}}>
            <Typography.Text>Название задания</Typography.Text>
            <Input value={task?.title} onChange={(e) => {
                setTask({
                    ...task,
                    title: e.target.value
                })
            }}/>
            <Typography.Text>Описание задачи</Typography.Text>

            <Input.TextArea value={task?.description} onChange={(e) => {
                setTask({
                    ...task,
                    description: e.target.value
                })
            }}/>

            <Space>
                <Button type="primary" onClick={() => {
                    axiosInstance.post(`/v1/tasks/`, {
                        "action": newTask ? "create" : "update",
                        "data": {
                            ...task,
                            id: newTask ? undefined : task.id
                        },
                    }).then(res => {
                        if (res.data.status == "success") {
                            navigate("/staff/tasks")
                        }
                    })
                }}>
                    {newTask ? "Создать" : "Сохранить"}
                </Button>

                {!newTask &&
                    <Button variant={"outlined"} color={"danger"} onClick={() => {
                        axiosInstance.delete(`/v1/tasks/?id=${id}`).then(res => {
                            if (res.data.status == "success") {
                                navigate("/staff/tasks")
                            }
                        })
                    }}>
                        Удалить
                    </Button>
                }
            </Space>
        </Space>

        <Divider/>
        <Typography.Title level={4}>Выдача задания</Typography.Title>
        {newTask && <Alert type={"info"} description={"Функционал выдачи заданий будет доступен после создания"}/>}

        {!newTask && <>
            <Space direction={"vertical"} style={{width: '100%'}}>
                <Alert type={"info"}
                       description={"Для редактирования или удаления выданного задания воспользуйтесь админ-панелью Django"}/>
                <Typography.Text>Учитывается в БАРС (справочно)</Typography.Text>
                <Select style={{width: "100%"}} options={barsStates.map(barsState => (
                    {
                        value: barsState.id,
                        label: `${barsState.title} (${barsState.minimum_points}-${barsState.maximum_points})`,
                    }
                ))} onChange={setSelectedBarsStates}/>
                <Typography.Text>Максимальный балл</Typography.Text>
                <Input type={"number"} value={maximumPoints} onChange={(e) => {
                    setMaximumPoints(parseFloat(e.target.value))
                }}/>
                <Typography.Text>Дата выдачи и дедлайн</Typography.Text>
                <Space>
                    <DatePicker.RangePicker onChange={(e) => {
                        if (e == null) return;
                        setDates(e)
                    }}/>
                    <Checkbox checked={deadlineFees} onChange={(e) => {
                        setDeadlineFees(e.target.checked)
                    }}>Снимать баллы за пропуск дедлайна каждую неделю</Checkbox>
                    {deadlineFees && <Input type={"number"} value={deadlineFeeAmount} onChange={(e) => {
                        setDeadlineFeeAmount(parseFloat(e.target.value))
                    }}/>}
                </Space>
                <Button type="primary" onClick={() => {
                    axiosInstance.post(`/v1/tasks/assign/`, {
                        "task": task.id,
                        "bars_state": selectedBarsStates,
                        "max_points": maximumPoints,
                        "deadline_fees": deadlineFees,
                        "deadline_fee_amount": deadlineFeeAmount,
                        "dates": {
                            "start_date": dates[0].format("YYYY-MM-DD"),
                            "end_date": dates[1].format("YYYY-MM-DD"),
                        }
                    }).then(res => {
                        if (res.data.status == "success") {
                            navigate("/staff/tasks")
                        }
                    })
                }}>
                    Выдать всем потокам
                </Button>
            </Space>
        </>}
    </LayoutComponent>
}