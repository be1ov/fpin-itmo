import LayoutComponent from "../../components/Layout.tsx";
import {Divider, Tabs} from "antd";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/slices/AuthSlice.ts";
import {UsersTab} from "./UsersTab.tsx";
import {SubmissionsTab} from "./SubmissionsTab.tsx";
import { TotalTab } from "../../components/staff/tabs/TotalTab.tsx";

export function StaffPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const auth = useSelector(selectAuth)
    if (!auth.user?.is_staff) {
        navigate("/");
    }

    const tabs = [
        {
            label: "Пользователи",
            key: "users",
            children: <UsersTab/>
        },
        {
            label: "Сдачи работ",
            key: "submissions",
            children: <SubmissionsTab/>
        },
        {
            label: "Задания",
            key: "tasks",
            children: ""
        },
        {
            label: "Сводная таблица",
            key: "total",
            children: <TotalTab />
        }
    ]

    const [activeKey, setActiveKey] = useState<string>('students');

    useEffect(() => {
        const path = location.pathname.split('/')[2];

        if (!path) {
            navigate("/staff/users")
            return;
        }

        setActiveKey(path);

    }, [location]);

    const handleTabChange = (key: string) => {
        setActiveKey(key);
        navigate(`/staff/${key}`);
    };

    return <LayoutComponent>
        <h1>Администрирование</h1>
        <Divider/>
        <Tabs tabPosition={"left"} activeKey={activeKey} onChange={handleTabChange} items={tabs}/>
    </LayoutComponent>
}