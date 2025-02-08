import React, {useEffect} from "react";
import axios from "../../utils/axios.ts";
import {Table} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined,} from "@ant-design/icons";

export function UsersTab() {
    const [users, setUsers] = React.useState([]);

    const columns = [
        {
            title: "Полное имя",
            key: "full_name",
            dataIndex: "full_name",
        },
        {
            title: 'ИСУ',
            key: 'isu',
            dataIndex: "isu",
        },
        {
            title: 'Подтвержден',
            key: 'is_approved',
            render: (person: { is_approved: boolean }) =>
                person.is_approved ? <CheckCircleOutlined/> : <CloseCircleOutlined/>
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const users = await axios.get("v1/users");
            setUsers(users.data)
        }

        fetchData()
    }, []);
    return <>
        <Table dataSource={users} columns={columns} />
    </>
}