import {Button, Layout, Menu, theme, Typography} from "antd";
import {
    BookOutlined,
    CalendarOutlined,
    CheckCircleOutlined, FileTextOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingFilled,
    StarOutlined,
} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectAuth} from "../redux/slices/AuthSlice.ts";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

export default function Sider({collapsed, setCollapsed}: {
    collapsed: boolean,
    setCollapsed: (collapsed: boolean) => void
}) {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const screens = useBreakpoint();

    const location = useLocation();
    const navigate = useNavigate();

    const [menuEntries, setMenuEntries] = useState([
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
        },
        {
            key: '/schedule',
            icon: <CalendarOutlined/>,
            label: 'Расписание',
        },
        {
            key: '/assignments',
            icon: <FileTextOutlined/>,
            label: 'Задания'
        },
        // {
        //     key: '/points',
        //     icon: <StarOutlined/>,
        //     label: 'Баллы',
        // }
    ]);

    const user = useSelector(selectAuth).user

    useEffect(() => {
        if (user?.is_staff) {
            setMenuEntries((_menuEntries) => {
                return [..._menuEntries, {
                    key: "/staff",
                    icon: <SettingFilled/>,
                    label: "Настройки"
                }];
            })
        }
    }, [user]);

    return <Layout.Sider collapsed={screens.xs} style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        insetInlineStart: 0,
        top: 64,
        bottom: 0,
        scrollbarWidth: 'thin',
        scrollbarGutter: 'stable',
    }}>

    </Layout.Sider>
}