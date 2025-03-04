import {Dropdown, Layout, Menu, Space, Tag, theme, Typography} from "antd";
import {
    CalendarOutlined, FileTextOutlined,
    HomeOutlined, SettingFilled, SignatureOutlined,
    UserOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {ChangeThemeButton} from "./ChangeThemeButton.tsx";
import {useDispatch, useSelector} from "react-redux";
import {selectEducationData} from "../redux/slices/EducationSlice.ts";
import {authSlice, selectAuth} from "../redux/slices/AuthSlice.ts";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import {useLocation, useNavigate} from "react-router-dom";
import {store} from "../redux/store.ts";

export default function LayoutComponent({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {

    const user = useSelector(selectAuth).user

    const location = useLocation();
    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const educationData = useSelector(selectEducationData);
    const auth = useSelector(selectAuth);

    const screen = useBreakpoint();

    const menuEntries = [
        {
            key: '/',
            icon: <HomeOutlined/>,
            label: 'Главная',
            show: true
        },
        {
            key: '/schedule',
            icon: <CalendarOutlined/>,
            label: 'Расписание',
            show: (user?.is_approved && educationData?.flows.length > 0) || user?.is_staff
        },
        {
            key: '/assignments',
            icon: <FileTextOutlined/>,
            label: 'Задания',
            show: (user?.is_approved && educationData?.flows.length > 0) || user?.is_staff
        },
        {
            key: '/tests',
            icon: <SignatureOutlined/>,
            label: 'Тесты',
            show: (user?.is_approved && educationData?.flows.length > 0) || user?.is_staff
        },
        {
            key: "/staff",
            icon: <SettingFilled/>,
            label: "Настройки",
            show: user?.is_staff
        }
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Layout.Header
                style={{
                    padding: 0,
                    backgroundColor: colorBgContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                }}
            >
                <div style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: "start",
                    width: "100%"
                }}>

                    <Typography.Title level={screen.xs ? 5 : 2} style={{
                        margin: 50,
                        textAlign: "center",
                    }}>
                        {
                            screen.xs ? "PDB" : "PIN.DB"
                        }
                    </Typography.Title>
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={[location.pathname]}
                        onClick={(e) => {
                            navigate(`${e.key}`)
                        }}
                        items={menuEntries
                            .filter(obj => obj?.show === true || obj.show === undefined)
                            .map(({show, ...rest}) => rest)}
                        style={{
                            height: '100%', borderBottom: 0,
                            width: "60%"
                        }}
                    />
                </div>

                {screen.lg && <Space style={{color: "white", maxWidth: "50%"}} align={"center"}>
                    <div style={{minHeight: "100%", display: "flex", alignItems: "center"}}>
                        {educationData.semester && (
                            <Tag color={"cyan"}>{educationData.semester.title}</Tag>
                        )}
                        {educationData.flows.map((flow) => {
                            return <Tag color={"red"} key={flow.id}>{flow.title}</Tag>;
                        })}
                    </div>

                    <div>
                        {/*<Avatar>*/}
                        {/*    {auth.user?.first_name[0]}*/}
                        {/*    {auth.user?.last_name[0]}*/}
                        {/*</Avatar>{" "}*/}
                        <>
                            <Dropdown.Button overlay={(<Menu>
                                <Menu.Item onClick={() => {
                                    store.dispatch(authSlice.actions.logout())
                                }}>Выйти</Menu.Item>
                            </Menu>)}>
                                <div><UserOutlined/> {auth.user?.first_name} {auth.user?.last_name}</div>

                            </Dropdown.Button>
                        </>
                        {/*<>*/}
                        {/*    <Dropdown placement="bottomRight" trigger={['click']}*/}
                        {/*              overlayStyle={{maxHeight: 350, overflowY: 'scroll'}}>*/}
                        {/*        <Button icon={<BellFilled/>} shape="circle"/>*/}
                        {/*    </Dropdown>*/}
                        {/*</>*/}
                    </div>

                    <ChangeThemeButton
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                            // color: "white"
                        }}
                    />
                </Space>}

            </Layout.Header>
            <Layout>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Layout.Content
                        style={{
                            margin: "24px 16px",
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Layout.Content>
                </Layout>
            </Layout>

        </Layout>
    );
}
