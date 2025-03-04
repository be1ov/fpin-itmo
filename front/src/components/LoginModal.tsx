import {Button, Form, Input, Modal, notification, Space} from "antd";
import {GithubFilled, LockOutlined, UserOutlined} from "@ant-design/icons";
import React, { useRef } from "react";
import {login} from "../actions/AuthAction.ts";
import {useNavigate} from "react-router-dom";
import {GithubAuth} from "../utils/github.ts";

export function LoginModal({
    isOpened,
    setIsOpened,
}: {
    isOpened: boolean;
    setIsOpened: (value: boolean) => void;
}) {
    const loginRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();

    const [notificatonApi, contextHolder] = notification.useNotification();

    const sendLogin = () => {
        const _login = loginRef.current?.input.value;
        const _password = passwordRef.current?.input.value;

        login(_login, _password).then(() => {
            navigate("/");
        }).catch(() => {
            notificatonApi.error({
                message: "Неправильно введён ИСУ или пароль – авторизация не удалась"
            })
        });
    }

    return (
        <Modal
            open={isOpened}
            onCancel={() => setIsOpened(false)}
            title={"Авторизация"}
            footer={[]}
        >
            {contextHolder}
            <Form
                onSubmitCapture={(e) => {
                    e.preventDefault(); // just to prevent page reload omg it makes so much sense
                    sendLogin()
                }}
            >
                <Form.Item style={{ marginBottom: 10, marginTop: 20 }}>
                    <Input
                        size={"large"}
                        placeholder="Табельный номер (ИСУ)"
                        prefix={<UserOutlined />}
                        ref={loginRef}
                    />
                </Form.Item>
                <Form.Item>
                    <Input.Password
                        size={"large"}
                        placeholder="Пароль"
                        prefix={<LockOutlined />}
                        ref={passwordRef}
                    />
                </Form.Item>
                <Space direction={"vertical"} style={{
                    width: "100%"
                }}>
                    <Button type={"primary"} style={{
                        width: "100%"
                    }} onClick={() => {
                        sendLogin()
                    }}>
                        Войти по паролю
                    </Button>
                    <Button style={{
                        width: "100%"
                    }} icon={<GithubFilled/>} onClick={() => {
                        GithubAuth()
                    }}>
                        Войти через Github
                    </Button>
                </Space>

            </Form>
        </Modal>
    );
}
