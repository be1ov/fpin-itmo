import {Alert, Form, Input, Modal} from "antd";
import {LockOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import { useRef } from "react";
import { signup } from "../actions/AuthAction";

export function SignupModal({isOpened, setIsOpened}: {isOpened: boolean, setIsOpened: (value: boolean) => void}) {
    const lastNameRef = useRef();
    const firstNameRef = useRef();
    const patronymicRef = useRef();
    const emailRef = useRef();
    const isuRef = useRef();
    const passwordRef = useRef();
    const repeatPasswordRef = useRef();

    return <Modal open={isOpened} onCancel={() => setIsOpened(false)} cancelText={"Закрыть"} okText={"Зарегистрироваться"} title={"Регистрация"} onOk={() => {
        onOk={() => {
            signup({
                lastName: lastNameRef.current?.input.value,
                firstName: firstNameRef.current?.input.value,
                patronymic: patronymicRef.current?.input.value,
                email: emailRef.current?.input.value,
                isu: isuRef.current?.input.value,
                password: passwordRef.current?.input.value
            })
        }}
    }}>
        <Form
            onSubmitCapture={(e) => {
                e.preventDefault(); // just to prevent page reload omg it makes so much sense
            }}
        >
            <Form.Item style={{marginBottom: 10, marginTop: 20}}>
                <Input size={"large"} placeholder="Фамилия" ref={lastNameRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Имя" ref={firstNameRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Отчество" ref={patronymicRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="E-mail" prefix={<MailOutlined />} ref={emailRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input size={"large"} placeholder="Табельный номер" prefix={<UserOutlined />} ref={isuRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input.Password size={"large"} placeholder="Пароль" prefix={<LockOutlined />} ref={passwordRef} />
            </Form.Item>
            <Form.Item style={{marginBottom: 10}}>
                <Input.Password size={"large"} placeholder="Повтор пароля" prefix={<LockOutlined />} ref={repeatPasswordRef} />
            </Form.Item>
        </Form>
        <Alert type={"warning"} message={"После регистрации будет необходимо дождаться утверждения учетной записи администратором"} />
    </Modal>
}