import {Button, Card, Col, Divider, Layout, Row, Space, theme, Typography} from "antd";
import ButtonGroup from "antd/lib/button/button-group";
import {ChangeThemeButton} from "../components/ChangeThemeButton.tsx";
import {useState} from "react";
import {LoginModal} from "../components/LoginModal.tsx";
import {SignupModal} from "../components/SignupModal.tsx";
import {useNavigate} from "react-router-dom";
import {login} from "../actions/AuthAction.ts";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

export default function AuthPage() {
    const [isLoginOpened, setIsLoginOpened] = useState(false);
    const [isSignupOpened, setIsSignupOpened] = useState(false);

    const navigate = useNavigate();

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const screens = useBreakpoint();

    return (
        <Layout style={{height: "100vh"}}>
            <LoginModal
                isOpened={isLoginOpened}
                setIsOpened={setIsLoginOpened}
            />
            <SignupModal
                isOpened={isSignupOpened}
                setIsOpened={setIsSignupOpened}
            />

            <Layout.Header
                style={{
                    backgroundColor: colorBgContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography.Title
                    style={{
                        margin: 0,
                        padding: 0,
                    }}
                    level={2}
                >
                    PIN.DB
                </Typography.Title>
                <ChangeThemeButton/>
            </Layout.Header>
            <Layout.Content
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card
                    title={<Typography.Title level={5} style={{
                        padding: 0,
                        margin: 0,
                        display: "block",
                        textAlign: screens.xs ? "center" : "left"
                    }}>
                        Добро пожаловать!
                    </Typography.Title>}
                    style={{width: screens.xl ? "50vw" : "80vw"}}
                >
                    <Typography.Text style={{
                        display: "block",
                        textAlign: screens.xs ? "center" : "left"
                    }}>
                        Для начала работы необходимо войти в существующий
                        аккаунт или создать новый
                    </Typography.Text>
                    <Divider/>
                    <ButtonGroup style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: screens.xs ? "center" : "left",
                    }}>
                        <Space direction={screens.xs ? "vertical" : "horizontal"}>
                            <Button
                                style={{width: "100%"}}
                                type={"primary"}
                                onClick={() => setIsLoginOpened(true)}
                            >
                                Войти
                            </Button>
                            <Button onClick={() => setIsSignupOpened(true)}
                                    style={{width: "100%"}}
                            >
                                Зарегистрироваться
                            </Button>
                        </Space>

                    </ButtonGroup>
                </Card>
            </Layout.Content>
            <Layout.Footer style={{textAlign: "center"}}>
                <Divider/>
                Университет ИТМО, факультет прикладной информатики ©
                {new Date().getFullYear()}<br/><Typography.Text type={"secondary"}>Created by &lt;be1ov
                /&gt;</Typography.Text>
            </Layout.Footer>
        </Layout>
    );
}
