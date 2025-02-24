import { Form, Input, Modal } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRef } from "react";

export function LoginModal({
    isOpened,
    setIsOpened,
    sendLogin,
}: {
    isOpened: boolean;
    setIsOpened: (value: boolean) => void;
    sendLogin: (login: string, password: string) => Promise<void>;
}) {
    const loginRef = useRef();
    const passwordRef = useRef();

    return (
        <Modal
            open={isOpened}
            onCancel={() => setIsOpened(false)}
            cancelText={"Закрыть"}
            okText={"Войти"}
            title={"Вход"}
            onOk={() => {
                const login = loginRef.current?.input.value;
                const password = passwordRef.current?.input.value;

                sendLogin(login, password);
            }}
        >
            <Form
                onSubmitCapture={(e) => {
                    e.preventDefault(); // just to prevent page reload omg it makes so much sense
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
            </Form>
        </Modal>
    );
}
