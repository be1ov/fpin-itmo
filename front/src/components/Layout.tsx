import Sider from "./Sider.tsx";
import {Avatar, Button, Dropdown, Layout, Menu, Space, Tag, theme, Typography} from "antd";
import {BellFilled, MenuFoldOutlined, MenuUnfoldOutlined, MoreOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import {ChangeThemeButton} from "./ChangeThemeButton.tsx";
import {useSelector} from "react-redux";
import {selectEducationData} from "../redux/slices/EducationSlice.ts";
import {selectAuth} from "../redux/slices/AuthSlice.ts";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

export default function LayoutComponent({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = React.useState(false);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const educationData = useSelector(selectEducationData);
    const auth = useSelector(selectAuth);

    const screen = useBreakpoint();

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Layout.Header
                style={{
                    padding: 0,
                    // backgroundColor: colorBgContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography.Title level={screen.xs ? 5 : 2} style={{
                    margin: 50,
                    textAlign: "center",
                    color: "white"
                }}>
                    {
                        screen.xs ? "PDB" : "PIN.DB"
                    }
                </Typography.Title>
                {/*<Button*/}
                {/*    type="text"*/}
                {/*    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}*/}
                {/*    onClick={() => setCollapsed(!collapsed)}*/}
                {/*    style={{*/}
                {/*        fontSize: "16px",*/}
                {/*        width: 64,*/}
                {/*        height: 64,*/}
                {/*    }}*/}
                {/*/>*/}

                {screen.lg && <Space style={{color: "white", maxWidth: "50%"}} align={"center"}>
                    <div style={{minHeight: "100%", display: "flex", alignItems: "center"}}>
                        {educationData.semester && (
                            <Tag color={"cyan"}>{educationData.semester.title}</Tag>
                        )}
                        {educationData.flows.map((flow) => {
                            return <Tag color={"red"}>{flow.title}</Tag>;
                        })}
                    </div>

                    <div>
                        {/*<Avatar>*/}
                        {/*    {auth.user?.first_name[0]}*/}
                        {/*    {auth.user?.last_name[0]}*/}
                        {/*</Avatar>{" "}*/}
                        <>
                            <Dropdown.Button overlay={(<Menu>
                                <Menu.Item>Выйти</Menu.Item>
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
                            color: "white"
                        }}
                    />
                </Space>}

            </Layout.Header>
            <Layout>
                <Sider collapsed={collapsed} setCollapsed={setCollapsed}/>
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
